import { FieldLiterals } from '../types/calculation';
import InputField from './InputField';
import Button from './Button';

interface LineProps {
	id: string;
	literals: FieldLiterals;
	error: boolean;
	onChangeField: (f: 'l' | 's' | 'd', v: string) => void;
	onRemove: () => void;
}

export default function Line({ literals, error, onChangeField, onRemove }: LineProps) {
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: '0.5rem',
				padding: '0.5rem',
				border: `1px solid ${error ? '#ef4444' : 'transparent'}`,
				borderRadius: '4px',
				background: error ? '#fff5f5' : 'transparent',
			}}
		>
			<InputField
				value={literals.l}
				label="l"
				error={error}
				onChange={v => onChangeField('l', v)}
			/>
			<InputField
				value={literals.s}
				label="s"
				error={error}
				onChange={v => onChangeField('s', v)}
			/>
			<InputField
				value={literals.d}
				label="d"
				error={error}
				onChange={v => onChangeField('d', v)}
			/>
			<Button label="×" onClick={onRemove} variant="danger" />
		</div>
	);
}
