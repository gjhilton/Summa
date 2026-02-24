import { useState } from 'react';
import { CalculationState } from '../types/calculation';
import {
	emptyLine,
	processFieldUpdate,
	computeGrandTotal,
	initialState,
} from './calculationLogic';
import Calculation from '../components/Calculation';

export default function CalculationData() {
	const [state, setState] = useState<CalculationState>(initialState);

	function updateField(
		lineId: string,
		field: 'l' | 's' | 'd',
		value: string,
	): void {
		setState(prev => {
			const lines = processFieldUpdate(prev.lines, lineId, field, value);
			const { totalPence, totalDisplay } = computeGrandTotal(lines);
			return { ...prev, lines, totalPence, totalDisplay };
		});
	}

	function addLine(): void {
		setState(prev => {
			const lines = [...prev.lines, emptyLine()];
			const { totalPence, totalDisplay } = computeGrandTotal(lines);
			return { ...prev, lines, totalPence, totalDisplay };
		});
	}

	function removeLine(lineId: string): void {
		setState(prev => {
			// Always keep at least 2 lines
			if (prev.lines.length <= 2) return prev;
			const lines = prev.lines.filter(l => l.id !== lineId);
			const { totalPence, totalDisplay } = computeGrandTotal(lines);
			return { ...prev, lines, totalPence, totalDisplay };
		});
	}

	function resetCalculation(): void {
		setState(initialState());
	}

	return (
		<Calculation
			lines={state.lines}
			totalDisplay={state.totalDisplay}
			onUpdateField={updateField}
			onAddLine={addLine}
			onRemoveLine={removeLine}
			onReset={resetCalculation}
		/>
	);
}
