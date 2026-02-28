import { css } from '../generated/css';

const symbol = css({
	display: 'inline-block',
	position: 'relative',
	width: '0.5em',
	height: '0.5em',
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

export default function EqualsSymbol() {
	return <span className={symbol} aria-hidden="true" />;
}
