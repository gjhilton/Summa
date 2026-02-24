import { css, cx } from '@generated/css';
import { focusRing } from '../styles/shared';

interface FieldProps {
	value: string;
	label: 'l' | 's' | 'd';
	error?: boolean;
	onChange?: (v: string) => void;
	working?: React.ReactNode;
}

const LABELS = { l: 'ℓ', s: 's', d: 'd' } as const;
const ARIA_LABELS = { l: 'pounds', s: 'shillings', d: 'pence' } as const;

const container = css({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: 'xs',
});

const supNormal = css({ fontSize: 's' });
const supError = css({ fontSize: 's', color: 'error' });

const fieldBase = css({
	width: 'field',
	textAlign: 'center',
	padding: 'xs',
	borderWidth: 'thin',
	borderStyle: 'solid',
	fontSize: 'm',
});

const inputStyle = css({
	fontFamily: 'inherit',
	transition: 'all 200ms ease-in-out',
	_focusVisible: focusRing,
});

const inputNormal = css({ borderColor: 'ink', bg: 'paper' });
const inputError = css({ borderColor: 'error', bg: 'errorBg' });

const readonlyStyle = css({
	borderColor: 'ink',
	bg: 'muted',
	display: 'inline-block',
	fontFamily: 'joscelyn',
});

const workingText = css({
	fontSize: 's',
	color: 'ink',
	opacity: 0.6,
	fontStyle: 'italic',
	textAlign: 'center',
});

export default function Field({ value, label, error = false, onChange, working }: FieldProps) {
	const Wrapper = onChange ? 'label' : 'span';
	return (
		<Wrapper className={container}>
			<sup className={error ? supError : supNormal}>{LABELS[label]}</sup>
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
			{onChange && working && <span className={workingText}>{working}</span>}
		</Wrapper>
	);
}
