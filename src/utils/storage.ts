import type { AnyLineState } from '@/types/calculation';
import type { SavedAnyLine } from '@/types/savedCalculation';
import { initialState, firstVisitLines } from '@/utils/calculationLogic';
import { serialiseLines, deserialiseLines } from '@/utils/serialisation';

export const STORAGE_KEY = 'summa_calculation';
export const WELCOME_KEY = 'summa_welcomed';

export function hasSeenWelcome(): boolean {
	return !!(
		localStorage.getItem(WELCOME_KEY) || localStorage.getItem(STORAGE_KEY)
	);
}

export function markWelcomeSeen(): void {
	localStorage.setItem(WELCOME_KEY, '1');
}

/** Lines to show when there is nothing in storage yet. */
function defaultLines(): AnyLineState[] {
	return localStorage.getItem(WELCOME_KEY)
		? initialState().lines
		: firstVisitLines();
}

/** Extract the raw lines array from either the new (array) or old (object) storage format. */
function extractRawLines(parsed: unknown): SavedAnyLine[] {
	if (Array.isArray(parsed)) return parsed as SavedAnyLine[];
	return ((parsed as { lines?: unknown[] }).lines ?? []) as SavedAnyLine[];
}

export function loadFromStorage(): AnyLineState[] {
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (!saved) return defaultLines();
		return deserialiseLines(extractRawLines(JSON.parse(saved) as unknown));
	} catch {
		return initialState().lines;
	}
}

export function saveToStorage(lines: AnyLineState[]): void {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(serialiseLines(lines)));
}
