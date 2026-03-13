import type { AnyLineState } from '@/types/calculation';
import type { SavedAnyLine } from '@/types/savedCalculation';
import { initialState } from '@/utils/calculationLogic';
import { serializeLines, deserializeLines } from '@/utils/serialization';

export const STORAGE_KEY = 'summa_calculation';

export function loadFromStorage(): AnyLineState[] {
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (!saved) return initialState().lines;
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
