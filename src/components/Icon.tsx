import { css } from '@generated/css';

const PATHS = {
	cross: 'M6 6l12 12M18 6L6 18',
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
