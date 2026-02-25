import { css } from '../generated/css';
import { LsdStrings } from '../types/calculation';
import { computeFieldWorking } from '../state/calculationLogic';
import Field from './Field';
import Button from './Button';
import Icon from './Icon';
import LedgerRow from './LedgerRow';

interface LineProps {
	literals: LsdStrings;
	error: boolean;
	canRemove: boolean;
	showOp: boolean;
	showWorking: boolean;
	totalPence: number;
	onChangeField: (f: 'l' | 's' | 'd', v: string) => void;
	onRemove: () => void;
}

const hidden = css({ visibility: 'hidden' });

const lineError = css({
	borderWidth: 'thin',
	borderStyle: 'solid',
	borderColor: 'error',
	bg: 'errorLineBg',
});

const opCol = css({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-end',
	padding: 'xs',
	userSelect: 'none',
	fontSize: '6xl',
	fontWeight: "100"
});

const opCross = css({
	display: 'inline-block',
	position: 'relative',
	width: '0.5em',
	height: '0.5em',
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

const lineTotalText = css({
	fontSize: 's',
	fontStyle: 'italic',
	whiteSpace: 'nowrap',
});

export default function Line({
	literals,
	error,
	canRemove,
	showOp,
	showWorking,
	totalPence,
	onChangeField,
	onRemove,
}: LineProps) {
	const toNode = (result: ReturnType<typeof computeFieldWorking>) =>
		result ? <>{result.prefix}{result.pence}<sup>d</sup></> : undefined;

	const working = showWorking && !error
		? {
				l: toNode(computeFieldWorking(literals.l, 'l')),
				s: toNode(computeFieldWorking(literals.s, 's')),
				d: toNode(computeFieldWorking(literals.d, 'd')),
			}
		: undefined;

	return (
		<LedgerRow className={error ? lineError : undefined}>
			<Button
				variant="icon"
				aria-label="Remove line"
				className={canRemove ? undefined : hidden}
				onClick={onRemove}
			>
				<Icon icon="cross" />
			</Button>
			<div className={opCol}>
				{showOp && <span className={opCross} aria-hidden="true" />}
				{showWorking && !error && totalPence > 0 && (
					<span className={lineTotalText}>= {totalPence}<sup>d</sup></span>
				)}
			</div>
			<Field value={literals.l} label="l" error={error} onChange={v => onChangeField('l', v)} working={working?.l} />
			<Field value={literals.s} label="s" error={error} onChange={v => onChangeField('s', v)} working={working?.s} />
			<Field value={literals.d} label="d" error={error} onChange={v => onChangeField('d', v)} working={working?.d} />
		</LedgerRow>
	);
}
