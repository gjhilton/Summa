import { useState } from 'react';
import MainScreen from './components/MainScreen';
import AboutScreen from './components/AboutScreen';

export default function App() {
	const [screen, setScreen] = useState<'main' | 'about'>('main');

	if (screen === 'about') {
		return <AboutScreen onClose={() => setScreen('main')} />;
	}

	return <MainScreen onAbout={() => setScreen('about')} />;
}
