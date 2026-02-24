import { css } from '../generated/css';

const PATHS = {
	cross: 'M6 6l12 12M18 6L6 18',
	reset: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
} as const;

export type IconType = keyof typeof PATHS;

interface IconProps {
	icon: IconType;
	size?: number;
	strokeWidth?: number;
}

const iconStyle = css({
	display: 'inline-block',
	fill: 'none',
	strokeLinecap: 'round',
	strokeMiterlimit: '10',
	verticalAlign: 'middle',
});

export default function Icon({ icon, size = 20, strokeWidth = 2 }: IconProps) {
	return (
		<svg className={iconStyle} width={size} height={size} viewBox="0 0 24 24">
			<path d={PATHS[icon]} stroke="currentColor" strokeWidth={strokeWidth} />
		</svg>
	);
}
