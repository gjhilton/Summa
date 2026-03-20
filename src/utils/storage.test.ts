import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ItemType } from '@/types/calculation';
import {
	emptyLine,
	emptyExtendedItem,
	initialState,
} from '@/utils/calculationLogic';
import { serialiseLines } from '@/utils/serialisation';
import {
	STORAGE_KEY,
	WELCOME_KEY,
	loadFromStorage,
	saveToStorage,
	hasSeenWelcome,
	markWelcomeSeen,
} from '@/utils/storage';

// Minimal localStorage mock — avoids jsdom's null-origin SecurityError
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

// ─── loadFromStorage ──────────────────────────────────────────────────────────

describe('loadFromStorage — no stored data', () => {
	it('returns firstVisitLines (2 LINE_ITEMs with values) when no WELCOME_KEY and no STORAGE_KEY', () => {
		const result = loadFromStorage();
		expect(result).toHaveLength(2);
		result.forEach(line => {
			expect(line.itemType).toBe(ItemType.LINE_ITEM);
			expect(line.error).toBe(false);
		});
		// firstVisitLines has pre-filled d values (j=1d and ij=2d), not empty
		const total = result.reduce((sum, l) => sum + l.totalPence, 0);
		expect(total).toBe(3); // 1d + 2d = 3d
	});

	it('returns initialState lines (empty) when WELCOME_KEY is set but no STORAGE_KEY', () => {
		store.set(WELCOME_KEY, '1');
		const result = loadFromStorage();
		expect(result).toHaveLength(2);
		result.forEach(line => {
			expect(line.itemType).toBe(ItemType.LINE_ITEM);
			expect(line.totalPence).toBe(0);
		});
	});
});

describe('loadFromStorage — new format (plain array)', () => {
	it('deserialises a stored LINE_ITEM correctly', () => {
		const line = emptyLine();
		store.set(STORAGE_KEY, JSON.stringify(serialiseLines([line])));
		const result = loadFromStorage();
		expect(result).toHaveLength(1);
		expect(result[0].itemType).toBe(ItemType.LINE_ITEM);
		expect(result[0].id).toBe(line.id);
	});

	it('deserialises an EXTENDED_ITEM correctly', () => {
		const item = emptyExtendedItem();
		store.set(STORAGE_KEY, JSON.stringify(serialiseLines([item])));
		const result = loadFromStorage();
		expect(result).toHaveLength(1);
		expect(result[0].itemType).toBe(ItemType.EXTENDED_ITEM);
	});

	it('restores empty array when [] was stored', () => {
		store.set(STORAGE_KEY, JSON.stringify([]));
		const result = loadFromStorage();
		expect(result).toHaveLength(0);
	});

	it('preserves order across multiple lines', () => {
		const lines = [emptyLine(), emptyLine(), emptyExtendedItem()];
		store.set(STORAGE_KEY, JSON.stringify(serialiseLines(lines)));
		const result = loadFromStorage();
		expect(result.map(l => l.id)).toEqual(lines.map(l => l.id));
	});
});

describe('loadFromStorage — old format (object with .lines)', () => {
	it('extracts and deserialises the .lines array', () => {
		const line = emptyLine();
		const oldFormat = {
			lines: serialiseLines([line]),
			totalPence: 0,
			totalDisplay: { l: '0', s: '0', d: '0' },
			hasError: false,
		};
		store.set(STORAGE_KEY, JSON.stringify(oldFormat));
		const result = loadFromStorage();
		expect(result).toHaveLength(1);
		expect(result[0].id).toBe(line.id);
	});

	it('returns empty array when old format has no .lines property', () => {
		store.set(STORAGE_KEY, JSON.stringify({ totalPence: 0 }));
		// no .lines → rawLines = [] → deserialiseLines([]) = []
		const result = loadFromStorage();
		expect(result).toHaveLength(0);
	});
});

describe('loadFromStorage — corrupt data', () => {
	it('returns initial line count on invalid JSON', () => {
		store.set(STORAGE_KEY, 'not-json{{');
		const result = loadFromStorage();
		expect(result).toHaveLength(initialState().lines.length);
		expect(result[0].itemType).toBe(ItemType.LINE_ITEM);
	});

	it('returns initial line count when deserialise throws on unknown itemType', () => {
		const bad = [
			{
				id: 'x',
				itemType: 'BOGUS',
				title: '',
				literals: { l: '', s: '', d: '' },
			},
		];
		store.set(STORAGE_KEY, JSON.stringify(bad));
		const result = loadFromStorage();
		expect(result).toHaveLength(initialState().lines.length);
		expect(result[0].itemType).toBe(ItemType.LINE_ITEM);
	});
});

// ─── hasSeenWelcome / markWelcomeSeen ────────────────────────────────────────

describe('hasSeenWelcome', () => {
	it('returns false when neither key is set', () => {
		expect(hasSeenWelcome()).toBe(false);
	});

	it('returns true when WELCOME_KEY is set', () => {
		store.set(WELCOME_KEY, '1');
		expect(hasSeenWelcome()).toBe(true);
	});

	it('returns true when STORAGE_KEY is set (legacy: user has saved data)', () => {
		store.set(STORAGE_KEY, '[]');
		expect(hasSeenWelcome()).toBe(true);
	});

	it('returns true when both keys are set', () => {
		store.set(WELCOME_KEY, '1');
		store.set(STORAGE_KEY, '[]');
		expect(hasSeenWelcome()).toBe(true);
	});
});

describe('markWelcomeSeen', () => {
	it('sets WELCOME_KEY in localStorage', () => {
		expect(store.get(WELCOME_KEY)).toBeUndefined();
		markWelcomeSeen();
		expect(store.get(WELCOME_KEY)).toBe('1');
	});

	it('after markWelcomeSeen, hasSeenWelcome returns true', () => {
		markWelcomeSeen();
		expect(hasSeenWelcome()).toBe(true);
	});
});

// ─── saveToStorage ────────────────────────────────────────────────────────────

describe('saveToStorage', () => {
	it('writes serialised lines under the correct key', () => {
		const line = emptyLine();
		saveToStorage([line]);
		const raw = store.get(STORAGE_KEY);
		expect(raw).toBeDefined();
		const parsed = JSON.parse(raw!);
		expect(Array.isArray(parsed)).toBe(true);
		expect(parsed[0].id).toBe(line.id);
	});

	it('round-trips: save then load returns equivalent state', () => {
		const lines = [emptyLine(), emptyExtendedItem()];
		saveToStorage(lines);
		const restored = loadFromStorage();
		expect(restored).toHaveLength(2);
		expect(restored[0].id).toBe(lines[0].id);
		expect(restored[1].id).toBe(lines[1].id);
		expect(restored[0].itemType).toBe(ItemType.LINE_ITEM);
		expect(restored[1].itemType).toBe(ItemType.EXTENDED_ITEM);
	});

	it('overwrites previous save', () => {
		saveToStorage([emptyLine()]);
		const second = emptyLine();
		saveToStorage([second]);
		const restored = loadFromStorage();
		expect(restored).toHaveLength(1);
		expect(restored[0].id).toBe(second.id);
	});

	it('stores an empty array when given no lines', () => {
		saveToStorage([]);
		const restored = loadFromStorage();
		expect(restored).toHaveLength(0);
	});
});
