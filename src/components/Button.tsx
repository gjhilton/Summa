import { cva } from '@generated/css';

interface ButtonProps {
	onClick: () => void;
	variant?: 'primary' | 'danger' | 'icon';
	children: React.ReactNode;
}

const buttonStyle = cva({
	base: {
		cursor: 'pointer',
		border: '1px solid {colors.ink}',
		fontFamily: 'inherit',
		transition: 'all 200ms ease-in-out',
		_hover: { transform: 'scale(1.02)' },
		_active: { transform: 'scale(0.95)' },
		_focusVisible: { outline: 'medium solid {colors.ink}', outlineOffset: 'tiny' },
	},
	variants: {
		variant: {
			primary: { bg: 'paper', color: 'ink', fontSize: 'm', px: 'lg', py: 'sm' },
			danger: { bg: 'ink', color: 'paper', fontSize: 'm', px: 'lg', py: 'sm' },
			icon: {
				bg: 'paper',
				color: 'ink',
				p: 'xs',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			},
		},
	},
	defaultVariants: { variant: 'primary' },
});

export default function Button({ onClick, variant = 'primary', children }: ButtonProps) {
	return (
		<button onClick={onClick} className={buttonStyle({ variant })}>
			{children}
		</button>
	);
}
