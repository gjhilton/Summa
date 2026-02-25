import { useState } from 'react';

const PREFERENCES_KEY = 'summa_preferences';

export interface Preferences {
	useItemWithQuantity: boolean;
}

const DEFAULTS: Preferences = {
	useItemWithQuantity: false,
};

function load(): Preferences {
	try {
		const saved = localStorage.getItem(PREFERENCES_KEY);
		if (saved) return { ...DEFAULTS, ...(JSON.parse(saved) as Partial<Preferences>) };
	} catch { /* ignore */ }
	return DEFAULTS;
}

export function usePreferences(): [Preferences, (update: Partial<Preferences>) => void] {
	const [prefs, setPrefs] = useState<Preferences>(load);

	function update(patch: Partial<Preferences>): void {
		const next = { ...prefs, ...patch };
		try { localStorage.setItem(PREFERENCES_KEY, JSON.stringify(next)); } catch { /* ignore */ }
		setPrefs(next);
	}

	return [prefs, update];
}
