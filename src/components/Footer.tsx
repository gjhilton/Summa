import { css } from '../generated/css';

const GITHUB_URL = 'https://github.com/gjhilton/Summa';
const FUNERAL_GAMES_URL = 'http://funeralgames.co.uk';

const footer = css({
	marginTop: 'xl',
	display: 'flex',
	alignItems: 'baseline',
	justifyContent: 'space-between',
	gap: 'sm',
});

const smallText = css({
	fontSize: 's',
	fontStyle: 'italic',
});

const helpLink = css({
	fontSize: 's',
	cursor: 'pointer',
	textDecoration: 'underline',
	color: 'ink',
	background: 'none',
	borderWidth: '0',
	fontFamily: 'inherit',
	fontStyle: 'italic',
	padding: '0',
	flexShrink: '0',
	_hover: { opacity: '0.6' },
});

export default function Footer({ onHelp }: { onHelp?: () => void }) {
	return (
		<footer className={footer}>
			<div className={smallText}>
				Summa v{__APP_VERSION__}. Concept, design and{' '}
				<a href={GITHUB_URL} title="Summa on GitHub">
					code
				</a>{' '}
				copyright ©2026 g.j.hilton /{' '}
				<a href={FUNERAL_GAMES_URL} title="Funeral Games">
					funeral games
				</a>
				.
			</div>
			{onHelp && (
				<button type="button" className={helpLink} onClick={onHelp}>
					Help
				</button>
			)}
		</footer>
	);
}
