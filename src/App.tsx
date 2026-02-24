import { useState } from 'react';
import { css } from '@generated/css';
import CalculationData from './state/CalculationData';
import Logo from './components/Logo';
import Footer from './components/Footer';
import Toggle from './components/Toggle';
import AboutScreen from './components/AboutScreen';

const page = css({
	maxWidth: '90%',
	marginLeft: 'auto',
	marginRight: 'auto',
	paddingTop: '3xl',
	paddingBottom: '3xl',
	desktop: { maxWidth: '800px' },
});

const header = css({
	display: 'flex',
	alignItems: 'flex-end',
	justifyContent: 'space-between',
	marginBottom: '3xl',
});

const aboutLink = css({
	fontSize: 's',
	cursor: 'pointer',
	textDecoration: 'underline',
	color: 'ink',
	background: 'none',
	border: 'none',
	fontFamily: 'inherit',
	padding: 0,
	_hover: { opacity: 0.6 },
});

const toolbar = css({ marginTop: 'lg' });

export default function App() {
	const [screen, setScreen] = useState<'main' | 'about'>('main');
	const [showWorking, setShowWorking] = useState(false);

	if (screen === 'about') {
		return <AboutScreen onClose={() => setScreen('main')} />;
	}

	return (
		<div className={page}>
			<header className={header}>
				<Logo size="S" />
				<button className={aboutLink} onClick={() => setScreen('about')}>
					About
				</button>
			</header>
			<CalculationData showWorking={showWorking} />
			<div className={toolbar}>
				<Toggle
					id="show-working"
					label="Show working"
					checked={showWorking}
					onChange={setShowWorking}
				/>
			</div>
			<Footer />
		</div>
	);
}
