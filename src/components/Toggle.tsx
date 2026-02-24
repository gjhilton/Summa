import { css, cx } from '@generated/css';

interface ToggleProps {
	id: string;
	label: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
	disabled?: boolean;
}

const row = css({
	display: 'flex',
	alignItems: 'center',
	gap: 'md',
});

const trackBase = css({
	position: 'relative',
	width: '51px',
	height: '31px',
	borderRadius: 'full',
	borderWidth: 0,
	cursor: 'pointer',
	transition: 'background-color 0.25s ease-in-out',
	flexShrink: 0,
	_focusVisible: {
		outlineWidth: 'medium',
		outlineStyle: 'solid',
		outlineColor: 'ink',
		outlineOffset: 'tiny',
	},
	_active: { transform: 'scale(0.98)' },
	_disabled: { opacity: 0.4, cursor: 'not-allowed' },
});

const trackOn = css({ backgroundColor: 'toggleActive' });
const trackOff = css({ backgroundColor: 'toggleInactive' });

const knobBase = css({
	position: 'absolute',
	top: '2px',
	width: '27px',
	height: '27px',
	borderRadius: 'full',
	backgroundColor: 'paper',
	boxShadow: '0 3px 8px rgba(0,0,0,0.15), 0 1px 1px rgba(0,0,0,0.16)',
	transition: 'left 0.25s ease-in-out',
});

const knobOn = css({ left: '22px' });
const knobOff = css({ left: '2px' });

const labelBase = css({ fontSize: 'm', cursor: 'pointer' });
const labelDisabled = css({ opacity: 0.4, cursor: 'not-allowed' });

export default function Toggle({ id, label, checked, onChange, disabled = false }: ToggleProps) {
	return (
		<div className={row}>
			<button
				type="button"
				id={id}
				role="switch"
				aria-checked={checked}
				aria-label={label}
				disabled={disabled}
				onClick={() => onChange(!checked)}
				className={cx(trackBase, checked ? trackOn : trackOff)}
			>
				<span className={cx(knobBase, checked ? knobOn : knobOff)} />
			</button>
			<label htmlFor={id} className={cx(labelBase, disabled && labelDisabled)}>
				{label}
			</label>
		</div>
	);
}
