import { css } from '../generated/css';

export const SIZE = { S: '150px', M: '300px', L: '500px' } as const;

interface LogoProps {
	size?: keyof typeof SIZE | string;
}

const wrapper = css({ display: 'inline-block' });

export default function Logo({ size = 'M' }: LogoProps) {
	const maxWidth = (SIZE as Record<string, string>)[size] ?? size;
	return (
		<div className={wrapper}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 300 80"
				style={{ maxWidth, width: '100%', height: 'auto' }}
				aria-label="Summa"
			>
				<text
					x="50%"
					y="72%"
					textAnchor="middle"
					fontFamily="Joscelyn, serif"
					fontSize="64"
					fill="currentColor"
				>
					Summa
				</text>
			</svg>
		</div>
	);
}
