import { css } from '../generated/css';
import { LsdStrings } from '../types/calculation';
import { computeFieldWorking } from '../state/calculationLogic';
import { workingRowStyles } from '../styles/shared';
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
	paddingLeft: 'xs',
	paddingRight: 'xs',
	userSelect: 'none',
	gap: 'xs',
});

const opMain = css({
	flex: 1,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	fontSize: '6xl',
	fontWeight: '100',
});

const opWorkingRow = css({
	...workingRowStyles,
	whiteSpace: 'nowrap',
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


const supD = css({ marginLeft: '2px' });

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
		result ? <>{result.prefix}{result.pence}<sup className={supD}>d</sup></> : undefined;

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
				<div className={opMain}>
					{!showWorking && showOp && <span className={opCross} aria-hidden="true" />}
				</div>
				{showWorking && (
					<span className={opWorkingRow}>
						{!error && totalPence > 0 && <>{totalPence}<sup className={supD}>d</sup> =</>}
					</span>
				)}
			</div>
			<Field value={literals.l} label="l" error={error} onChange={v => onChangeField('l', v)} showWorking={showWorking} working={working?.l} />
			<Field value={literals.s} label="s" error={error} onChange={v => onChangeField('s', v)} showWorking={showWorking} working={working?.s} />
			<Field value={literals.d} label="d" error={error} onChange={v => onChangeField('d', v)} showWorking={showWorking} working={working?.d} />
		</LedgerRow>
	);
}
