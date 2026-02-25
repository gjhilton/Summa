import { css, cx } from '../generated/css';
import { ItemWithQuantityState } from '../types/calculation';
import { computeFieldWorking, formatComponent } from '../state/calculationLogic';
import { normalizeEarlyModernInput } from '../utils/earlyModern';
import { isValidRoman, romanToInteger } from '../utils/roman';
import { penceToLsd } from '../utils/currency';
import Field from './Field';
import Button from './Button';
import Icon from './Icon';
import LedgerRow from './LedgerRow';

interface ItemWithQuantityProps {
	line: ItemWithQuantityState;
	canRemove: boolean;
	showWorking: boolean;
	onChangeField: (f: 'l' | 's' | 'd', v: string) => void;
	onChangeQuantity: (v: string) => void;
	onRemove: () => void;
}

// auto(remove) | 1em(() | 1fr(op) | 20%(qty) | auto(@) | 20%(l) | 20%(s) | 20%(d) | 1em())
// The 1em bracket cols align with the new bracket cols in Item/Total rows.
const COLUMNS = 'auto 1em 1fr 20% auto 20% 20% 20% 1em';

const hidden = css({ visibility: 'hidden' });

const lineError = css({ bg: 'errorLineBg' });

const inputRow = css({ fontStyle: 'italic', fontWeight: '100' });

const opMain = css({
	flex: 1,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
});

const atSign = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	paddingLeft: 'xs',
	paddingRight: 'xs',
	fontSize: '6xl',
	fontWeight: '100',
	userSelect: 'none',
});

const mulSymbol = css({
	display: 'inline-block',
	position: 'relative',
	width: '0.5em',
	height: '0.5em',
	transform: 'rotate(45deg)',
	_before: {
		content: '""',
		position: 'absolute',
		width: '1px',
		height: '100%',
		left: '50%',
		top: '0',
		transform: 'translateX(-50%)',
		bg: 'currentColor',
	},
	_after: {
		content: '""',
		position: 'absolute',
		height: '1px',
		width: '100%',
		top: '50%',
		left: '0',
		transform: 'translateY(-50%)',
		bg: 'currentColor',
	},
});

const eqSymbol = css({
	display: 'inline-block',
	position: 'relative',
	width: '0.5em',
	height: '0.5em',
	_before: {
		content: '""',
		position: 'absolute',
		height: '1px',
		width: '100%',
		top: '33%',
		left: '0',
		bg: 'currentColor',
	},
	_after: {
		content: '""',
		position: 'absolute',
		height: '1px',
		width: '100%',
		top: '67%',
		left: '0',
		bg: 'currentColor',
	},
});

const subtotalOpCol = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	paddingLeft: 'xs',
	paddingRight: 'xs',
	userSelect: 'none',
	fontSize: '6xl',
	fontWeight: '100',
});

// Full-height ( bracket: left + top + bottom borders, 50% radius on left corners
const openParenCol = css({
	position: 'relative',
	_before: {
		content: '""',
		position: 'absolute',
		top: '4px',
		bottom: '4px',
		right: '2px',
		width: '0.6em',
		borderTopWidth: '1px',
		borderTopStyle: 'solid',
		borderTopColor: 'currentColor',
		borderLeftWidth: '1px',
		borderLeftStyle: 'solid',
		borderLeftColor: 'currentColor',
		borderBottomWidth: '1px',
		borderBottomStyle: 'solid',
		borderBottomColor: 'currentColor',
		borderTopLeftRadius: '50%',
		borderBottomLeftRadius: '50%',
	},
});

// Full-height ) bracket: right + top + bottom borders, 50% radius on right corners
const closeParenCol = css({
	position: 'relative',
	_before: {
		content: '""',
		position: 'absolute',
		top: '4px',
		bottom: '4px',
		left: '2px',
		width: '0.6em',
		borderTopWidth: '1px',
		borderTopStyle: 'solid',
		borderTopColor: 'currentColor',
		borderRightWidth: '1px',
		borderRightStyle: 'solid',
		borderRightColor: 'currentColor',
		borderBottomWidth: '1px',
		borderBottomStyle: 'solid',
		borderBottomColor: 'currentColor',
		borderTopRightRadius: '50%',
		borderBottomRightRadius: '50%',
	},
});

const multiplyCol = css({ gridColumn: 'span 2' });

const supD = css({ marginLeft: '2px' });

function fmt(v: string) { return v === '0' ? '—' : v; }

export default function ItemWithQuantity({
	line,
	canRemove,
	showWorking,
	onChangeField,
	onChangeQuantity,
	onRemove,
}: ItemWithQuantityProps) {
	const { literals, quantity, fieldErrors, quantityError, error, basePence, totalPence } = line;

	const qNorm = normalizeEarlyModernInput(quantity);
	const quantityInt = !quantityError && isValidRoman(qNorm) ? romanToInteger(qNorm) : null;

	const subtotalLsd = penceToLsd(totalPence);
	const subtotalDisplay = {
		l: formatComponent(subtotalLsd.l),
		s: formatComponent(subtotalLsd.s),
		d: formatComponent(subtotalLsd.d),
	};

	const toNode = (result: ReturnType<typeof computeFieldWorking>) =>
		result ? <>{result.prefix}{result.pence}<sup className={supD}>d</sup></> : undefined;

	const quantityWorking = showWorking && !error && quantityInt !== null
		? quantityInt
		: undefined;

	const inputWorking = showWorking && !error
		? {
				l: toNode(computeFieldWorking(literals.l, 'l')),
				s: toNode(computeFieldWorking(literals.s, 's')),
				d: toNode(computeFieldWorking(literals.d, 'd')),
			}
		: undefined;

	const multiplicationWorking = showWorking && !error && quantityInt !== null && basePence > 0
		? <>{quantityInt} × {basePence}<sup className={supD}>d</sup> = {totalPence}<sup className={supD}>d</sup></>
		: undefined;

	const subtotalWorking = showWorking && !error
		? {
				l: toNode(computeFieldWorking(subtotalDisplay.l, 'l')),
				s: toNode(computeFieldWorking(subtotalDisplay.s, 's')),
				d: toNode(computeFieldWorking(subtotalDisplay.d, 'd')),
			}
		: undefined;

	const errorClass = error ? lineError : undefined;

	return (
		<>
			{/* Input row: remove | ( | op | qty | × | l | s | d | ) */}
			<LedgerRow columns={COLUMNS} className={cx(inputRow, errorClass)}>
				<Button
					variant="icon"
					aria-label="Remove item"
					className={canRemove ? undefined : hidden}
					onClick={onRemove}
				>
					<Icon icon="cross" />
				</Button>
				<span className={openParenCol} aria-hidden="true" />
				<div className={opMain} />
				<Field value={quantity} label="q" error={quantityError} onChange={onChangeQuantity} showWorking={showWorking} working={quantityWorking} />
				<span className={atSign} aria-hidden="true"><span className={mulSymbol} /></span>
				<Field value={literals.l} label="l" error={fieldErrors.l} onChange={v => onChangeField('l', v)} showWorking={showWorking} working={inputWorking?.l} />
				<Field value={literals.s} label="s" error={fieldErrors.s} onChange={v => onChangeField('s', v)} showWorking={showWorking} working={inputWorking?.s} />
				<Field value={literals.d} label="d" error={fieldErrors.d} onChange={v => onChangeField('d', v)} showWorking={showWorking} working={inputWorking?.d} />
				<span className={closeParenCol} aria-hidden="true" />
			</LedgerRow>

			{/* Subtotal row: empty | empty | working(span 2) | = | l | s | d | empty */}
			<LedgerRow columns={COLUMNS} className={errorClass}>
				<span />
				<span />
				<Field value={'\u00A0'} label="q" noBorder showWorking={showWorking} working={multiplicationWorking} className={multiplyCol} />
				<div className={subtotalOpCol}><span className={eqSymbol} aria-hidden="true" /></div>
				<Field value={fmt(subtotalDisplay.l)} label="l" noBorder showWorking={showWorking} working={subtotalWorking?.l} />
				<Field value={fmt(subtotalDisplay.s)} label="s" noBorder showWorking={showWorking} working={subtotalWorking?.s} />
				<Field value={fmt(subtotalDisplay.d)} label="d" noBorder showWorking={showWorking} working={subtotalWorking?.d} />
				<span />
			</LedgerRow>
		</>
	);
}
