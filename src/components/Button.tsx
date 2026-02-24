import { cva } from '../../dist/styled-system/css';
import { focusRing } from '../styles/shared';

interface ButtonProps {
	onClick: () => void;
	variant?: 'primary' | 'danger' | 'icon';
	'aria-label'?: string;
	children: React.ReactNode;
}

const buttonStyle = cva({
	base: {
		cursor: 'pointer',
		borderWidth: 'thin',
		borderStyle: 'solid',
		borderColor: 'ink',
		fontFamily: 'inherit',
		transition: 'all 200ms ease-in-out',
		_hover: { transform: 'scale(1.02)' },
		_active: { transform: 'scale(0.95)' },
		_focusVisible: focusRing,
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

export default function Button({ onClick, variant = 'primary', 'aria-label': ariaLabel, children }: ButtonProps) {
	return (
		<button type="button" onClick={onClick} aria-label={ariaLabel} className={buttonStyle({ variant })}>
			{children}
		</button>
	);
}
