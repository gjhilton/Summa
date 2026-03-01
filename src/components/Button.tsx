import { cva, cx } from '../generated/css';
import { focusRing } from './Button.styles';

interface ButtonProps {
	onClick: () => void;
	variant?: 'primary' | 'danger' | 'icon';
	disabled?: boolean;
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
		_disabled: {
			opacity: '0.4',
			cursor: 'not-allowed',
			transform: 'none',
			pointerEvents: 'none',
		},
	},
	variants: {
		variant: {
			primary: {
				bg: 'paper',
				color: 'ink',
				fontSize: 'm',
				px: 'lg',
				py: 'sm',
			},
			danger: {
				bg: 'ink',
				color: 'paper',
				fontSize: 'm',
				px: 'lg',
				py: 'sm',
			},
			icon: {
				bg: 'transparent',
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

export default function Button({
	onClick,
	variant = 'primary',
	disabled,
	'aria-label': ariaLabel,
	className,
	children,
}: ButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			aria-label={ariaLabel}
			className={cx(buttonStyle({ variant }), className)}
		>
			{children}
		</button>
	);
}
