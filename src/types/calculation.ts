export interface FieldLiterals {
	l: string;
	s: string;
	d: string;
}

export interface FieldStrings {
	l: string;
	s: string;
	d: string;
}

export interface FieldIntegers {
	l: number;
	s: number;
	d: number;
}

export interface LineState {
	id: string;
	error: boolean;
	literals: FieldLiterals;
	normalized: FieldStrings;
	integers: FieldIntegers;
	pence: FieldIntegers;
	totalPence: number;
	operation: '+';
}

export interface TotalDisplay {
	l: string;
	s: string;
	d: string;
}

export interface CalculationState {
	lines: LineState[];
	totalPence: number;
	totalDisplay: TotalDisplay;
	showRoman: boolean;
}
