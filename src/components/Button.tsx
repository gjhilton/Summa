import { cva } from '@generated/css';

interface ButtonProps {
	label: string;
	onClick: () => void;
	variant?: 'primary' | 'danger';
}

const buttonStyle = cva({
	base: {
		cursor: 'pointer',
		py: 'xs',
		px: 'md',
		borderWidth: 'thin',
		borderStyle: 'solid',
		borderColor: 'current',
		borderRadius: 'sm',
		fontFamily: 'inherit',
		fontSize: 'inherit',
	},
	variants: {
		variant: {
			primary: { bg: 'primaryBg', color: 'primary' },
			danger: { bg: 'errorBg', color: 'errorText' },
		},
	},
	defaultVariants: {
		variant: 'primary',
	},
});

export default function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
	return (
		<button onClick={onClick} className={buttonStyle({ variant })}>
			{label}
		</button>
	);
}
