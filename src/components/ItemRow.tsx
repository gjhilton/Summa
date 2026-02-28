import { css } from '../generated/css';
import LedgerRow from './LedgerRow';
import Icon from './Icon';
import { useDragHandle } from './DragHandleContext';

/**
 * Slot-based row for all ledger item types.
 * Provides named slots that correspond to the 9 universal grid columns:
 *   col 1 1.5rem = drag handle (built-in, from SortableItem context)
 *   col 2 1.5rem = remove button
 *   col 3 1em   = left bracket / spacer
 *   col 4 1fr   = title / qty  (all titles and ExtendedItem qty align here)
 *   col 5 auto  = operator symbol (×, =) or spacer
 *   col 6–8     = l / s / d  (rendered by CurrencyFields fragment — 3 grid children)
 *   col 9 1em   = right bracket / trailing spacer
 */
interface ItemRowProps {
	className?: string;
	noDragHandle?: boolean;
	remove?: React.ReactNode;
	leftBracket?: React.ReactNode;
	title?: React.ReactNode;
	operator?: React.ReactNode;
	currency: React.ReactNode;
	rightBracket?: React.ReactNode;
}

const dragHandle = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	cursor: 'grab',
	color: 'ink',
	opacity: '0.25',
	touchAction: 'none',
	userSelect: 'none',
	_hover: { opacity: '0.6' },
	_active: { cursor: 'grabbing' },
});

export default function ItemRow({
	className,
	noDragHandle = false,
	remove,
	leftBracket,
	title,
	operator,
	currency,
	rightBracket,
}: ItemRowProps) {
	const drag = useDragHandle();
	return (
		<LedgerRow className={className}>
			{!noDragHandle && drag ? (
				<button
					className={dragHandle}
					aria-label="Drag to reorder"
					{...drag.listeners}
					{...drag.attributes}
				>
					<Icon icon="grip" size={14} />
				</button>
			) : (
				<span />
			)}
			{remove ?? <span />}
			{leftBracket ?? <span />}
			{title ?? <span />}
			{operator ?? <span />}
			{currency}
			{rightBracket ?? <span />}
		</LedgerRow>
	);
}
