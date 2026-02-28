import { css, cx } from '../generated/css';

const base = css({
	display: 'inline-block',
	position: 'relative',
	width: '0.5em',
	height: '0.5em',
});

const multiplyStyle = css({
	transform: 'rotate(45deg) scale(0.5)',
	_before: {
		content: '""',
		position: 'absolute',
		width: '2px',
		height: '100%',
		left: '50%',
		top: '0',
		transform: 'translateX(-50%)',
		bg: 'currentColor',
	},
	_after: {
		content: '""',
		position: 'absolute',
		height: '2px',
		width: '100%',
		top: '50%',
		left: '0',
		transform: 'translateY(-50%)',
		bg: 'currentColor',
	},
});

const equalsStyle = css({
	transform: 'scale(0.5)',
	_before: {
		content: '""',
		position: 'absolute',
		height: '2px',
		width: '100%',
		top: '33%',
		left: '0',
		bg: 'currentColor',
	},
	_after: {
		content: '""',
		position: 'absolute',
		height: '2px',
		width: '100%',
		top: '67%',
		left: '0',
		bg: 'currentColor',
	},
});

export default function OperatorSymbol({
	type,
}: {
	type: 'multiply' | 'equals';
}) {
	return (
		<span
			className={cx(
				base,
				type === 'multiply' ? multiplyStyle : equalsStyle
			)}
			aria-hidden="true"
		/>
	);
}
