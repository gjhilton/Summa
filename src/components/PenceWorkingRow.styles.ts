import { css } from '../generated/css';

const workingRowStyles = {
	display: 'block',
	width: '100%',
	minHeight: '1.5em',
	fontSize: 's',
	color: 'ink',
	textAlign: 'right',
} as const;

export const workingRowNowrap = css({
	...workingRowStyles,
	whiteSpace: 'nowrap',
});
