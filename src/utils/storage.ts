import type { AnyLineState } from '@/types/calculation';
import type { SavedAnyLine } from '@/types/savedCalculation';
import { initialState, firstVisitLines } from '@/utils/calculationLogic';
import { serializeLines, deserializeLines } from '@/utils/serialization';

export const STORAGE_KEY = 'summa_calculation'
export const WELCOME_KEY = 'summa_welcomed'

export function hasSeenWelcome(): boolean {
  return !!(localStorage.getItem(WELCOME_KEY) || localStorage.getItem(STORAGE_KEY))
}

export function markWelcomeSeen(): void {
  localStorage.setItem(WELCOME_KEY, '1')
}

export function loadFromStorage(): AnyLineState[] {
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (!saved) return firstVisitLines();
		const parsed = JSON.parse(saved) as unknown;
		const rawLines = Array.isArray(parsed)
			? parsed
			: ((parsed as { lines?: unknown[] }).lines ?? []);
		return deserializeLines(rawLines as SavedAnyLine[]);
	} catch {
		return initialState().lines;
	}
}

export function saveToStorage(lines: AnyLineState[]): void {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeLines(lines)));
}
