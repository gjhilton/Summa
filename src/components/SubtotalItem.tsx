import { css, cx } from '../generated/css';
import { SubtotalItemView } from '../types/lineView';
import RemoveButton from './RemoveButton';
import { lineError, lineHoverVars } from './LineItem.styles';
import CurrencyFields from './CurrencyFields';
import ItemRow from './ItemRow';

interface SubtotalItemProps {
	view: SubtotalItemView;
	canRemove: boolean;
	showWorking: boolean;
	onEdit: () => void;
	onRemove: () => void;
}

const subtotalRow = css({
	marginTop: '0.5rem',
	fontWeight: 'normal',
});

const titleButton = css({
	display: 'block',
	width: '100%',
	textAlign: 'left',
	fontSize: 'm',
	fontFamily: 'inherit',
	fontWeight: 'inherit',
	color: 'blue',
	textDecoration: 'underline',
	cursor: 'pointer',
	bg: 'transparent',
	borderWidth: '0',
	paddingLeft: 'sm',
	paddingRight: 'sm',
	paddingTop: 'md',
	paddingBottom: 'md',
	_hover: { opacity: '0.7' },
});

const placeholder = css({ opacity: '0.4' });

export default function SubtotalItem({
	view,
	canRemove,
	showWorking,
	onEdit,
	onRemove,
}: SubtotalItemProps) {
	const { title, totalDisplay, error } = view;
	return (
		<ItemRow
			className={cx(
				subtotalRow,
				lineHoverVars,
				error ? lineError : undefined
			)}
			remove={
				<RemoveButton
					canRemove={canRemove}
					label="Remove subtotal"
					onClick={onRemove}
				/>
			}
			title={
				<button
					className={titleButton}
					onClick={onEdit}
					aria-label={title || 'Untitled'}
				>
					{title ? (
						title
					) : (
						<span className={placeholder}>Untitled</span>
					)}
				</button>
			}
			currency={
				<CurrencyFields
					values={totalDisplay}
					showWorking={showWorking}
					hasError={error}
					noBorder
					fmtZero
					dimZero
				/>
			}
		/>
	);
}
