import {
	ItemType,
	AnyLineState,
	CalculationState,
	isExtendedItem,
	isSubtotalItem,
} from '../types/calculation';
import {
	SavedAnyLine,
	SavedLine,
	SavedExtendedItem,
	SavedSubtotalItem,
	SummaFile,
} from '../types/savedCalculation';
import {
	computeLinePence,
	computeExtendedItemPence,
	computeGrandTotal,
	recomputeSubtotal,
} from './calculationLogic';

export function serializeLine(line: AnyLineState): SavedAnyLine {
	if (isSubtotalItem(line)) {
		const saved: SavedSubtotalItem = {
			id: line.id,
			itemType: ItemType.SUBTOTAL_ITEM,
			title: line.title,
			lines: serializeLines(line.lines),
		};
		return saved;
	}
	if (isExtendedItem(line)) {
		const saved: SavedExtendedItem = {
			id: line.id,
			itemType: ItemType.EXTENDED_ITEM,
			title: line.title,
			literals: line.literals,
			quantity: line.quantity,
		};
		return saved;
	}
	const saved: SavedLine = {
		id: line.id,
		itemType: ItemType.LINE_ITEM,
		title: line.title,
		literals: line.literals,
	};
	return saved;
}

export function serializeLines(lines: AnyLineState[]): SavedAnyLine[] {
	return lines.map(serializeLine);
}

export function createSummaFile(state: CalculationState): SummaFile {
	return {
		metadata: {
			appName: 'summa',
			version: __APP_VERSION__,
			savedAt: new Date().toISOString(),
		},
		lines: serializeLines(state.lines),
	};
}

export function deserializeLine(saved: SavedAnyLine): AnyLineState {
	const type = (saved as { itemType?: string }).itemType;

	if (type === ItemType.SUBTOTAL_ITEM) {
		const s = saved as SavedSubtotalItem;
		if (!s.id) throw new Error('Invalid subtotal item: missing id');
		if (!Array.isArray(s.lines))
			throw new Error('Invalid subtotal item: missing lines');
		const lines = deserializeLines(s.lines);
		return recomputeSubtotal({
			id: s.id,
			itemType: ItemType.SUBTOTAL_ITEM,
			title: s.title ?? '',
			lines,
			totalPence: 0,
			totalDisplay: { l: '0', s: '0', d: '0' },
			error: false,
		});
	}

	if (type === ItemType.EXTENDED_ITEM) {
		const s = saved as SavedExtendedItem;
		if (!s.id) throw new Error('Invalid extended item: missing id');
		if (!s.literals)
			throw new Error('Invalid extended item: missing literals');
		if (typeof s.quantity !== 'string')
			throw new Error('Invalid extended item: missing quantity');
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

	if (type === ItemType.LINE_ITEM) {
		const s = saved as SavedLine;
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

	throw new Error(`Unknown item type: ${type}`);
}

export function deserializeLines(saved: SavedAnyLine[]): AnyLineState[] {
	return saved.map(deserializeLine);
}

export function parseSummaFile(json: string): CalculationState {
	let parsed: unknown;
	try {
		parsed = JSON.parse(json);
	} catch {
		throw new Error('Not a valid JSON file');
	}

	if (
		!parsed ||
		typeof parsed !== 'object' ||
		(parsed as { metadata?: { appName?: string } }).metadata?.appName !==
			'summa'
	) {
		throw new Error('Not a Summa file');
	}

	const file = parsed as { metadata: unknown; lines: unknown };

	if (!Array.isArray(file.lines)) {
		throw new Error('Invalid file format: missing lines');
	}

	const lines = deserializeLines(file.lines as SavedAnyLine[]);
	const { totalPence, totalDisplay, hasError } = computeGrandTotal(lines);
	return { lines, totalPence, totalDisplay, hasError };
}
