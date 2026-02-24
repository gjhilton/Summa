import { css, cx } from '@generated/css';
import { LsdStrings } from '../types/calculation';
import Field from './Field';
import Button from './Button';
import Icon from './Icon';

interface LineProps {
	literals: LsdStrings;
	error: boolean;
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

export default function Line({ literals, error, onChangeField, onRemove }: LineProps) {
	return (
		<div className={cx(lineBase, error && lineError)}>
			<Field value={literals.l} label="l" error={error} onChange={v => onChangeField('l', v)} />
			<Field value={literals.s} label="s" error={error} onChange={v => onChangeField('s', v)} />
			<Field value={literals.d} label="d" error={error} onChange={v => onChangeField('d', v)} />
			<Button variant="icon" aria-label="Remove line" onClick={onRemove}>
				<Icon icon="cross" />
			</Button>
		</div>
	);
}
