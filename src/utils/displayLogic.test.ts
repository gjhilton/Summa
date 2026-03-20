import { describe, it, expect } from 'vitest';
import { toLineView } from '@/utils/displayLogic';
import { ItemType } from '@/types/calculation';
import type { AnyLineState } from '@/types/calculation';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const emptyFieldErrors = { l: false, s: false, d: false };
const emptyLiterals = { l: '', s: '', d: '' };

const lineItem: AnyLineState = {
	id: 'line-1',
	itemType: ItemType.LINE_ITEM,
	title: 'Candles',
	error: false,
	fieldErrors: emptyFieldErrors,
	literals: { l: '0', s: 'iij', d: 'vj' },
	totalPence: 42,
};

const lineItemWithError: AnyLineState = {
	id: 'line-err',
	itemType: ItemType.LINE_ITEM,
	title: 'Bad entry',
	error: true,
	fieldErrors: { l: false, s: true, d: false },
	literals: { l: '', s: 'XYZ', d: '' },
	totalPence: 0,
};

const extendedItem: AnyLineState = {
	id: 'ext-1',
	itemType: ItemType.EXTENDED_ITEM,
	title: 'Beeswax',
	error: false,
	fieldErrors: emptyFieldErrors,
	quantityError: false,
	literals: { l: '0', s: 'ij', d: '0' },
	quantity: 'xij',
	basePence: 24,
	totalPence: 288,
};

const extendedItemQuantityError: AnyLineState = {
	id: 'ext-qerr',
	itemType: ItemType.EXTENDED_ITEM,
	title: 'Bad qty',
	error: true,
	fieldErrors: emptyFieldErrors,
	quantityError: true,
	literals: emptyLiterals,
	quantity: '',
	basePence: 0,
	totalPence: 0,
};

const extendedItemZeroSubtotal: AnyLineState = {
	id: 'ext-zero',
	itemType: ItemType.EXTENDED_ITEM,
	title: 'Zero cost',
	error: false,
	fieldErrors: emptyFieldErrors,
	quantityError: false,
	literals: emptyLiterals,
	quantity: 'j',
	basePence: 0,
	totalPence: 0,
};

const subtotalItem: AnyLineState = {
	id: 'sub-1',
	itemType: ItemType.SUBTOTAL_ITEM,
	title: 'Sundries',
	lines: [lineItem],
	totalPence: 42,
	totalDisplay: { l: '0', s: 'iij', d: 'vj' },
	error: false,
};

const subtotalItemWithError: AnyLineState = {
	id: 'sub-err',
	itemType: ItemType.SUBTOTAL_ITEM,
	title: 'Errors',
	lines: [lineItemWithError],
	totalPence: 0,
	totalDisplay: { l: '0', s: '0', d: '0' },
	error: true,
};

// ─── toLineView — LINE_ITEM ───────────────────────────────────────────────────

describe('toLineView — LINE_ITEM', () => {
	it('returns a LineItemView with correct itemType', () => {
		const view = toLineView(lineItem);
		expect(view.itemType).toBe(ItemType.LINE_ITEM);
	});

	it('passes through id, title, error', () => {
		const view = toLineView(lineItem);
		expect(view.id).toBe('line-1');
		expect(view.title).toBe('Candles');
		expect(view.error).toBe(false);
	});

	it('passes through fieldErrors and literals', () => {
		const view = toLineView(lineItem);
		if (view.itemType !== ItemType.LINE_ITEM) throw new Error('wrong type');
		expect(view.fieldErrors).toEqual(emptyFieldErrors);
		expect(view.literals).toEqual({ l: '0', s: 'iij', d: 'vj' });
	});

	it('passes through totalPence', () => {
		const view = toLineView(lineItem);
		if (view.itemType !== ItemType.LINE_ITEM) throw new Error('wrong type');
		expect(view.totalPence).toBe(42);
	});

	it('correctly passes error state and fieldErrors for invalid entry', () => {
		const view = toLineView(lineItemWithError);
		if (view.itemType !== ItemType.LINE_ITEM) throw new Error('wrong type');
		expect(view.error).toBe(true);
		expect(view.fieldErrors).toEqual({ l: false, s: true, d: false });
	});
});

// ─── toLineView — EXTENDED_ITEM ───────────────────────────────────────────────

describe('toLineView — EXTENDED_ITEM', () => {
	it('returns an ExtendedItemView with correct itemType', () => {
		const view = toLineView(extendedItem);
		expect(view.itemType).toBe(ItemType.EXTENDED_ITEM);
	});

	it('passes through id, title, quantity, basePence, totalPence', () => {
		const view = toLineView(extendedItem);
		if (view.itemType !== ItemType.EXTENDED_ITEM) throw new Error('wrong type');
		expect(view.id).toBe('ext-1');
		expect(view.title).toBe('Beeswax');
		expect(view.quantity).toBe('xij');
		expect(view.basePence).toBe(24);
		expect(view.totalPence).toBe(288);
	});

	it('computes quantityInt from quantity string when no quantityError', () => {
		const view = toLineView(extendedItem);
		if (view.itemType !== ItemType.EXTENDED_ITEM) throw new Error('wrong type');
		// xij = 12
		expect(view.quantityInt).toBe(12);
	});

	it('sets quantityInt to null when quantityError is true', () => {
		const view = toLineView(extendedItemQuantityError);
		if (view.itemType !== ItemType.EXTENDED_ITEM) throw new Error('wrong type');
		expect(view.quantityInt).toBeNull();
	});

	it('blanks zero values in subtotalDisplay', () => {
		const view = toLineView(extendedItemZeroSubtotal);
		if (view.itemType !== ItemType.EXTENDED_ITEM) throw new Error('wrong type');
		// totalPence = 0 → formatLsdDisplay → { l: '0', s: '0', d: '0' } → all blanked
		expect(view.subtotalDisplay).toEqual({ l: '', s: '', d: '' });
	});

	it('preserves non-zero values in subtotalDisplay', () => {
		const view = toLineView(extendedItem);
		if (view.itemType !== ItemType.EXTENDED_ITEM) throw new Error('wrong type');
		// 288 pence = 1 pound 4 shillings 0 pence → l: 'j', s: 'iiij', d: '0'
		expect(view.subtotalDisplay.d).toBe(''); // zero pence → blanked
		expect(view.subtotalDisplay.l).not.toBe(''); // non-zero → kept
	});

	it('passes through quantityError flag', () => {
		const view = toLineView(extendedItemQuantityError);
		if (view.itemType !== ItemType.EXTENDED_ITEM) throw new Error('wrong type');
		expect(view.quantityError).toBe(true);
	});
});

// ─── toLineView — SUBTOTAL_ITEM ───────────────────────────────────────────────

describe('toLineView — SUBTOTAL_ITEM', () => {
	it('returns a SubtotalItemView with correct itemType', () => {
		const view = toLineView(subtotalItem);
		expect(view.itemType).toBe(ItemType.SUBTOTAL_ITEM);
	});

	it('passes through id, title, totalPence, totalDisplay, error', () => {
		const view = toLineView(subtotalItem);
		if (view.itemType !== ItemType.SUBTOTAL_ITEM) throw new Error('wrong type');
		expect(view.id).toBe('sub-1');
		expect(view.title).toBe('Sundries');
		expect(view.totalPence).toBe(42);
		expect(view.totalDisplay).toEqual({ l: '0', s: 'iij', d: 'vj' });
		expect(view.error).toBe(false);
	});

	it('propagates error flag from subtotal', () => {
		const view = toLineView(subtotalItemWithError);
		if (view.itemType !== ItemType.SUBTOTAL_ITEM) throw new Error('wrong type');
		expect(view.error).toBe(true);
	});

	it('does not expose internal lines array', () => {
		const view = toLineView(subtotalItem);
		expect('lines' in view).toBe(false);
	});
});
