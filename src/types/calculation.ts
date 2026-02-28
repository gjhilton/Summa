export enum ItemType {
	LINE_ITEM = 'LINE_ITEM',
	EXTENDED_ITEM = 'EXTENDED_ITEM',
	SUBTOTAL_ITEM = 'SUBTOTAL_ITEM',
}

export type LsdStrings = { l: string; s: string; d: string };

export type LsdBooleans = { l: boolean; s: boolean; d: boolean };

export interface LineState {
	id: string;
	itemType: ItemType.LINE_ITEM;
	title: string;
	error: boolean;
	fieldErrors: LsdBooleans;
	literals: LsdStrings;
	totalPence: number;
}

export interface ExtendedItemState {
	id: string;
	itemType: ItemType.EXTENDED_ITEM;
	title: string;
	error: boolean;
	fieldErrors: LsdBooleans;
	quantityError: boolean;
	literals: LsdStrings;
	quantity: string;
	basePence: number;
	totalPence: number;
}

export interface SubtotalItemState {
	id: string;
	itemType: ItemType.SUBTOTAL_ITEM;
	title: string;
	lines: AnyLineState[];
	totalPence: number;
	totalDisplay: LsdStrings;
	error: boolean;
}

export type AnyLineState = LineState | ExtendedItemState | SubtotalItemState;

export function isExtendedItem(line: AnyLineState): line is ExtendedItemState {
	return line.itemType === ItemType.EXTENDED_ITEM;
}

export function isSubtotalItem(line: AnyLineState): line is SubtotalItemState {
	return line.itemType === ItemType.SUBTOTAL_ITEM;
}

export interface CalculationState {
	lines: AnyLineState[];
	totalPence: number;
	totalDisplay: LsdStrings;
}
