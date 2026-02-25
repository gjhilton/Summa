import { useState, useEffect } from 'react';
import { CalculationState } from '../types/calculation';
import {
	emptyLine,
	processFieldUpdate,
	withNewLines,
	initialState,
} from './calculationLogic';
import Calculation from '../components/Calculation';
import { FEATURES } from '../features';

const STORAGE_KEY = 'summa_calculation';

function loadState(): CalculationState {
	if (FEATURES.persistCalculation) {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) return JSON.parse(saved) as CalculationState;
		} catch {
			// ignore parse errors
		}
	}
	return initialState();
}

export default function CalculationData() {
	const [state, setState] = useState<CalculationState>(loadState);
	const [showWorking, setShowWorking] = useState(false);

	useEffect(() => {
		if (FEATURES.persistCalculation) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
		}
	}, [state]);

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
		if (FEATURES.persistCalculation) localStorage.removeItem(STORAGE_KEY);
		setState(initialState());
	}

	return (
		<Calculation
			lines={state.lines}
			totalDisplay={state.totalDisplay}
			showWorking={showWorking}
			onShowWorkingChange={setShowWorking}
			onUpdateField={updateField}
			onAddLine={addLine}
			onRemoveLine={removeLine}
			onReset={resetCalculation}
		/>
	);
}
