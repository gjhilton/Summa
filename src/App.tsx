import { useState } from 'react';
import MainScreen from './components/MainScreen';
import AboutScreen from './components/AboutScreen';
import { usePreferences } from './state/preferences';

const VISITED_KEY = 'summa_visited';

export default function App() {
	const [isFirstVisit, setIsFirstVisit] = useState(() => {
		try {
			return !localStorage.getItem(VISITED_KEY);
		} catch {
			return false;
		}
	});
	const [screen, setScreen] = useState<'main' | 'about'>(() =>
		isFirstVisit ? 'about' : 'main'
	);
	const [prefs, updatePrefs] = usePreferences();

	function handleGetStarted() {
		try {
			localStorage.setItem(VISITED_KEY, '1');
		} catch {
			/* ignore */
		}
		setIsFirstVisit(false);
		setScreen('main');
	}

	if (screen === 'about') {
		return (
			<AboutScreen
				onClose={() => setScreen('main')}
				isFirstVisit={isFirstVisit}
				onGetStarted={handleGetStarted}
			/>
		);
	}

	return (
		<MainScreen
			onAbout={() => setScreen('about')}
			useExtendedItem={prefs.useExtendedItem}
			onUseExtendedItemChange={v => updatePrefs({ useExtendedItem: v })}
		/>
	);
}
