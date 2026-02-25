export type LsdStrings = { l: string; s: string; d: string };

export type LsdBooleans = { l: boolean; s: boolean; d: boolean };

export interface LineState {
	id: string;
	error: boolean;
	fieldErrors: LsdBooleans;
	literals: LsdStrings;
	totalPence: number;
}

export interface CalculationState {
	lines: LineState[];
	totalPence: number;
	totalDisplay: LsdStrings;
}
