import { describe, it, expect } from 'vitest';
import { isValidRoman, romanToInteger, integerToRoman } from '../utils/roman';

describe('romanToInteger', () => {
	it('converts i to 1', () => expect(romanToInteger('i')).toBe(1));
	it('converts v to 5', () => expect(romanToInteger('v')).toBe(5));
	it('converts x to 10', () => expect(romanToInteger('x')).toBe(10));
	it('converts l to 50', () => expect(romanToInteger('l')).toBe(50));
	it('converts c to 100', () => expect(romanToInteger('c')).toBe(100));
	it('converts d to 500', () => expect(romanToInteger('d')).toBe(500));
	it('converts m to 1000', () => expect(romanToInteger('m')).toBe(1000));

	it('converts subtractive iv to 4', () => expect(romanToInteger('iv')).toBe(4));
	it('converts subtractive ix to 9', () => expect(romanToInteger('ix')).toBe(9));
	it('converts subtractive xl to 40', () => expect(romanToInteger('xl')).toBe(40));
	it('converts subtractive xc to 90', () => expect(romanToInteger('xc')).toBe(90));
	it('converts subtractive cd to 400', () => expect(romanToInteger('cd')).toBe(400));
	it('converts subtractive cm to 900', () => expect(romanToInteger('cm')).toBe(900));

	it('converts additive iiii to 4', () => expect(romanToInteger('iiii')).toBe(4));
	it('converts additive viii to 8', () => expect(romanToInteger('viii')).toBe(8));
	it('converts iiij (early modern) to 4', () => expect(romanToInteger('iiij')).toBe(4));

	it('converts mcmxcix to 1999', () => expect(romanToInteger('mcmxcix')).toBe(1999));
	it('converts mmxxvi to 2026', () => expect(romanToInteger('mmxxvi')).toBe(2026));

	it('is case-insensitive (XIV)', () => expect(romanToInteger('XIV')).toBe(14));
	it('is case-insensitive (MCMXCIX)', () => expect(romanToInteger('MCMXCIX')).toBe(1999));
});

describe('integerToRoman', () => {
	it('converts 1 to i', () => expect(integerToRoman(1)).toBe('i'));
	it('converts 4 to iv', () => expect(integerToRoman(4)).toBe('iv'));
	it('converts 5 to v', () => expect(integerToRoman(5)).toBe('v'));
	it('converts 9 to ix', () => expect(integerToRoman(9)).toBe('ix'));
	it('converts 10 to x', () => expect(integerToRoman(10)).toBe('x'));
	it('converts 11 to xi', () => expect(integerToRoman(11)).toBe('xi'));
	it('converts 13 to xiii', () => expect(integerToRoman(13)).toBe('xiii'));
	it('converts 14 to xiv', () => expect(integerToRoman(14)).toBe('xiv'));
	it('converts 40 to xl', () => expect(integerToRoman(40)).toBe('xl'));
	it('converts 50 to l', () => expect(integerToRoman(50)).toBe('l'));
	it('converts 90 to xc', () => expect(integerToRoman(90)).toBe('xc'));
	it('converts 100 to c', () => expect(integerToRoman(100)).toBe('c'));
	it('converts 400 to cd', () => expect(integerToRoman(400)).toBe('cd'));
	it('converts 500 to d', () => expect(integerToRoman(500)).toBe('d'));
	it('converts 900 to cm', () => expect(integerToRoman(900)).toBe('cm'));
	it('converts 1000 to m', () => expect(integerToRoman(1000)).toBe('m'));
	it('converts 1999 to mcmxcix', () => expect(integerToRoman(1999)).toBe('mcmxcix'));
	it('converts 1994 to mcmxciv', () => expect(integerToRoman(1994)).toBe('mcmxciv'));
	it('converts 2026 to mmxxvi', () => expect(integerToRoman(2026)).toBe('mmxxvi'));

	it('throws on 0', () => expect(() => integerToRoman(0)).toThrow());
	it('throws on negative', () => expect(() => integerToRoman(-1)).toThrow());
	it('throws on non-integer', () => expect(() => integerToRoman(1.5)).toThrow());
});

describe('isValidRoman', () => {
	it('accepts single chars', () => {
		for (const c of ['i', 'v', 'x', 'l', 'c', 'd', 'm']) {
			expect(isValidRoman(c)).toBe(true);
		}
	});

	it('accepts additive iiii', () => expect(isValidRoman('iiii')).toBe(true));
	it('accepts subtractive iv', () => expect(isValidRoman('iv')).toBe(true));
	it('accepts subtractive ix', () => expect(isValidRoman('ix')).toBe(true));
	it('accepts subtractive xl', () => expect(isValidRoman('xl')).toBe(true));
	it('accepts subtractive xc', () => expect(isValidRoman('xc')).toBe(true));
	it('accepts subtractive cd', () => expect(isValidRoman('cd')).toBe(true));
	it('accepts subtractive cm', () => expect(isValidRoman('cm')).toBe(true));
	it('accepts iiij (early modern 4)', () => expect(isValidRoman('iiij')).toBe(true));
	it('accepts mcmxcix', () => expect(isValidRoman('mcmxcix')).toBe(true));

	it('rejects empty string', () => expect(isValidRoman('')).toBe(false));
	it('rejects vv', () => expect(isValidRoman('vv')).toBe(false));
	it('rejects ll', () => expect(isValidRoman('ll')).toBe(false));
	it('rejects dd', () => expect(isValidRoman('dd')).toBe(false));
	it('rejects il (invalid subtractive)', () => expect(isValidRoman('il')).toBe(false));
	it('rejects ic', () => expect(isValidRoman('ic')).toBe(false));
	it('rejects vx', () => expect(isValidRoman('vx')).toBe(false));
	it('rejects lm', () => expect(isValidRoman('lm')).toBe(false));
	it('rejects non-roman chars', () => expect(isValidRoman('abc')).toBe(false));
	it('rejects spaces', () => expect(isValidRoman('i i')).toBe(false));

	it('is case-insensitive', () => expect(isValidRoman('XIV')).toBe(true));
	it('accepts uppercase mcmxcix', () => expect(isValidRoman('MCMXCIX')).toBe(true));
});
