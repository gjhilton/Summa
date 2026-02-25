import { css, cx } from '../generated/css';
import { focusRing } from '../styles/shared';

interface FieldProps {
	value: string;
	label: 'l' | 's' | 'd';
	error?: boolean;
	onChange?: (v: string) => void;
	working?: React.ReactNode;
}

const LABELS = { l: 'li', s: 's', d: 'd' } as const;
const ARIA_LABELS = { l: 'pounds', s: 'shillings', d: 'pence' } as const;

const outerContainer = css({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	gap: 'xs',
	width: '100%',
});

const fieldRow = css({
	display: 'flex',
	alignItems: 'flex-end',
	width: '100%',
});

const fieldBase = css({
	flex: 1,
	minWidth: 0,
	textAlign: 'right',
	padding: 'xs',
	fontSize: 'xl',
	borderBottomWidth: '1px',
	borderBottomStyle: 'solid',
});

const inputStyle = css({
	fontFamily: 'inherit',
	transition: 'all 200ms ease-in-out',
	_focusVisible: focusRing,
});

const inputNormal = css({ borderBottomColor: 'ink', bg: 'paper' });
const inputError = css({ borderBottomColor: 'error', bg: 'errorBg' });

const readonlyStyle = css({
	display: 'inline-block',
	borderBottomColor: 'ink',
});

const labelBox = css({
	display: 'inline-flex',
	alignItems: 'flex-start',
	justifyContent: 'center',
	alignSelf: 'stretch',
	padding: 'xs',
	fontSize: 'l',
	flexShrink: 0,
});

const workingText = css({
	fontSize: 's',
	color: 'ink',
	opacity: 0.6,
	fontStyle: 'italic',
	textAlign: 'right',
});

export default function Field({ value, label, error = false, onChange, working }: FieldProps) {
	const FieldRow = onChange ? 'label' : 'span';
	return (
		<span className={outerContainer}>
			<FieldRow className={fieldRow}>
				{onChange ? (
					<input
						type="text"
						value={value}
						onChange={e => onChange(e.target.value)}
						aria-label={ARIA_LABELS[label]}
						className={cx(fieldBase, inputStyle, error ? inputError : inputNormal)}
					/>
				) : (
					<span className={cx(fieldBase, readonlyStyle)}>{value}</span>
				)}
				<span className={labelBox}>{LABELS[label]}</span>
			</FieldRow>
			{working && <span className={workingText}>{working}</span>}
		</span>
	);
}
