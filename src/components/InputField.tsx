interface InputFieldProps {
	value: string;
	label: 'l' | 's' | 'd';
	error: boolean;
	onChange: (v: string) => void;
}

const SUPERSCRIPTS: Record<string, string> = {
	l: 'ℓ',
	s: 's',
	d: 'd',
};

export default function InputField({ value, label, error, onChange }: InputFieldProps) {
	return (
		<label
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: '0.125rem',
			}}
		>
			<sup style={{ fontSize: '0.75em', color: error ? '#991b1b' : 'inherit' }}>
				{SUPERSCRIPTS[label]}
			</sup>
			<input
				type="text"
				value={value}
				onChange={e => onChange(e.target.value)}
				aria-label={label}
				style={{
					width: '5rem',
					textAlign: 'center',
					padding: '0.25rem',
					border: `1px solid ${error ? '#ef4444' : '#d1d5db'}`,
					borderRadius: '4px',
					background: error ? '#fee2e2' : 'white',
					fontFamily: 'inherit',
					fontSize: 'inherit',
				}}
			/>
		</label>
	);
}
