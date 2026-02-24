import { LsdStrings, LineState, CalculationState } from '../types/calculation';
import { normalizeEarlyModernInput, formatEarlyModernOutput } from '../utils/earlyModern';
import { isValidRoman, romanToInteger, integerToRoman } from '../utils/roman';
import { penceToLsd } from '../utils/currency';

const PENCE_MULTIPLIERS = { l: 240, s: 12, d: 1 } as const;

export function emptyLine(): LineState {
	return {
		id: crypto.randomUUID(),
		error: false,
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

function computeLinePence(literals: LsdStrings): { totalPence: number; error: boolean } {
	let totalPence = 0;
	for (const f of ['l', 's', 'd'] as const) {
		const v = literals[f];
		if (!v) continue;
		const norm = normalizeEarlyModernInput(v);
		if (!isValidRoman(norm)) return { totalPence: 0, error: true };
		totalPence += romanToInteger(norm) * PENCE_MULTIPLIERS[f];
	}
	return { totalPence, error: false };
}

function updateLine(line: LineState, field: 'l' | 's' | 'd', value: string): LineState {
	const literals = { ...line.literals, [field]: value };
	const { totalPence, error } = computeLinePence(literals);
	return { ...line, literals, totalPence, error };
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

export function initialState(): CalculationState {
	const lines = [emptyLine(), emptyLine()];
	const { totalPence, totalDisplay } = computeGrandTotal(lines);
	return { lines, totalPence, totalDisplay };
}
