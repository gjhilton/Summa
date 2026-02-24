import { useState } from 'react';
import { CalculationState } from '../types/calculation';
import {
	emptyLine,
	processFieldUpdate,
	withNewLines,
	initialState,
} from './calculationLogic';
import Calculation from '../components/Calculation';

interface CalculationDataProps {
	showWorking: boolean;
}

export default function CalculationData({ showWorking }: CalculationDataProps) {
	const [state, setState] = useState<CalculationState>(initialState);

	function updateField(lineId: string, field: 'l' | 's' | 'd', value: string): void {
		setState(prev => withNewLines(prev, processFieldUpdate(prev.lines, lineId, field, value)));
	}

	function addLine(): void {
		setState(prev => withNewLines(prev, [...prev.lines, emptyLine()]));
	}

	function removeLine(lineId: string): void {
		setState(prev => {
			if (prev.lines.length <= 2) return prev;
			return withNewLines(prev, prev.lines.filter(l => l.id !== lineId));
		});
	}

	function resetCalculation(): void {
		setState(initialState());
	}

	return (
		<Calculation
			lines={state.lines}
			totalDisplay={state.totalDisplay}
			showWorking={showWorking}
			onUpdateField={updateField}
			onAddLine={addLine}
			onRemoveLine={removeLine}
			onReset={resetCalculation}
		/>
	);
}
