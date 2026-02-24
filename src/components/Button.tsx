interface ButtonProps {
	label: string;
	onClick: () => void;
	variant?: 'primary' | 'danger';
}

export default function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
	return (
		<button
			onClick={onClick}
			style={{
				cursor: 'pointer',
				padding: '0.25rem 0.75rem',
				border: '1px solid currentColor',
				borderRadius: '4px',
				background: variant === 'danger' ? '#fee2e2' : '#dbeafe',
				color: variant === 'danger' ? '#991b1b' : '#1e40af',
				fontFamily: 'inherit',
				fontSize: 'inherit',
			}}
		>
			{label}
		</button>
	);
}
