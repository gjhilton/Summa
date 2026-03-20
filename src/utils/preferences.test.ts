import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePreferences } from '@/utils/preferences';

const PREFERENCES_KEY = 'summa_preferences';

// Minimal localStorage mock
const store = new Map<string, string>();
vi.stubGlobal('localStorage', {
	getItem: (key: string) => store.get(key) ?? null,
	setItem: (key: string, value: string) => {
		store.set(key, value);
	},
	removeItem: (key: string) => {
		store.delete(key);
	},
	clear: () => {
		store.clear();
	},
});

beforeEach(() => {
	store.clear();
});

// ─── usePreferences ───────────────────────────────────────────────────────────

describe('usePreferences — initial state', () => {
	it('returns defaults when nothing is stored', () => {
		const { result } = renderHook(() => usePreferences());
		const [prefs] = result.current;
		expect(prefs.useExtendedItem).toBe(false);
	});

	it('returns stored preferences when present', () => {
		store.set(PREFERENCES_KEY, JSON.stringify({ useExtendedItem: true }));
		const { result } = renderHook(() => usePreferences());
		const [prefs] = result.current;
		expect(prefs.useExtendedItem).toBe(true);
	});

	it('merges stored preferences with defaults (partial stored object)', () => {
		// Store an object missing the key — defaults should fill in
		store.set(PREFERENCES_KEY, JSON.stringify({}));
		const { result } = renderHook(() => usePreferences());
		const [prefs] = result.current;
		expect(prefs.useExtendedItem).toBe(false);
	});

	it('falls back to defaults on invalid JSON', () => {
		store.set(PREFERENCES_KEY, 'not-valid-json{{{');
		const { result } = renderHook(() => usePreferences());
		const [prefs] = result.current;
		expect(prefs.useExtendedItem).toBe(false);
	});
});

describe('usePreferences — update', () => {
	it('updates a preference and persists it to localStorage', () => {
		const { result } = renderHook(() => usePreferences());

		act(() => {
			const [, update] = result.current;
			update({ useExtendedItem: true });
		});

		const [prefs] = result.current;
		expect(prefs.useExtendedItem).toBe(true);

		// Also verify it was written to storage
		const stored = store.get(PREFERENCES_KEY);
		expect(stored).toBeDefined();
		const parsed = JSON.parse(stored!) as { useExtendedItem: boolean };
		expect(parsed.useExtendedItem).toBe(true);
	});

	it('can toggle back to false', () => {
		store.set(PREFERENCES_KEY, JSON.stringify({ useExtendedItem: true }));
		const { result } = renderHook(() => usePreferences());

		act(() => {
			const [, update] = result.current;
			update({ useExtendedItem: false });
		});

		const [prefs] = result.current;
		expect(prefs.useExtendedItem).toBe(false);
	});

	it('partial update preserves other preference keys', () => {
		const { result } = renderHook(() => usePreferences());

		act(() => {
			const [, update] = result.current;
			// Update with an empty patch — should not change anything
			update({});
		});

		const [prefs] = result.current;
		expect(prefs.useExtendedItem).toBe(false);
	});

	it('survives localStorage.setItem throwing (silently ignores storage failure)', () => {
		// Temporarily make setItem throw to exercise the catch block in savePreferences
		const originalSetItem = localStorage.setItem.bind(localStorage);
		vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
			throw new Error('Storage quota exceeded');
		});

		const { result } = renderHook(() => usePreferences());

		// Should not throw; state should still update even if storage fails
		act(() => {
			const [, update] = result.current;
			update({ useExtendedItem: true });
		});

		const [prefs] = result.current;
		expect(prefs.useExtendedItem).toBe(true);

		vi.mocked(localStorage.setItem).mockRestore?.();
		// Restore manually if mockRestore doesn't work
		localStorage.setItem = originalSetItem;
	});
});
