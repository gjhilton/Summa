import { css, cx } from '@generated/css';
import { LsdStrings } from '../types/calculation';
import Field from './Field';
import Button from './Button';

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
	borderWidth: 'thin',
	borderStyle: 'solid',
	borderRadius: 'sm',
});

const lineNormal = css({ borderColor: 'transparent', bg: 'transparent' });
const lineError = css({ borderColor: 'error', bg: 'errorLineBg' });

export default function Line({ literals, error, onChangeField, onRemove }: LineProps) {
	return (
		<div className={cx(lineBase, error ? lineError : lineNormal)}>
			<Field value={literals.l} label="l" error={error} onChange={v => onChangeField('l', v)} />
			<Field value={literals.s} label="s" error={error} onChange={v => onChangeField('s', v)} />
			<Field value={literals.d} label="d" error={error} onChange={v => onChangeField('d', v)} />
			<Button label="×" onClick={onRemove} variant="danger" />
		</div>
	);
}
