import { cva, cx } from '../generated/css';
import { focusRing } from '../styles/shared';

interface ButtonProps {
	onClick: () => void;
	variant?: 'primary' | 'danger' | 'icon';
	'aria-label'?: string;
	className?: string;
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
		outlineWidth: '0',
		outlineStyle: 'none',
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
				borderWidth: '0',
			},
		},
	},
	defaultVariants: { variant: 'primary' },
});

export default function Button({ onClick, variant = 'primary', 'aria-label': ariaLabel, className, children }: ButtonProps) {
	return (
		<button type="button" onClick={onClick} aria-label={ariaLabel} className={cx(buttonStyle({ variant }), className)}>
			{children}
		</button>
	);
}
