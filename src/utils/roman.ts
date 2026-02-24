const CHAR_VALUES: Record<string, number> = {
	i: 1,
	j: 1, // early modern variant of i
	v: 5,
	x: 10,
	l: 50,
	c: 100,
	d: 500,
	m: 1000,
};

const VALID_SUBTRACTIVE = new Set(['iv', 'ix', 'xl', 'xc', 'cd', 'cm']);

const ROMAN_TABLE: [number, string][] = [
	[1000, 'm'],
	[900, 'cm'],
	[500, 'd'],
	[400, 'cd'],
	[100, 'c'],
	[90, 'xc'],
	[50, 'l'],
	[40, 'xl'],
	[10, 'x'],
	[9, 'ix'],
	[5, 'v'],
	[4, 'iv'],
	[1, 'i'],
];

/**
 * Validate a Roman numeral string (case-insensitive).
 * Accepts additive forms (iiii) and valid subtractive forms (iv, ix, xl, xc, cd, cm).
 * Rejects vv, ll, dd, and illegal subtractive pairs (il, ic, etc.).
 */
export function isValidRoman(input: string): boolean {
	if (!input) return false;
	const s = input.toLowerCase();
	if (!/^[ivxlcdmj]+$/.test(s)) return false;
	if (/vv/.test(s) || /ll/.test(s) || /dd/.test(s)) return false;

	for (let i = 0; i < s.length - 1; i++) {
		const curr = CHAR_VALUES[s[i]];
		const next = CHAR_VALUES[s[i + 1]];
		if (curr < next) {
			if (!VALID_SUBTRACTIVE.has(s[i] + s[i + 1])) {
				return false;
			}
		}
	}
	return true;
}

/**
 * Convert a Roman numeral string to an integer.
 * Uses left-to-right scan: subtract current if next is larger, else add.
 * Case-insensitive. Does not validate — call isValidRoman first.
 */
export function romanToInteger(input: string): number {
	const s = input.toLowerCase();
	let total = 0;
	for (let i = 0; i < s.length; i++) {
		const curr = CHAR_VALUES[s[i]];
		const next = i + 1 < s.length ? CHAR_VALUES[s[i + 1]] : 0;
		if (curr < next) {
			total -= curr;
		} else {
			total += curr;
		}
	}
	return total;
}

/**
 * Convert a positive integer to canonical (subtractive) lowercase Roman numeral string.
 * E.g. 4 → 'iv', 9 → 'ix', 1999 → 'mcmxcix'.
 */
export function integerToRoman(value: number): string {
	if (!Number.isInteger(value) || value <= 0) {
		throw new Error(`integerToRoman: value must be a positive integer, got ${value}`);
	}
	let result = '';
	let remaining = value;
	for (const [num, str] of ROMAN_TABLE) {
		while (remaining >= num) {
			result += str;
			remaining -= num;
		}
	}
	return result;
}
