import { AnyLineState, ItemType } from '@/types/calculation';
import {
	AnyLineView,
	LineItemView,
	ExtendedItemView,
	SubtotalItemView,
} from '@/types/lineView';
import { formatLsdDisplay } from '@/utils/calculationLogic';
import { normalizeEarlyModernInput } from '@/utils/earlyModern';
import { romanToInteger } from '@/utils/roman';

function toSubtotalItemView(
	line: AnyLineState & { itemType: ItemType.SUBTOTAL_ITEM }
): SubtotalItemView {
	return {
		id: line.id,
		itemType: ItemType.SUBTOTAL_ITEM,
		title: line.title,
		totalDisplay: line.totalDisplay,
		totalPence: line.totalPence,
		error: line.error,
	};
}

function toLineItemView(
	line: AnyLineState & { itemType: ItemType.LINE_ITEM }
): LineItemView {
	return {
		id: line.id,
		itemType: ItemType.LINE_ITEM,
		title: line.title,
		error: line.error,
		fieldErrors: line.fieldErrors,
		literals: line.literals,
		totalPence: line.totalPence,
	};
}

function blankZero(s: string): string {
	return s === '0' ? '' : s;
}

function toExtendedItemView(
	line: AnyLineState & { itemType: ItemType.EXTENDED_ITEM }
): ExtendedItemView {
	// quantityError is defined as !isValidRoman(qNorm) || empty, so when it's
	// false we know the quantity is valid and romanToInteger is safe to call.
	const qNorm = normalizeEarlyModernInput(line.quantity);
	const quantityInt = line.quantityError ? null : romanToInteger(qNorm);
	const rawSubtotal = formatLsdDisplay(line.totalPence);
	return {
		id: line.id,
		itemType: ItemType.EXTENDED_ITEM,
		title: line.title,
		error: line.error,
		fieldErrors: line.fieldErrors,
		literals: line.literals,
		totalPence: line.totalPence,
		quantity: line.quantity,
		quantityError: line.quantityError,
		quantityInt,
		basePence: line.basePence,
		subtotalDisplay: {
			l: blankZero(rawSubtotal.l),
			s: blankZero(rawSubtotal.s),
			d: blankZero(rawSubtotal.d),
		},
	};
}

export function toLineView(line: AnyLineState): AnyLineView {
	if (line.itemType === ItemType.SUBTOTAL_ITEM)
		return toSubtotalItemView(line);
	if (line.itemType === ItemType.LINE_ITEM) return toLineItemView(line);
	return toExtendedItemView(line);
}
