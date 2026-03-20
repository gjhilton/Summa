import { describe, it, expect } from 'vitest';
import { fieldErrorLabels, formatFieldList } from '@/utils/errorText';

describe('fieldErrorLabels', () => {
	it('returns empty array when no errors', () => {
		expect(fieldErrorLabels({ l: false, s: false, d: false })).toEqual([]);
	});

	it('maps l → "li"', () => {
		expect(fieldErrorLabels({ l: true, s: false, d: false })).toEqual([
			'li',
		]);
	});

	it('maps s → "s"', () => {
		expect(fieldErrorLabels({ l: false, s: true, d: false })).toEqual([
			's',
		]);
	});

	it('maps d → "d"', () => {
		expect(fieldErrorLabels({ l: false, s: false, d: true })).toEqual([
			'd',
		]);
	});

	it('returns labels in l, s, d order', () => {
		expect(fieldErrorLabels({ l: true, s: true, d: true })).toEqual([
			'li',
			's',
			'd',
		]);
	});

	it('returns only errored fields', () => {
		expect(fieldErrorLabels({ l: false, s: true, d: true })).toEqual([
			's',
			'd',
		]);
	});
});

describe('formatFieldList', () => {
	it('returns empty string for empty array', () => {
		expect(formatFieldList([])).toBe('');
	});

	it('formats single item as "<label> field"', () => {
		expect(formatFieldList(['li'])).toBe('li field');
		expect(formatFieldList(['s'])).toBe('s field');
	});

	it('formats two items joined by "and"', () => {
		expect(formatFieldList(['li', 's'])).toBe('li and s fields');
	});

	it('formats three items with comma and "and"', () => {
		expect(formatFieldList(['li', 's', 'd'])).toBe('li, s and d fields');
	});

	it('formats two generic strings', () => {
		expect(formatFieldList(['quantity', 's'])).toBe(
			'quantity and s fields'
		);
	});
});
