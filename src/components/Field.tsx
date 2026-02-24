import { css, cx } from '@generated/css';

interface FieldProps {
	value: string;
	label: 'l' | 's' | 'd';
	error?: boolean;
	onChange?: (v: string) => void;
	working?: React.ReactNode;
}

const LABELS = { l: 'ℓ', s: 's', d: 'd' } as const;

const container = css({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: 'xs',
});

const supNormal = css({ fontSize: 's' });
const supError = css({ fontSize: 's', color: 'error' });

const inputBase = css({
	width: 'field',
	textAlign: 'center',
	padding: 'xs',
	fontFamily: 'inherit',
	fontSize: 'm',
	transition: 'all 200ms ease-in-out',
	borderWidth: 'thin',
	borderStyle: 'solid',
	_focusVisible: {
		outlineWidth: 'medium',
		outlineStyle: 'solid',
		outlineColor: 'ink',
		outlineOffset: 'tiny',
	},
});

const inputNormal = css({ borderColor: 'ink', bg: 'paper' });
const inputError = css({ borderColor: 'error', bg: 'errorBg' });

const workingText = css({
	fontSize: 's',
	color: 'ink',
	opacity: 0.6,
	fontStyle: 'italic',
	textAlign: 'center',
});

const readonlyField = css({
	width: 'field',
	textAlign: 'center',
	padding: 'xs',
	borderWidth: 'thin',
	borderStyle: 'solid',
	borderColor: 'ink',
	bg: 'muted',
	display: 'inline-block',
	fontFamily: 'joscelyn',
	fontSize: 'm',
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
					aria-label={{ l: 'pounds', s: 'shillings', d: 'pence' }[label]}
					className={cx(inputBase, error ? inputError : inputNormal)}
				/>
			) : (
				<span className={readonlyField}>{value}</span>
			)}
			{onChange && working && <span className={workingText}>{working}</span>}
		</Wrapper>
	);
}
