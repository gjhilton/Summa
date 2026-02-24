export type LsdStrings = { l: string; s: string; d: string };

export interface LineState {
	id: string;
	error: boolean;
	literals: LsdStrings;
	totalPence: number;
}

export interface CalculationState {
	lines: LineState[];
	totalPence: number;
	totalDisplay: LsdStrings;
}
