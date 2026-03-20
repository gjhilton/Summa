import {
	LsdStrings,
	LsdBooleans,
	LineState,
	ExtendedItemState,
	SubtotalItemState,
	AnyLineState,
	CalculationState,
	ItemType,
	isExtendedItem,
	isSubtotalItem,
} from '@/types/calculation';
import {
	normalizeEarlyModernInput,
	formatEarlyModernOutput,
} from '@/utils/earlyModern';
import { isValidRoman, romanToInteger, integerToRoman } from '@/utils/roman';
import { penceToLsd, LSD_MULTIPLIERS } from '@/utils/currency';

const EMPTY_LITERALS: { l: string; s: string; d: string } = {
	l: '',
	s: '',
	d: '',
};
const EMPTY_FIELD_ERRORS: { l: boolean; s: boolean; d: boolean } = {
	l: false,
	s: false,
	d: false,
};

function hasCryptoUUID(): boolean {
	return (
		typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
	);
}

// Fallback for non-secure HTTP contexts (e.g. LAN dev access over plain HTTP)
function randomUUIDFallback(): string {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		const r = (Math.random() * 16) | 0;
		return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
	});
}

function generateId(): string {
	return hasCryptoUUID() ? crypto.randomUUID() : randomUUIDFallback();
}

export function emptyLine(): LineState {
	return {
		id: generateId(),
		itemType: ItemType.LINE_ITEM,
		title: '',
		error: false,
		fieldErrors: EMPTY_FIELD_ERRORS,
		literals: EMPTY_LITERALS,
		totalPence: 0,
	};
}

export function emptyExtendedItem(): ExtendedItemState {
	return {
		id: generateId(),
		itemType: ItemType.EXTENDED_ITEM,
		title: '',
		error: false,
		fieldErrors: EMPTY_FIELD_ERRORS,
		quantityError: false,
		literals: EMPTY_LITERALS,
		quantity: 'j',
		basePence: 0,
		totalPence: 0,
	};
}

export function emptySubtotalItem(): SubtotalItemState {
	const lines: AnyLineState[] = [emptyLine(), emptyLine()];
	const { totalPence, totalDisplay } = computeGrandTotal(lines);
	return {
		id: generateId(),
		itemType: ItemType.SUBTOTAL_ITEM,
		title: '',
		lines,
		totalPence,
		totalDisplay,
		error: false,
	};
}

function clearSubtotalItem(line: SubtotalItemState): SubtotalItemState {
	const lines: AnyLineState[] = [emptyLine(), emptyLine()];
	const { totalPence, totalDisplay } = computeGrandTotal(lines);
	return { ...line, title: '', lines, totalPence, totalDisplay, error: false };
}

function clearExtendedItem(line: ExtendedItemState): ExtendedItemState {
	return {
		...line,
		title: '',
		literals: EMPTY_LITERALS,
		quantity: 'j',
		error: false,
		fieldErrors: EMPTY_FIELD_ERRORS,
		quantityError: false,
		basePence: 0,
		totalPence: 0,
	};
}

function clearLineItem(line: LineState): LineState {
	return {
		...line,
		title: '',
		literals: EMPTY_LITERALS,
		error: false,
		fieldErrors: EMPTY_FIELD_ERRORS,
		totalPence: 0,
	};
}

export function clearItem(line: AnyLineState): AnyLineState {
	if (line.itemType === ItemType.SUBTOTAL_ITEM) return clearSubtotalItem(line);
	if (line.itemType === ItemType.EXTENDED_ITEM) return clearExtendedItem(line);
	return clearLineItem(line);
}

export function duplicateLine(line: AnyLineState): AnyLineState {
	if (line.itemType === ItemType.SUBTOTAL_ITEM) {
		return {
			...line,
			id: generateId(),
			lines: line.lines.map(duplicateLine),
		};
	}
	return { ...line, id: generateId() };
}

export function recomputeSubtotal(item: SubtotalItemState): SubtotalItemState {
	const error = item.lines.some(l => l.error);
	const { totalPence, totalDisplay } = computeGrandTotal(item.lines);
	return { ...item, error, totalPence, totalDisplay };
}

export type IdPath = string[];

/**
 * Return the lines array at the given path depth.
 */
export function getLinesAtPath(
	rootLines: AnyLineState[],
	path: IdPath
): AnyLineState[] {
	let current = rootLines;
	for (const id of path) {
		const item = current.find(l => l.id === id);
		if (!item || !isSubtotalItem(item)) return current;
		current = item.lines;
	}
	return current;
}

/**
 * Immutably apply updater at path depth, recomputing each SubtotalItemState
 * on the way back up.
 */
export function updateLinesAtPath(
	rootLines: AnyLineState[],
	path: IdPath,
	updater: (lines: AnyLineState[]) => AnyLineState[]
): AnyLineState[] {
	if (path.length === 0) return updater(rootLines);
	const [head, ...rest] = path;
	return rootLines.map(line => {
		if (line.id !== head || !isSubtotalItem(line)) return line;
		const newLines = updateLinesAtPath(line.lines, rest, updater);
		return recomputeSubtotal({ ...line, lines: newLines });
	});
}

export type Breadcrumb = { id: string; title: string; path: IdPath };

const ROOT_BREADCRUMB: Breadcrumb = {
	id: '',
	title: 'Summa totalis',
	path: [],
};

function makeCrumb(
	id: string,
	item: SubtotalItemState,
	pathSoFar: IdPath
): Breadcrumb {
	return { id, title: item.title || 'Untitled', path: pathSoFar };
}

/**
 * Breadcrumb data for each path level.
 * crumbs[0] = root crumb (Summa totalis, path=[])
 */
export function getBreadcrumbs(
	rootLines: AnyLineState[],
	path: IdPath
): Breadcrumb[] {
	const crumbs: Breadcrumb[] = [ROOT_BREADCRUMB];
	let currentLines = rootLines;
	for (let i = 0; i < path.length; i++) {
		const id = path[i];
		const item = currentLines.find(l => l.id === id);
		if (!item || !isSubtotalItem(item)) break;
		crumbs.push(makeCrumb(id, item, path.slice(0, i + 1)));
		currentLines = item.lines;
	}
	return crumbs;
}

/** Immutably update the title of the matching line (works for all 3 item types) */
export function updateTitle(
	lines: AnyLineState[],
	lineId: string,
	value: string
): AnyLineState[] {
	return lines.map(line =>
		line.id === lineId ? { ...line, title: value } : line
	);
}

/**
 * Format a non-negative integer for the total display.
 * Returns '0' for zero, otherwise applies early modern formatting.
 */
export function formatComponent(value: number): string {
	if (value === 0) return '0';
	return formatEarlyModernOutput(integerToRoman(value));
}

export function formatLsdDisplay(pence: number): LsdStrings {
	const { l, s, d } = penceToLsd(pence);
	return {
		l: formatComponent(l),
		s: formatComponent(s),
		d: formatComponent(d),
	};
}

/**
 * Compute grand total from all non-error lines, return updated totalPence, totalDisplay, and hasError.
 */
export function computeGrandTotal(lines: AnyLineState[]): {
	totalPence: number;
	totalDisplay: LsdStrings;
	hasError: boolean;
} {
	const hasError = lines.some(l => l.error);
	const totalPence = lines.reduce(
		(sum, l) => (l.error ? sum : sum + l.totalPence),
		0
	);
	return { totalPence, totalDisplay: formatLsdDisplay(totalPence), hasError };
}

type FieldResult = { pence: number; error: boolean };

function evaluateField(value: string, field: 'l' | 's' | 'd'): FieldResult {
	if (!value) return { pence: 0, error: false };
	const norm = normalizeEarlyModernInput(value);
	if (!isValidRoman(norm)) return { pence: 0, error: true };
	return {
		pence: romanToInteger(norm) * LSD_MULTIPLIERS[field],
		error: false,
	};
}

function resultsToFieldErrors(results: FieldResult[]): LsdBooleans {
	return { l: results[0].error, s: results[1].error, d: results[2].error };
}

export function computeLinePence(literals: LsdStrings): {
	totalPence: number;
	error: boolean;
	fieldErrors: LsdBooleans;
} {
	const fields = ['l', 's', 'd'] as const;
	const results = fields.map(f => evaluateField(literals[f], f));
	const fieldErrors = resultsToFieldErrors(results);
	const error = results.some(r => r.error);
	const totalPence = error ? 0 : results.reduce((sum, r) => sum + r.pence, 0);
	return { totalPence, error, fieldErrors };
}

/** Parse an early-modern quantity string. Returns { quantityError, quantityInt }. */
function parseQuantity(quantity: string): {
	quantityError: boolean;
	quantityInt: number;
} {
	const qNorm = normalizeEarlyModernInput(quantity);
	const quantityError = !quantity || !isValidRoman(qNorm);
	return {
		quantityError,
		quantityInt: quantityError ? 0 : romanToInteger(qNorm),
	};
}

export function computeExtendedItemPence(
	literals: LsdStrings,
	quantity: string
): {
	basePence: number;
	totalPence: number;
	error: boolean;
	fieldErrors: LsdBooleans;
	quantityError: boolean;
} {
	const {
		totalPence: basePence,
		error: lsdError,
		fieldErrors,
	} = computeLinePence(literals);
	const { quantityError, quantityInt } = parseQuantity(quantity);
	const error = lsdError || quantityError;
	return {
		basePence: lsdError ? 0 : basePence,
		totalPence: error ? 0 : basePence * quantityInt,
		error,
		fieldErrors,
		quantityError,
	};
}

function updateLine(
	line: LineState,
	field: 'l' | 's' | 'd',
	value: string
): LineState {
	const literals = { ...line.literals, [field]: value };
	const { totalPence, error, fieldErrors } = computeLinePence(literals);
	return { ...line, literals, totalPence, error, fieldErrors };
}

export function updateExtendedItemField(
	line: ExtendedItemState,
	field: 'l' | 's' | 'd',
	value: string
): ExtendedItemState {
	const literals = { ...line.literals, [field]: value };
	const { basePence, totalPence, error, fieldErrors, quantityError } =
		computeExtendedItemPence(literals, line.quantity);
	return {
		...line,
		literals,
		basePence,
		totalPence,
		error,
		fieldErrors,
		quantityError,
	};
}

export function updateExtendedItemQuantity(
	line: ExtendedItemState,
	value: string
): ExtendedItemState {
	const { basePence, totalPence, error, fieldErrors, quantityError } =
		computeExtendedItemPence(line.literals, value);
	return {
		...line,
		quantity: value,
		basePence,
		totalPence,
		error,
		fieldErrors,
		quantityError,
	};
}

/**
 * Apply a field update to the matching line in the array and recompute everything.
 */
export function processFieldUpdate(
	lines: AnyLineState[],
	lineId: string,
	field: 'l' | 's' | 'd',
	value: string
): AnyLineState[] {
	return lines.map(line => {
		if (line.id !== lineId) return line;
		if (isSubtotalItem(line)) return line;
		return isExtendedItem(line)
			? updateExtendedItemField(line, field, value)
			: updateLine(line, field, value);
	});
}

export function processQuantityUpdate(
	lines: AnyLineState[],
	lineId: string,
	value: string
): AnyLineState[] {
	return lines.map(line =>
		line.id === lineId && isExtendedItem(line)
			? updateExtendedItemQuantity(line, value)
			: line
	);
}

/**
 * For "show working" mode: returns the text prefix and pence value separately
 * so the caller can render the 'd' as a superscript.
 * e.g. { prefix: "4 × 12 = ", pence: 48 }. Returns null for empty or invalid input.
 */
export function computeFieldWorking(
	value: string,
	field: 'l' | 's' | 'd'
): { prefix: string; pence: number } | null {
	if (!value) return null;
	const norm = normalizeEarlyModernInput(value);
	if (!isValidRoman(norm)) return null;
	const integer = romanToInteger(norm);
	const multiplier = LSD_MULTIPLIERS[field];
	const pence = integer * multiplier;
	const prefix = multiplier === 1 ? '' : `${integer} × ${multiplier} = `;
	return { prefix, pence };
}

export function initialState(): CalculationState {
	const lines = [emptyLine(), emptyLine()];
	const { totalPence, totalDisplay, hasError } = computeGrandTotal(lines);
	return { lines, totalPence, totalDisplay, hasError };
}

export function firstVisitLines(): AnyLineState[] {
	const [a, b] = [emptyLine(), emptyLine()];
	const withA = processFieldUpdate([a, b], a.id, 'd', 'j');
	return processFieldUpdate(withA, b.id, 'd', 'ij');
}
