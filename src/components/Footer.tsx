import { css } from '@generated/css';

const GITHUB_URL = 'https://github.com/gjhilton/Summa';
const FUNERAL_GAMES_URL = 'http://funeralgames.co.uk';

const footer = css({ marginTop: '5xl' });

const smallText = css({
	fontSize: 's',
	marginTop: 'lg',
	fontStyle: 'italic',
});

export default function Footer() {
	return (
		<footer className={footer}>
			<div className={smallText}>
				Concept, design and <a href={GITHUB_URL}>code</a> copyright ©2025–2026
				g.j.hilton / <a href={FUNERAL_GAMES_URL}>funeral games</a>.
			</div>
		</footer>
	);
}
