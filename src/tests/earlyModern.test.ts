import { describe, it, expect } from 'vitest';
import { normalizeEarlyModernInput, formatEarlyModernOutput } from '../utils/earlyModern';
import { integerToRoman } from '../utils/roman';

describe('normalizeEarlyModernInput', () => {
	it('converts to lowercase', () => {
		expect(normalizeEarlyModernInput('XIV')).toBe('xiv');
	});

	it('converts u to v', () => {
		expect(normalizeEarlyModernInput('uiii')).toBe('viii');
	});

	it('converts j to i', () => {
		expect(normalizeEarlyModernInput('iiij')).toBe('iiii');
	});

	it('handles mixed j and uppercase', () => {
		expect(normalizeEarlyModernInput('Xiij')).toBe('xiii');
	});

	it('handles u and j together', () => {
		expect(normalizeEarlyModernInput('ujii')).toBe('viii');
	});

	it('leaves standard roman unchanged', () => {
		expect(normalizeEarlyModernInput('mcmxcix')).toBe('mcmxcix');
	});

	it('handles empty string', () => {
		expect(normalizeEarlyModernInput('')).toBe('');
	});
});

describe('formatEarlyModernOutput', () => {
	it('formats i → j', () => {
		expect(formatEarlyModernOutput('i')).toBe('j');
	});

	it('formats ii → ij', () => {
		expect(formatEarlyModernOutput('ii')).toBe('ij');
	});

	it('formats iii → iij', () => {
		expect(formatEarlyModernOutput('iii')).toBe('iij');
	});

	it('formats iv → iiij (expand then j-rule)', () => {
		expect(formatEarlyModernOutput('iv')).toBe('iiij');
	});

	it('formats ix → jx', () => {
		expect(formatEarlyModernOutput('ix')).toBe('jx');
	});

	it('formats xi → xj', () => {
		expect(formatEarlyModernOutput('xi')).toBe('xj');
	});

	it('formats xiii → xiij', () => {
		expect(formatEarlyModernOutput('xiii')).toBe('xiij');
	});

	it('formats xiv → xiiij', () => {
		expect(formatEarlyModernOutput('xiv')).toBe('xiiij');
	});

	it('applies uppercase to l', () => {
		expect(formatEarlyModernOutput('l')).toBe('L');
	});

	it('applies uppercase to c', () => {
		expect(formatEarlyModernOutput('c')).toBe('C');
	});

	it('applies uppercase to d', () => {
		expect(formatEarlyModernOutput('d')).toBe('D');
	});

	it('applies uppercase to m', () => {
		expect(formatEarlyModernOutput('m')).toBe('M');
	});

	it('keeps x lowercase', () => {
		expect(formatEarlyModernOutput('x')).toBe('x');
	});

	it('keeps v lowercase', () => {
		expect(formatEarlyModernOutput('v')).toBe('v');
	});
});

describe('round-trip: integerToRoman + formatEarlyModernOutput', () => {
	it('1 → j', () => {
		expect(formatEarlyModernOutput(integerToRoman(1))).toBe('j');
	});

	it('4 → iiij', () => {
		expect(formatEarlyModernOutput(integerToRoman(4))).toBe('iiij');
	});

	it('9 → jx', () => {
		expect(formatEarlyModernOutput(integerToRoman(9))).toBe('jx');
	});

	it('11 → xj', () => {
		expect(formatEarlyModernOutput(integerToRoman(11))).toBe('xj');
	});

	it('13 → xiij', () => {
		expect(formatEarlyModernOutput(integerToRoman(13))).toBe('xiij');
	});

	it('14 → xiiij', () => {
		expect(formatEarlyModernOutput(integerToRoman(14))).toBe('xiiij');
	});

	it('1000 → M', () => {
		expect(formatEarlyModernOutput(integerToRoman(1000))).toBe('M');
	});

	it('1994 → MCMxCiiij', () => {
		expect(formatEarlyModernOutput(integerToRoman(1994))).toBe('MCMxCiiij');
	});

	it('40 → xL', () => {
		expect(formatEarlyModernOutput(integerToRoman(40))).toBe('xL');
	});

	it('50 → L', () => {
		expect(formatEarlyModernOutput(integerToRoman(50))).toBe('L');
	});

	it('90 → xC', () => {
		expect(formatEarlyModernOutput(integerToRoman(90))).toBe('xC');
	});

	it('400 → CD', () => {
		expect(formatEarlyModernOutput(integerToRoman(400))).toBe('CD');
	});

	it('900 → CM', () => {
		expect(formatEarlyModernOutput(integerToRoman(900))).toBe('CM');
	});
});
