import { useState, useEffect } from 'react';
import MainScreen from './components/MainScreen';
import AboutScreen from './components/AboutScreen';
import UnsupportedScreen from './components/UnsupportedScreen';

const PORTRAIT_MOBILE = '(max-width: 600px) and (orientation: portrait)';

function useIsPortraitMobile() {
	const [matches, setMatches] = useState(() => window.matchMedia(PORTRAIT_MOBILE).matches);
	useEffect(() => {
		const mq = window.matchMedia(PORTRAIT_MOBILE);
		const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
		mq.addEventListener('change', handler);
		return () => mq.removeEventListener('change', handler);
	}, []);
	return matches;
}

export default function App() {
	const [screen, setScreen] = useState<'main' | 'about'>('main');
	const isPortraitMobile = useIsPortraitMobile();

	if (isPortraitMobile) return <UnsupportedScreen />;

	if (screen === 'about') {
		return <AboutScreen onClose={() => setScreen('main')} />;
	}

	return <MainScreen onAbout={() => setScreen('about')} />;
}
