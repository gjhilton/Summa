import { useState, useEffect } from 'react';
import { CalculationState } from '../types/calculation';
import {
	emptyLine,
	emptyItemWithQuantity,
	processFieldUpdate,
	processQuantityUpdate,
	withNewLines,
	initialState,
	computeLinePence,
} from './calculationLogic';
import Calculation from '../components/Calculation';
import { FEATURES } from '../features';

const STORAGE_KEY = 'summa_calculation';

function loadState(): CalculationState {
	if (FEATURES.persistCalculation) {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				const parsed = JSON.parse(saved) as CalculationState;
				const lines = parsed.lines.map(line => ({
					...line,
					fieldErrors: line.fieldErrors ?? { l: false, s: false, d: false },
				}));
				return { ...parsed, lines };
			}
		} catch {
			// ignore parse errors
		}
	}
	const state = initialState();
	const literals = { l: 'iiil', s: 'iiijs', d: 'vd' };
	const { totalPence, error, fieldErrors } = computeLinePence(literals);
	const lines = state.lines.map((line, i) =>
		i === 0 ? { ...line, literals, totalPence, error, fieldErrors } : line,
	);
	return withNewLines(state, lines);
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

	function updateQuantity(lineId: string, value: string): void {
		setState(prev => withNewLines(prev, processQuantityUpdate(prev.lines, lineId, value)));
	}

	function addLine(): void {
		setState(prev => withNewLines(prev, [...prev.lines, emptyLine()]));
	}

	function addItemWithQuantity(): void {
		setState(prev => withNewLines(prev, [...prev.lines, emptyItemWithQuantity()]));
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
			totalPence={state.totalPence}
			showWorking={showWorking}
			onShowWorkingChange={setShowWorking}
			onUpdateField={updateField}
			onUpdateQuantity={updateQuantity}
			onAddLine={addLine}
			onAddItemWithQuantity={addItemWithQuantity}
			onRemoveLine={removeLine}
			onReset={resetCalculation}
		/>
	);
}
