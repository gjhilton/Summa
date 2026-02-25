import { css, cx } from '../generated/css';
import { focusRing, workingRowStyles } from '../styles/shared';

interface FieldProps {
	value: string;
	label: 'l' | 's' | 'd' | 'q';
	error?: boolean;
	noBorder?: boolean;
	weight?: 'bold' | 'light';
	className?: string;
	onChange?: (v: string) => void;
	showWorking?: boolean;
	working?: React.ReactNode;
}

const LABELS = { l: 'li', s: 's', d: 'd', q: '' } as const;
const ARIA_LABELS = { l: 'pounds', s: 'shillings', d: 'pence', q: 'quantity' } as const;

// Outer flex row: field inner + label side by side
const fieldRow = css({
	display: 'flex',
	alignItems: 'flex-start',
	width: '100%',
});

// Inner column: value input/span stacked above working text
const fieldInner = css({
	display: 'flex',
	flexDirection: 'column',
	flex: 1,
	minWidth: 0,
});

const fieldBase = css({
	width: '100%',
	textAlign: 'right',
	padding: 'xs',
	fontSize: 'xl',
	borderBottomWidth: '1px',
	borderBottomStyle: 'solid',
});

const inputStyle = css({
	fontFamily: 'inherit',
	transition: 'all 200ms ease-in-out',
	outlineWidth: '0',
	outlineStyle: 'none',
	_focusVisible: focusRing,
});

const inputNormal = css({ borderBottomColor: 'ink', bg: 'transparent' });
const inputError = css({ color: 'error' });

const readonlyStyle = css({
	display: 'inline-block',
	borderBottomColor: 'ink',
});

const readonlyNoBorder = css({ borderBottomColor: 'transparent' });
const readonlyBold = css({ fontWeight: 'bold' });
const readonlyLight = css({ fontWeight: '100' });

const labelError = css({ color: 'error' });

const labelBox = css({
	display: 'inline-flex',
	alignItems: 'flex-start',
	justifyContent: 'center',
	padding: 'xs',
	fontSize: 'l',
	flexShrink: 0,
});

// Working text sits inside fieldInner, naturally aligned with the value above it
const workingText = css({
	...workingRowStyles,
	paddingRight: 'xs',
});

export default function Field({ value, label, error = false, noBorder = false, weight, className, onChange, showWorking = false, working }: FieldProps) {
	const FieldRow = onChange ? 'label' : 'span';
	return (
		<FieldRow className={cx(fieldRow, className)}>
			<span className={fieldInner}>
				{onChange ? (
					<input
						type="text"
						value={value}
						onChange={e => onChange(e.target.value)}
						spellCheck={false}
						aria-label={ARIA_LABELS[label]}
						className={cx(fieldBase, inputStyle, error ? inputError : inputNormal)}
					/>
				) : (
					<span className={cx(fieldBase, readonlyStyle, noBorder && readonlyNoBorder, weight === 'bold' && readonlyBold, weight === 'light' && readonlyLight)}>{value}</span>
				)}
				{showWorking && <span className={workingText}>{working}</span>}
			</span>
			{LABELS[label] && <span className={cx(labelBox, error && labelError)}>{LABELS[label]}</span>}
		</FieldRow>
	);
}
