import {
	LineState,
	TotalDisplay,
	CalculationState,
} from '../types/calculation';
import { normalizeEarlyModernInput, formatEarlyModernOutput } from '../utils/earlyModern';
import { isValidRoman, romanToInteger, integerToRoman } from '../utils/roman';
import { lsdToPence, penceToLsd } from '../utils/currency';

export function emptyLine(): LineState {
	return {
		id: crypto.randomUUID(),
		error: false,
		literals: { l: '', s: '', d: '' },
		normalized: { l: '', s: '', d: '' },
		integers: { l: 0, s: 0, d: 0 },
		pence: { l: 0, s: 0, d: 0 },
		totalPence: 0,
		operation: '+',
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
	totalDisplay: TotalDisplay;
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

/**
 * Process a field update on a single line and return the updated line.
 */
function updateLine(
	line: LineState,
	field: 'l' | 's' | 'd',
	value: string,
): LineState {
	const updated: LineState = {
		...line,
		literals: { ...line.literals, [field]: value },
		normalized: { ...line.normalized },
		integers: { ...line.integers },
		pence: { ...line.pence },
		error: false,
	};

	if (value === '') {
		// Empty → treat as 0, no error
		updated.normalized[field] = '';
		updated.integers[field] = 0;
		updated.pence[field] = 0;
	} else {
		const norm = normalizeEarlyModernInput(value);
		updated.normalized[field] = norm;

		if (!isValidRoman(norm)) {
			updated.error = true;
			// Preserve previous numeric values for the other fields
			return updated;
		}

		const intVal = romanToInteger(norm);
		updated.integers[field] = intVal;

		// Pence equivalents: l*240, s*12, d*1
		const multiplier = field === 'l' ? 240 : field === 's' ? 12 : 1;
		updated.pence[field] = intVal * multiplier;
	}

	// Recompute line total from all three pence fields
	updated.totalPence = lsdToPence(0, 0, 0)
		+ updated.pence.l
		+ updated.pence.s
		+ updated.pence.d;

	return updated;
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

export function initialState(): CalculationState {
	const lines = [emptyLine(), emptyLine()];
	const { totalPence, totalDisplay } = computeGrandTotal(lines);
	return {
		lines,
		totalPence,
		totalDisplay,
		showRoman: true,
	};
}
