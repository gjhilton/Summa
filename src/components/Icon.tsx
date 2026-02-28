import { css } from '../generated/css';

const PATHS = {
	cross: 'M6 6l12 12M18 6L6 18',
	trash: 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
	reset: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
	pencil: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
} as const;

type PathIcon = keyof typeof PATHS;
export type IconType = PathIcon | 'circle-x' | 'grip';

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
	if (icon === 'grip') {
		return (
			<svg
				width={size}
				height={size}
				viewBox="0 0 24 24"
				style={{ display: 'inline-block', verticalAlign: 'middle' }}
			>
				{([4.5, 12, 19.5] as const).map(y =>
					([8, 16] as const).map(x => (
						<circle
							key={`${x}-${y}`}
							cx={x}
							cy={y}
							r={1.5}
							fill="currentColor"
						/>
					))
				)}
			</svg>
		);
	}
	if (icon === 'circle-x') {
		return (
			<svg
				style={{ display: 'inline-block', verticalAlign: 'middle' }}
				width={size}
				height={size}
				viewBox="0 0 24 24"
			>
				<circle
					cx="12"
					cy="12"
					r="9"
					style={{ fill: 'var(--rm-fill)' }}
				/>
				<path
					d="M8 8l8 8M16 8l-8 8"
					style={{
						fill: 'none',
						stroke: 'var(--rm-x)',
						strokeLinecap: 'round',
					}}
					strokeWidth={strokeWidth}
				/>
			</svg>
		);
	}
	return (
		<svg
			className={iconStyle}
			width={size}
			height={size}
			viewBox="0 0 24 24"
		>
			<path
				d={PATHS[icon]}
				stroke="currentColor"
				strokeWidth={strokeWidth}
			/>
		</svg>
	);
}
