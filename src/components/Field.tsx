import { css, cx } from '@generated/css';

interface FieldProps {
	value: string;
	label: 'l' | 's' | 'd';
	error?: boolean;
	onChange?: (v: string) => void;
}

const LABELS = { l: 'ℓ', s: 's', d: 'd' } as const;

const container = css({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: 'xs',
});

const supNormal = css({ fontSize: 's' });
const supError = css({ fontSize: 's', color: 'errorText' });

const fieldBase = css({
	width: 'field',
	textAlign: 'center',
	padding: 'xs',
	borderWidth: 'thin',
	borderStyle: 'solid',
	borderRadius: 'sm',
	fontFamily: 'inherit',
	fontSize: 'inherit',
});

const inputNormal = css({ borderColor: 'border', bg: 'paper' });
const inputError = css({ borderColor: 'error', bg: 'errorBg' });

const readonlyField = css({
	width: 'field',
	textAlign: 'center',
	padding: 'xs',
	borderWidth: 'thin',
	borderStyle: 'solid',
	borderColor: 'border',
	borderRadius: 'sm',
	bg: 'muted',
	display: 'inline-block',
});

export default function Field({ value, label, error = false, onChange }: FieldProps) {
	const Wrapper = onChange ? 'label' : 'span';
	return (
		<Wrapper className={container}>
			<sup className={error ? supError : supNormal}>{LABELS[label]}</sup>
			{onChange ? (
				<input
					type="text"
					value={value}
					onChange={e => onChange(e.target.value)}
					aria-label={label}
					className={cx(fieldBase, error ? inputError : inputNormal)}
				/>
			) : (
				<span className={readonlyField}>{value}</span>
			)}
		</Wrapper>
	);
}
