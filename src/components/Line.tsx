import { css, cx } from '../../dist/styled-system/css';
import { LsdStrings } from '../types/calculation';
import { computeFieldWorking } from '../state/calculationLogic';
import Field from './Field';
import Button from './Button';
import Icon from './Icon';

interface LineProps {
	literals: LsdStrings;
	error: boolean;
	canRemove: boolean;
	showWorking: boolean;
	totalPence: number;
	onChangeField: (f: 'l' | 's' | 'd', v: string) => void;
	onRemove: () => void;
}

const lineBase = css({
	display: 'flex',
	alignItems: 'center',
	gap: 'sm',
	padding: 'sm',
});

const lineError = css({
	borderWidth: 'thin',
	borderStyle: 'solid',
	borderColor: 'error',
	bg: 'errorLineBg',
});

const lineTotalText = css({
	fontSize: 's',
	fontStyle: 'italic',
	opacity: 0.6,
	whiteSpace: 'nowrap',
});

export default function Line({
	literals,
	error,
	canRemove,
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
		<div className={cx(lineBase, error && lineError)}>
			<Field value={literals.l} label="l" error={error} onChange={v => onChangeField('l', v)} working={working?.l} />
			<Field value={literals.s} label="s" error={error} onChange={v => onChangeField('s', v)} working={working?.s} />
			<Field value={literals.d} label="d" error={error} onChange={v => onChangeField('d', v)} working={working?.d} />
			{showWorking && !error && totalPence > 0 && (
				<span className={lineTotalText}>= {totalPence}<sup>d</sup></span>
			)}
			{canRemove && (
				<Button variant="icon" aria-label="Remove line" onClick={onRemove}>
					<Icon icon="cross" />
				</Button>
			)}
		</div>
	);
}
