import {
	ItemType,
	AnyLineState,
	LineState,
	ExtendedItemState,
	SubtotalItemState,
	CalculationState,
	isExtendedItem,
	isSubtotalItem,
} from '@/types/calculation';
import {
	SavedAnyLine,
	SavedLine,
	SavedExtendedItem,
	SavedSubtotalItem,
	SummaFile,
} from '@/types/savedCalculation';
import {
	computeLinePence,
	computeExtendedItemPence,
	computeGrandTotal,
	recomputeSubtotal,
} from '@/utils/calculationLogic';

function serialiseSubtotalItem(line: SubtotalItemState): SavedSubtotalItem {
	return {
		id: line.id,
		itemType: ItemType.SUBTOTAL_ITEM,
		title: line.title,
		lines: serialiseLines(line.lines),
	};
}

function serialiseExtendedItem(line: ExtendedItemState): SavedExtendedItem {
	return {
		id: line.id,
		itemType: ItemType.EXTENDED_ITEM,
		title: line.title,
		literals: line.literals,
		quantity: line.quantity,
	};
}

function serialiseLineItem(line: LineState): SavedLine {
	return {
		id: line.id,
		itemType: ItemType.LINE_ITEM,
		title: line.title,
		literals: line.literals,
	};
}

export function serialiseLine(line: AnyLineState): SavedAnyLine {
	if (isSubtotalItem(line)) return serialiseSubtotalItem(line);
	if (isExtendedItem(line)) return serialiseExtendedItem(line);
	return serialiseLineItem(line);
}

export function serialiseLines(lines: AnyLineState[]): SavedAnyLine[] {
	return lines.map(serialiseLine);
}

export function createSummaFile(state: CalculationState): SummaFile {
	return {
		metadata: {
			appName: 'summa',
			version: __APP_VERSION__,
			savedAt: new Date().toISOString(),
		},
		lines: serialiseLines(state.lines),
	};
}

function deserialiseSubtotalItem(s: SavedSubtotalItem): AnyLineState {
	if (!s.id) throw new Error('Invalid subtotal item: missing id');
	if (!Array.isArray(s.lines))
		throw new Error('Invalid subtotal item: missing lines');
	return recomputeSubtotal({
		id: s.id,
		itemType: ItemType.SUBTOTAL_ITEM,
		title: s.title ?? '',
		lines: deserialiseLines(s.lines),
		totalPence: 0,
		totalDisplay: { l: '0', s: '0', d: '0' },
		error: false,
	});
}

function assertValidExtendedItem(s: SavedExtendedItem): void {
	if (!s.id) throw new Error('Invalid extended item: missing id');
	if (!s.literals) throw new Error('Invalid extended item: missing literals');
	if (typeof s.quantity !== 'string')
		throw new Error('Invalid extended item: missing quantity');
}

function deserialiseExtendedItem(s: SavedExtendedItem): AnyLineState {
	assertValidExtendedItem(s);
	const { basePence, totalPence, error, fieldErrors, quantityError } =
		computeExtendedItemPence(s.literals, s.quantity);
	return {
		id: s.id,
		itemType: ItemType.EXTENDED_ITEM,
		title: s.title ?? '',
		literals: s.literals,
		quantity: s.quantity,
		basePence,
		totalPence,
		error,
		fieldErrors,
		quantityError,
	};
}

function deserialiseLineItem(s: SavedLine): AnyLineState {
	if (!s.id) throw new Error('Invalid line item: missing id');
	if (!s.literals) throw new Error('Invalid line item: missing literals');
	const { totalPence, error, fieldErrors } = computeLinePence(s.literals);
	return {
		id: s.id,
		itemType: ItemType.LINE_ITEM,
		title: s.title ?? '',
		literals: s.literals,
		totalPence,
		error,
		fieldErrors,
	};
}

export function deserialiseLine(saved: SavedAnyLine): AnyLineState {
	if (!saved || typeof saved !== 'object') {
		throw new Error('Invalid file format: line item must be an object');
	}
	const type = (saved as { itemType?: string }).itemType;
	if (type === ItemType.SUBTOTAL_ITEM)
		return deserialiseSubtotalItem(saved as SavedSubtotalItem);
	if (type === ItemType.EXTENDED_ITEM)
		return deserialiseExtendedItem(saved as SavedExtendedItem);
	if (type === ItemType.LINE_ITEM)
		return deserialiseLineItem(saved as SavedLine);
	throw new Error(`Unknown item type: ${type}`);
}

export function deserialiseLines(saved: SavedAnyLine[]): AnyLineState[] {
	return saved.map(deserialiseLine);
}

function parseJsonOrThrow(json: string): unknown {
	try {
		return JSON.parse(json);
	} catch {
		throw new Error('Not a valid JSON file');
	}
}

function assertIsSummaFile(
	parsed: unknown
): asserts parsed is { metadata: unknown; lines: unknown } {
	if (
		!parsed ||
		typeof parsed !== 'object' ||
		(parsed as { metadata?: { appName?: string } }).metadata?.appName !==
			'summa'
	) {
		throw new Error('Not a Summa file');
	}
	if (!Array.isArray((parsed as { lines?: unknown }).lines)) {
		throw new Error('Invalid file format: missing lines');
	}
}

export function parseSummaFile(json: string): CalculationState {
	const parsed = parseJsonOrThrow(json);
	assertIsSummaFile(parsed);
	const lines = deserialiseLines(parsed.lines as SavedAnyLine[]);
	const { totalPence, totalDisplay, hasError } = computeGrandTotal(lines);
	return { lines, totalPence, totalDisplay, hasError };
}
