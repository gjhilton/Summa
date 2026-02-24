import { describe, it, expect } from 'vitest';
import { lsdToPence, penceToLsd } from '../utils/currency';

describe('lsdToPence', () => {
	it('returns 0 for all zeros', () => {
		expect(lsdToPence(0, 0, 0)).toBe(0);
	});

	it('converts 1 pound to 240 pence', () => {
		expect(lsdToPence(1, 0, 0)).toBe(240);
	});

	it('converts 1 shilling to 12 pence', () => {
		expect(lsdToPence(0, 1, 0)).toBe(12);
	});

	it('converts 1 penny', () => {
		expect(lsdToPence(0, 0, 1)).toBe(1);
	});

	it('handles combined values', () => {
		expect(lsdToPence(1, 1, 1)).toBe(253);
	});

	it('handles large values', () => {
		expect(lsdToPence(100, 19, 11)).toBe(24239);
	});

	it('throws on negative l', () => {
		expect(() => lsdToPence(-1, 0, 0)).toThrow();
	});

	it('throws on negative s', () => {
		expect(() => lsdToPence(0, -1, 0)).toThrow();
	});

	it('throws on negative d', () => {
		expect(() => lsdToPence(0, 0, -1)).toThrow();
	});

	it('throws on non-integer l', () => {
		expect(() => lsdToPence(1.5, 0, 0)).toThrow();
	});

	it('throws on non-integer s', () => {
		expect(() => lsdToPence(0, 1.5, 0)).toThrow();
	});

	it('throws on non-integer d', () => {
		expect(() => lsdToPence(0, 0, 1.5)).toThrow();
	});
});

describe('penceToLsd', () => {
	it('returns all zeros for 0', () => {
		expect(penceToLsd(0)).toEqual({ l: 0, s: 0, d: 0 });
	});

	it('converts 240 pence to 1 pound', () => {
		expect(penceToLsd(240)).toEqual({ l: 1, s: 0, d: 0 });
	});

	it('converts 12 pence to 1 shilling', () => {
		expect(penceToLsd(12)).toEqual({ l: 0, s: 1, d: 0 });
	});

	it('converts 1 pence', () => {
		expect(penceToLsd(1)).toEqual({ l: 0, s: 0, d: 1 });
	});

	it('12d carries to 1s', () => {
		const total = lsdToPence(0, 0, 12);
		expect(penceToLsd(total)).toEqual({ l: 0, s: 1, d: 0 });
	});

	it('20s carries to 1l', () => {
		const total = lsdToPence(0, 20, 0);
		expect(penceToLsd(total)).toEqual({ l: 1, s: 0, d: 0 });
	});

	it('round-trips large values', () => {
		const pence = lsdToPence(100, 19, 11);
		expect(penceToLsd(pence)).toEqual({ l: 100, s: 19, d: 11 });
	});

	it('throws on negative input', () => {
		expect(() => penceToLsd(-1)).toThrow();
	});

	it('throws on non-integer input', () => {
		expect(() => penceToLsd(1.5)).toThrow();
	});
});
