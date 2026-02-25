import { LsdStrings, LsdBooleans, LineState, CalculationState } from '../types/calculation';
import { normalizeEarlyModernInput, formatEarlyModernOutput } from '../utils/earlyModern';
import { isValidRoman, romanToInteger, integerToRoman } from '../utils/roman';
import { penceToLsd } from '../utils/currency';

const PENCE_MULTIPLIERS = { l: 240, s: 12, d: 1 } as const;

export function emptyLine(): LineState {
	return {
		id: crypto.randomUUID(),
		error: false,
		fieldErrors: { l: false, s: false, d: false },
		literals: { l: '', s: '', d: '' },
		totalPence: 0,
	};
}

/**
 * Format a non-negative integer for the total display.
 * Returns '0' for zero, otherwise applies early modern formatting.
 */
function formatComponent(value: number): string {
	if (value === 0) return '0';
	return formatEarlyModernOutput(integerToRoman(value));
}

/**
 * Compute grand total from all non-error lines, return updated totalPence and totalDisplay.
 */
export function computeGrandTotal(lines: LineState[]): {
	totalPence: number;
	totalDisplay: LsdStrings;
} {
	const totalPence = lines
		.filter(line => !line.error)
		.reduce((sum, line) => sum + line.totalPence, 0);
	const { l, s, d } = penceToLsd(totalPence);
	return {
		totalPence,
		totalDisplay: {
			l: formatComponent(l),
			s: formatComponent(s),
			d: formatComponent(d),
		},
	};
}

function computeLinePence(literals: LsdStrings): { totalPence: number; error: boolean; fieldErrors: LsdBooleans } {
	let totalPence = 0;
	const fieldErrors: LsdBooleans = { l: false, s: false, d: false };
	for (const field of ['l', 's', 'd'] as const) {
		const value = literals[field];
		if (!value) continue;
		const norm = normalizeEarlyModernInput(value);
		if (!isValidRoman(norm)) {
			fieldErrors[field] = true;
		} else {
			totalPence += romanToInteger(norm) * PENCE_MULTIPLIERS[field];
		}
	}
	const error = fieldErrors.l || fieldErrors.s || fieldErrors.d;
	return { totalPence: error ? 0 : totalPence, error, fieldErrors };
}

function updateLine(line: LineState, field: 'l' | 's' | 'd', value: string): LineState {
	const literals = { ...line.literals, [field]: value };
	const { totalPence, error, fieldErrors } = computeLinePence(literals);
	return { ...line, literals, totalPence, error, fieldErrors };
}

/**
 * Apply a field update to the matching line in the array and recompute everything.
 */
export function processFieldUpdate(
	lines: LineState[],
	lineId: string,
	field: 'l' | 's' | 'd',
	value: string,
): LineState[] {
	return lines.map(line =>
		line.id === lineId ? updateLine(line, field, value) : line,
	);
}

export function withNewLines(prev: CalculationState, lines: LineState[]): CalculationState {
	const { totalPence, totalDisplay } = computeGrandTotal(lines);
	return { ...prev, lines, totalPence, totalDisplay };
}

/**
 * For "show working" mode: returns the text prefix and pence value separately
 * so the caller can render the 'd' as a superscript.
 * e.g. { prefix: "4 × 12 = ", pence: 48 }. Returns null for empty or invalid input.
 */
export function computeFieldWorking(
	value: string,
	field: 'l' | 's' | 'd',
): { prefix: string; pence: number } | null {
	if (!value) return null;
	const norm = normalizeEarlyModernInput(value);
	if (!isValidRoman(norm)) return null;
	const integer = romanToInteger(norm);
	const multiplier = PENCE_MULTIPLIERS[field];
	const pence = integer * multiplier;
	const prefix = multiplier === 1 ? '' : `${integer} × ${multiplier} = `;
	return { prefix, pence };
}

export function initialState(): CalculationState {
	const lines = [emptyLine(), emptyLine()];
	const { totalPence, totalDisplay } = computeGrandTotal(lines);
	return { lines, totalPence, totalDisplay };
}
