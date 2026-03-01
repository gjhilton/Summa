import { useState, useEffect } from 'react';
import { CalculationState, AnyLineState } from '../types/calculation';
import {
	emptyLine,
	emptyExtendedItem,
	emptySubtotalItem,
	processFieldUpdate,
	processQuantityUpdate,
	withNewLines,
	initialState,
	computeLinePence,
	computeGrandTotal,
	getLinesAtPath,
	updateLinesAtPath,
	updateTitle,
	getBreadcrumbs,
	IdPath,
} from './calculationLogic';
import {
	serializeLines,
	deserializeLines,
	createSummaFile,
	parseSummaFile,
} from './serialization';
import { SavedAnyLine } from '../types/savedCalculation';
import { arrayMove } from '@dnd-kit/sortable';
import Calculation from '../components/Calculation';
import CalculationHeader from '../components/CalculationHeader';
import SaveModal from '../components/SaveModal';
import LoadModal from '../components/LoadModal';
import { FEATURES } from '../features';

const STORAGE_KEY = 'summa_calculation';

function loadState(): CalculationState {
	if (FEATURES.persistCalculation) {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				const parsed = JSON.parse(saved) as unknown;
				// Handle both old format (full state object) and new format (lines array)
				const rawLines: unknown[] = Array.isArray(parsed)
					? parsed
					: ((parsed as { lines?: unknown[] }).lines ?? []);
				const lines = deserializeLines(rawLines as SavedAnyLine[]);
				const { totalPence, totalDisplay, hasError } =
					computeGrandTotal(lines);
				return { lines, totalPence, totalDisplay, hasError };
			}
		} catch {
			// ignore parse errors
		}
	}
	const state = initialState();
	const literals = { l: 'ij', s: 'x', d: 'v' };
	const { totalPence, error, fieldErrors } = computeLinePence(literals);
	const lines = state.lines.map((line, i) =>
		i === 0 ? { ...line, literals, totalPence, error, fieldErrors } : line
	);
	return withNewLines(state, lines);
}

export default function CalculationData({
	useExtendedItem,
	onUseExtendedItemChange,
}: {
	useExtendedItem: boolean;
	onUseExtendedItemChange: (v: boolean) => void;
}) {
	const [state, setState] = useState<CalculationState>(loadState);
	const [showWorking, setShowWorking] = useState(false);
	const [navigationPath, setNavigationPath] = useState<IdPath>([]);
	const [showSaveModal, setShowSaveModal] = useState(false);
	const [showLoadModal, setShowLoadModal] = useState(false);
	const [lastSaveFilename, setLastSaveFilename] = useState('');

	const isSubLevel = navigationPath.length > 0;
	const currentLines = getLinesAtPath(state.lines, navigationPath);
	const { totalPence, totalDisplay } = computeGrandTotal(currentLines);
	const breadcrumbs = isSubLevel
		? getBreadcrumbs(state.lines, navigationPath)
		: [];

	useEffect(() => {
		if (FEATURES.persistCalculation) {
			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify(serializeLines(state.lines))
			);
		}
	}, [state]);

	function mutate(updater: (lines: AnyLineState[]) => AnyLineState[]): void {
		setState(prev =>
			withNewLines(
				prev,
				updateLinesAtPath(prev.lines, navigationPath, updater)
			)
		);
	}

	function updateField(
		lineId: string,
		field: 'l' | 's' | 'd',
		value: string
	): void {
		mutate(lines => processFieldUpdate(lines, lineId, field, value));
	}

	function updateQuantity(lineId: string, value: string): void {
		mutate(lines => processQuantityUpdate(lines, lineId, value));
	}

	function updateLineTitle(lineId: string, value: string): void {
		mutate(lines => updateTitle(lines, lineId, value));
	}

	function addLine(): void {
		mutate(lines => [...lines, emptyLine()]);
	}

	function addExtendedItem(): void {
		mutate(lines => [...lines, emptyExtendedItem()]);
	}

	function addSubtotalItem(): void {
		mutate(lines => [...lines, emptySubtotalItem()]);
	}

	function reorderLines(oldIndex: number, newIndex: number): void {
		mutate(lines => arrayMove(lines, oldIndex, newIndex));
	}

	function removeLine(lineId: string): void {
		if (currentLines.length <= 2) return;
		mutate(lines => lines.filter(l => l.id !== lineId));
	}

	function resetCalculation(): void {
		if (navigationPath.length === 0) {
			if (FEATURES.persistCalculation)
				localStorage.removeItem(STORAGE_KEY);
			setState(initialState());
			setLastSaveFilename('');
		} else {
			mutate(() => [emptyLine(), emptyLine()]);
		}
	}

	function navigateInto(id: string): void {
		setNavigationPath([...navigationPath, id]);
	}

	function navigateTo(path: IdPath): void {
		setNavigationPath(path);
	}

	function updateCurrentSubtotalTitle(value: string): void {
		if (!isSubLevel) return;
		const parentPath = navigationPath.slice(0, -1);
		const targetId = navigationPath[navigationPath.length - 1];
		setState(prev =>
			withNewLines(
				prev,
				updateLinesAtPath(prev.lines, parentPath, lines =>
					updateTitle(lines, targetId, value)
				)
			)
		);
	}

	function handleSave(filename: string): void {
		const file = createSummaFile(state);
		const json = JSON.stringify(file, null, 2);
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${filename}.summa.json`;
		a.click();
		URL.revokeObjectURL(url);
		setLastSaveFilename(filename);
	}

	async function handleLoad(file: File): Promise<void> {
		const text = await file.text();
		const newState = parseSummaFile(text);
		setState(newState);
		setNavigationPath([]);
		setLastSaveFilename('');
	}

	return (
		<>
			<CalculationHeader
				breadcrumbs={breadcrumbs}
				onNavigate={navigateTo}
				onClear={
					isSubLevel
						? () =>
								window.confirm(
									`Erase ${currentLines.length} items?`
								) && resetCalculation()
						: () =>
								window.confirm('Clear all?') &&
								resetCalculation()
				}
				onDone={
					isSubLevel
						? () => navigateTo(navigationPath.slice(0, -1))
						: undefined
				}
				title={
					isSubLevel
						? (breadcrumbs[breadcrumbs.length - 1]?.title ?? '')
						: undefined
				}
				onTitleChange={
					isSubLevel ? updateCurrentSubtotalTitle : undefined
				}
				onLoad={!isSubLevel ? () => setShowLoadModal(true) : undefined}
				onSave={!isSubLevel ? () => setShowSaveModal(true) : undefined}
				canSave={!state.hasError}
			/>
			<Calculation
				lines={currentLines}
				totalDisplay={totalDisplay}
				totalPence={totalPence}
				showWorking={showWorking}
				onShowWorkingChange={setShowWorking}
				onUpdateField={updateField}
				onUpdateQuantity={updateQuantity}
				onUpdateTitle={updateLineTitle}
				onAddLine={addLine}
				onAddExtendedItem={addExtendedItem}
				onAddSubtotalItem={addSubtotalItem}
				onRemoveLine={removeLine}
				onReorderLines={reorderLines}
				useExtendedItem={useExtendedItem}
				onUseExtendedItemChange={onUseExtendedItemChange}
				onEditSubtotalItem={navigateInto}
				advancedOptionsDisabled={isSubLevel}
				isSubLevel={isSubLevel}
			/>
			<SaveModal
				isOpen={showSaveModal}
				onClose={() => setShowSaveModal(false)}
				defaultFilename={lastSaveFilename}
				onSave={handleSave}
			/>
			<LoadModal
				isOpen={showLoadModal}
				onClose={() => setShowLoadModal(false)}
				onLoad={handleLoad}
			/>
		</>
	);
}
