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
const supError = css({ fontSize: 's', color: 'error' });

const inputBase = css({
	width: 'field',
	textAlign: 'center',
	padding: 'xs',
	fontFamily: 'inherit',
	fontSize: 'm',
	transition: 'all 200ms ease-in-out',
	_focusVisible: { outline: 'medium solid {colors.ink}', outlineOffset: 'tiny' },
});

const inputNormal = css({ border: '1px solid {colors.ink}', bg: 'paper' });
const inputError = css({ border: '1px solid {colors.error}', bg: 'errorBg' });

const readonlyField = css({
	width: 'field',
	textAlign: 'center',
	padding: 'xs',
	border: '1px solid {colors.ink}',
	bg: 'muted',
	display: 'inline-block',
	fontFamily: 'joscelyn',
	fontSize: 'm',
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
					className={cx(inputBase, error ? inputError : inputNormal)}
				/>
			) : (
				<span className={readonlyField}>{value}</span>
			)}
		</Wrapper>
	);
}
