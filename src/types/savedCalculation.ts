import { ItemType, LsdStrings } from './calculation';

export interface SavedLine {
	id: string;
	itemType: ItemType.LINE_ITEM;
	title: string;
	literals: LsdStrings;
}

export interface SavedExtendedItem {
	id: string;
	itemType: ItemType.EXTENDED_ITEM;
	title: string;
	literals: LsdStrings;
	quantity: string;
}

export interface SavedSubtotalItem {
	id: string;
	itemType: ItemType.SUBTOTAL_ITEM;
	title: string;
	lines: SavedAnyLine[];
}

export type SavedAnyLine = SavedLine | SavedExtendedItem | SavedSubtotalItem;

export interface SummaFile {
	metadata: {
		appName: 'summa';
		version: string;
		savedAt: string;
	};
	lines: SavedAnyLine[];
}
