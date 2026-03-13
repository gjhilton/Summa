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

export function toLineView(line: AnyLineState): AnyLineView {
	if (line.itemType === ItemType.SUBTOTAL_ITEM) {
		const view: SubtotalItemView = {
			id: line.id,
			itemType: ItemType.SUBTOTAL_ITEM,
			title: line.title,
			totalDisplay: line.totalDisplay,
			totalPence: line.totalPence,
			error: line.error,
		};
		return view;
	}

	if (line.itemType === ItemType.LINE_ITEM) {
		const view: LineItemView = {
			id: line.id,
			itemType: ItemType.LINE_ITEM,
			title: line.title,
			error: line.error,
			fieldErrors: line.fieldErrors,
			literals: line.literals,
			totalPence: line.totalPence,
		};
		return view;
	}

	// EXTENDED_ITEM
	// quantityError is defined as !isValidRoman(qNorm) || empty, so when it's
	// false we know the quantity is valid and romanToInteger is safe to call.
	const qNorm = normalizeEarlyModernInput(line.quantity);
	const quantityInt = line.quantityError ? null : romanToInteger(qNorm);

	const rawSubtotal = formatLsdDisplay(line.totalPence);
	const subtotalDisplay = {
		l: rawSubtotal.l === '0' ? '' : rawSubtotal.l,
		s: rawSubtotal.s === '0' ? '' : rawSubtotal.s,
		d: rawSubtotal.d === '0' ? '' : rawSubtotal.d,
	};

	const view: ExtendedItemView = {
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
		subtotalDisplay,
	};
	return view;
}
