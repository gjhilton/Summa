import { describe, it, expect } from 'vitest';
import {
	normalizeEarlyModernInput,
	formatEarlyModernOutput,
} from '@/utils/earlyModern';
import { integerToRoman } from '@/utils/roman';

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

	it('formats ix → viiij (expand to viiii then j-rule)', () => {
		expect(formatEarlyModernOutput('ix')).toBe('viiij');
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

describe('formatEarlyModernOutput: conditional uppercase of l/c/d/m', () => {
	// l/c/d/m at the start → uppercase (no lowercase precedes them)
	it('c alone → C', () => {
		expect(formatEarlyModernOutput('c')).toBe('C');
	});
	it('cc → CC (both uppercase, no lowercase before either)', () => {
		expect(formatEarlyModernOutput('cc')).toBe('CC');
	});
	it('ccvij → CCvij (CC uppercase, v triggers lowercase flag, vij stay lowercase)', () => {
		expect(formatEarlyModernOutput('ccvij')).toBe('CCvij');
	});

	// x (a small numeral) before l/c/d/m → those stay lowercase
	it('xc → xc (x sets lowercase flag, c stays lowercase)', () => {
		expect(formatEarlyModernOutput('xc')).toBe('xc');
	});
	it('xl → xl (x sets lowercase flag, l stays lowercase)', () => {
		expect(formatEarlyModernOutput('xl')).toBe('xl');
	});
	it('xcvij → xcvij', () => {
		expect(formatEarlyModernOutput('xcvij')).toBe('xcvij');
	});

	// uppercase l/c/d/m do NOT set the lowercase flag
	it('mc → MC (m uppercase, flag not set, c also uppercase)', () => {
		expect(formatEarlyModernOutput('mc')).toBe('MC');
	});
	it('mccxvij → MCCxvij (MC uppercase, C uppercase, then x sets flag, vij lowercase)', () => {
		expect(formatEarlyModernOutput('mccxvij')).toBe('MCCxvij');
	});

	// l at start → uppercase; xl → lowercase l
	it('lxvij → Lxvij (l uppercase at start, x then sets flag)', () => {
		expect(formatEarlyModernOutput('lxvij')).toBe('Lxvij');
	});
	it('xlvij → xlvij (x sets flag before l)', () => {
		expect(formatEarlyModernOutput('xlvij')).toBe('xlvij');
	});

	// cd and cm stay uppercase (no small numeral precedes them)
	it('cd → CD', () => {
		expect(formatEarlyModernOutput('cd')).toBe('CD');
	});
	it('cm → CM', () => {
		expect(formatEarlyModernOutput('cm')).toBe('CM');
	});

	// mcm: all uppercase, x resets to lowercase for subsequent c
	it('mcmxciiij → MCMxciiij', () => {
		expect(formatEarlyModernOutput('mcmxciiij')).toBe('MCMxciiij');
	});
});

describe('round-trip: integerToRoman + formatEarlyModernOutput', () => {
	it('1 → j', () => {
		expect(formatEarlyModernOutput(integerToRoman(1))).toBe('j');
	});

	it('4 → iiij', () => {
		expect(formatEarlyModernOutput(integerToRoman(4))).toBe('iiij');
	});

	it('9 → viiij (ix expands to viiii)', () => {
		expect(formatEarlyModernOutput(integerToRoman(9))).toBe('viiij');
	});

	it('11 → xj', () => {
		expect(formatEarlyModernOutput(integerToRoman(11))).toBe('xj');
	});

	it('19 → xviiij (xix: ix expands to viiii)', () => {
		expect(formatEarlyModernOutput(integerToRoman(19))).toBe('xviiij');
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

	it('1994 → MCMxciiij', () => {
		expect(formatEarlyModernOutput(integerToRoman(1994))).toBe('MCMxciiij');
	});

	it('40 → xl (x precedes l so l stays lowercase)', () => {
		expect(formatEarlyModernOutput(integerToRoman(40))).toBe('xl');
	});

	it('50 → L', () => {
		expect(formatEarlyModernOutput(integerToRoman(50))).toBe('L');
	});

	it('90 → xc (x precedes c so c stays lowercase)', () => {
		expect(formatEarlyModernOutput(integerToRoman(90))).toBe('xc');
	});

	it('400 → CD', () => {
		expect(formatEarlyModernOutput(integerToRoman(400))).toBe('CD');
	});

	it('900 → CM', () => {
		expect(formatEarlyModernOutput(integerToRoman(900))).toBe('CM');
	});
});
