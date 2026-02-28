import { css } from '../generated/css';

export const lineError = css({ bg: 'errorLineBg' });

export const lineHoverVars = css({
	'--rm-color': 'currentColor',
	'--rm-fill': 'transparent',
	'--rm-x': 'currentColor',
	'--rm-opacity': '0.2',
	_hover: {
		'--rm-color': 'var(--colors-error)',
		'--rm-fill': 'var(--colors-error)',
		'--rm-x': 'white',
		'--rm-opacity': '1',
	},
});
