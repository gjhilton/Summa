import { css } from '../generated/css';

const wrapper = css({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	minHeight: '100dvh',
	padding: '3xl',
	textAlign: 'center',
	gap: '2xl',
});

const message = css({
	fontSize: 'm',
	lineHeight: '1.6',
	maxWidth: '280px',
});

export default function UnsupportedScreen() {
	return (
		<div className={wrapper}>
			<p className={message}>
				Please rotate your device to landscape or use a larger screen.
			</p>
		</div>
	);
}
