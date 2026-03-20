import { useState } from 'react';

const PREFERENCES_KEY = 'summa_preferences';

export interface Preferences {
	useExtendedItem: boolean;
}

const DEFAULTS: Preferences = {
	useExtendedItem: false,
};

function load(): Preferences {
	try {
		const saved = localStorage.getItem(PREFERENCES_KEY);
		if (saved)
			return {
				...DEFAULTS,
				...(JSON.parse(saved) as Partial<Preferences>),
			};
	} catch {
		/* ignore */
	}
	return DEFAULTS;
}

function savePreferences(prefs: Preferences): void {
	try {
		localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
	} catch {
		/* ignore */
	}
}

export function usePreferences(): [
	Preferences,
	(patch: Partial<Preferences>) => void,
] {
	const [prefs, setPrefs] = useState<Preferences>(load);

	function update(patch: Partial<Preferences>): void {
		setPrefs(prev => {
			const next = { ...prev, ...patch };
			savePreferences(next);
			return next;
		});
	}

	return [prefs, update];
}
