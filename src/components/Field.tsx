interface FieldProps {
	value: string;
	label: 'l' | 's' | 'd';
}

const SUPERSCRIPTS: Record<string, string> = {
	l: 'ℓ',
	s: 's',
	d: 'd',
};

export default function Field({ value, label }: FieldProps) {
	return (
		<span
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: '0.125rem',
			}}
		>
			<sup style={{ fontSize: '0.75em' }}>{SUPERSCRIPTS[label]}</sup>
			<span
				style={{
					width: '5rem',
					textAlign: 'center',
					padding: '0.25rem',
					border: '1px solid #d1d5db',
					borderRadius: '4px',
					background: '#f9fafb',
					display: 'inline-block',
				}}
			>
				{value}
			</span>
		</span>
	);
}
