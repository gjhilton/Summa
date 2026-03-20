import { useState, useEffect, useRef, useCallback } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import type { DragEndEvent } from '@dnd-kit/core';
import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Renderer } from '@/display/Renderer';
import { HelpScreen } from '@/display/HelpScreen';
import { SplashScreen } from '@/display/SplashScreen';
import type { AnyLineState } from '@/types/calculation';
import { isSubtotalItem } from '@/types/calculation';
import {
	processFieldUpdate,
	processQuantityUpdate,
	updateTitle,
	emptyLine,
	emptyExtendedItem,
	emptySubtotalItem,
	initialState,
	computeGrandTotal,
	clearItem,
	duplicateLine,
	getLinesAtPath,
	getBreadcrumbs,
	updateLinesAtPath,
} from '@/utils/calculationLogic';
import type { IdPath } from '@/utils/calculationLogic';
import { createSummaFile, parseSummaFile } from '@/utils/serialisation';
import {
	loadFromStorage,
	saveToStorage,
	hasSeenWelcome,
	markWelcomeSeen,
} from '@/utils/storage';

type Screen = 'welcome' | 'main' | 'help';

const MAX_UNDO = 25;

interface UndoStack {
	push: (snapshot: AnyLineState[], coalesceKey?: string) => void;
	pop: (setLines: (lines: AnyLineState[]) => void) => void;
	reset: () => void;
	canUndo: boolean;
	clearCoalesceKey: () => void;
}

function useUndoStack(pathKey: string): UndoStack {
	const [undoStacks, setUndoStacks] = useState<
		Record<string, AnyLineState[][]>
	>({});
	const lastCoalesceKeyRef = useRef<string | null>(null);

	function push(snapshot: AnyLineState[], coalesceKey?: string) {
		if (coalesceKey && coalesceKey === lastCoalesceKeyRef.current) return;
		lastCoalesceKeyRef.current = coalesceKey ?? null;
		setUndoStacks(stacks => {
			const existing = stacks[pathKey] ?? [];
			const trimmed =
				existing.length >= MAX_UNDO ? existing.slice(1) : existing;
			return { ...stacks, [pathKey]: [...trimmed, snapshot] };
		});
	}

	const pop = useCallback(
		(setLines: (lines: AnyLineState[]) => void) => {
			lastCoalesceKeyRef.current = null;
			setUndoStacks(stacks => {
				const stack = stacks[pathKey] ?? [];
				if (stack.length === 0) return stacks;
				setLines(stack[stack.length - 1]);
				return { ...stacks, [pathKey]: stack.slice(0, -1) };
			});
		},
		[pathKey]
	);

	function reset() {
		lastCoalesceKeyRef.current = null;
		setUndoStacks({});
	}
	function clearCoalesceKey() {
		lastCoalesceKeyRef.current = null;
	}

	const canUndo = (undoStacks[pathKey]?.length ?? 0) > 0;
	return { push, pop, reset, canUndo, clearCoalesceKey };
}

/**
 * Return the raw title of the subtotal at the leaf of navigationPath,
 * or undefined at root level. Uses raw state (not breadcrumb display) so
 * the edit field doesn't ghost-write 'Untitled' for untitled sub-calcs.
 */
function deriveSubTitle(
	lines: AnyLineState[],
	navigationPath: IdPath
): string | undefined {
	if (navigationPath.length === 0) return undefined;
	const id = navigationPath[navigationPath.length - 1];
	const item = getLinesAtPath(lines, navigationPath.slice(0, -1)).find(
		l => l.id === id
	);
	return item && isSubtotalItem(item) ? item.title : '';
}

function triggerJsonDownload(filename: string, data: unknown): void {
	const json = JSON.stringify(data, null, 2);
	const blob = new Blob([json], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

export default function App() {
	const [screen, setScreen] = useState<Screen>(() =>
		hasSeenWelcome() ? 'main' : 'welcome'
	);
	const [lines, setLines] = useState<AnyLineState[]>(() => loadFromStorage());
	const [navigationPath, setNavigationPath] = useState<IdPath>([]);
	const [showExplanation, setShowExplanation] = useState(false);
	const [advancedMode, setAdvancedMode] = useState(false);

	// DnD sensors
	const sensors = useSensors(useSensor(PointerSensor));

	// Swipe open state
	const [swipeOpenId, setSwipeOpenId] = useState<string | null>(null);

	// Save modal state
	const [saveOpen, setSaveOpen] = useState(false);
	const [saveFilename, setSaveFilename] = useState('');
	const saveDialogRef = useRef<HTMLDialogElement>(null);

	// Load modal state
	const [loadOpen, setLoadOpen] = useState(false);
	const [loadError, setLoadError] = useState('');
	const [loadLoading, setLoadLoading] = useState(false);
	const [loadHasFile, setLoadHasFile] = useState(false);
	const loadInputRef = useRef<HTMLInputElement>(null);
	const loadDialogRef = useRef<HTMLDialogElement>(null);

	// Sync native dialog open/close with state
	useEffect(() => {
		const el = saveDialogRef.current;
		if (!el) return;
		if (saveOpen) {
			if (!el.open) el.showModal();
		} else {
			if (el.open) el.close();
		}
	}, [saveOpen]);

	useEffect(() => {
		const el = loadDialogRef.current;
		if (!el) return;
		if (loadOpen) {
			if (!el.open) el.showModal();
		} else {
			if (el.open) el.close();
		}
	}, [loadOpen]);

	// Reset load modal state when it opens
	useEffect(() => {
		if (!loadOpen) return;
		if (loadInputRef.current) loadInputRef.current.value = '';
		setLoadError('');
		setLoadHasFile(false);
	}, [loadOpen]);

	useEffect(() => {
		saveToStorage(lines);
	}, [lines]);

	const pathKey = navigationPath.join('/');
	const undo = useUndoStack(pathKey);

	const visibleLines = getLinesAtPath(lines, navigationPath);
	const { totalPence, totalDisplay, hasError } =
		computeGrandTotal(visibleLines);
	const breadcrumbs = getBreadcrumbs(lines, navigationPath);
	const subTitle = deriveSubTitle(lines, navigationPath);

	function mutate(
		updater: (lines: AnyLineState[]) => AnyLineState[],
		coalesceKey?: string
	) {
		undo.push(lines, coalesceKey);
		setLines(prev => updateLinesAtPath(prev, navigationPath, updater));
	}

	function handleDragEnd({ active, over }: DragEndEvent) {
		if (!over || active.id === over.id) return;
		mutate(prev => {
			const oldIndex = prev.findIndex(l => l.id === active.id);
			const newIndex = prev.findIndex(l => l.id === over.id);
			if (oldIndex === -1 || newIndex === -1) return prev;
			return arrayMove(prev, oldIndex, newIndex);
		});
	}

	function handleFieldChange(
		id: string,
		field: 'l' | 's' | 'd',
		value: string
	) {
		mutate(
			prev => processFieldUpdate(prev, id, field, value),
			`${pathKey}\0${id}\0${field}`
		);
	}

	function handleQuantityChange(id: string, value: string) {
		mutate(
			prev => processQuantityUpdate(prev, id, value),
			`${pathKey}\0qty\0${id}`
		);
	}

	function handleTitleChange(id: string, value: string) {
		mutate(
			prev => updateTitle(prev, id, value),
			`${pathKey}\0title\0${id}`
		);
	}

	function handleRemoveLine(id: string) {
		mutate(prev => prev.filter(l => l.id !== id));
	}
	function handleAddLine() {
		mutate(prev => [...prev, emptyLine()]);
	}
	function handleAddExtended() {
		mutate(prev => [...prev, emptyExtendedItem()]);
	}
	function handleAddSubtotal() {
		mutate(prev => [...prev, emptySubtotalItem()]);
	}

	function handleClear() {
		if (navigationPath.length === 0) {
			undo.push(lines);
			setLines(initialState().lines);
		} else mutate(() => [emptyLine(), emptyLine()]);
	}

	function handleDuplicateLine(id: string) {
		mutate(prev => {
			const idx = prev.findIndex(l => l.id === id);
			if (idx === -1) return prev;
			const copy = duplicateLine(prev[idx]);
			return [...prev.slice(0, idx + 1), copy, ...prev.slice(idx + 1)];
		});
	}

	function handleClearItem(id: string) {
		mutate(prev => prev.map(l => (l.id === id ? clearItem(l) : l)));
	}

	function handleSave(filename: string) {
		const {
			totalPence: tp,
			totalDisplay: td,
			hasError: he,
		} = computeGrandTotal(lines);
		triggerJsonDownload(
			`${filename}.summa.json`,
			createSummaFile({
				lines,
				totalPence: tp,
				totalDisplay: td,
				hasError: he,
			})
		);
	}

	async function handleLoadFile(): Promise<void> {
		const file = loadInputRef.current?.files?.[0];
		if (!file) {
			setLoadError('Please select a file.');
			return;
		}
		setLoadError('');
		setLoadLoading(true);
		try {
			const state = parseSummaFile(await file.text());
			if (loadInputRef.current) loadInputRef.current.value = '';
			setLines(state.lines);
			setNavigationPath([]);
			undo.reset();
			setLoadOpen(false);
		} catch (e) {
			setLoadError(
				e instanceof Error ? e.message : 'Failed to load file.'
			);
		} finally {
			setLoadLoading(false);
		}
	}

	function handleLoadFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		setLoadError('');
		setLoadHasFile(!!e.target.files?.length);
	}

	function handleLoadClose() {
		setLoadError('');
		setLoadOpen(false);
	}

	function handleNavigate(path: IdPath) {
		undo.clearCoalesceKey();
		setNavigationPath(path);
	}
	function handleDone() {
		undo.clearCoalesceKey();
		setNavigationPath(prev => prev.slice(0, -1));
	}
	function handleEditSubtotal(id: string) {
		undo.clearCoalesceKey();
		setNavigationPath(prev => [...prev, id]);
	}

	function handleSubTitleChange(v: string) {
		if (v === (subTitle ?? '').trim()) return;
		undo.push(lines);
		const subtotalId = navigationPath[navigationPath.length - 1];
		setLines(prev =>
			updateLinesAtPath(prev, navigationPath.slice(0, -1), parentLines =>
				updateTitle(parentLines, subtotalId, v)
			)
		);
	}

	function handleWelcomeGetStarted() {
		markWelcomeSeen();
		setScreen('main');
	}
	function handleWelcomeReadManual() {
		markWelcomeSeen();
		setScreen('help');
	}

	if (screen === 'welcome')
		return (
			<SplashScreen
				onGetStarted={handleWelcomeGetStarted}
				onReadManual={handleWelcomeReadManual}
			/>
		);
	if (screen === 'help')
		return (
			<HelpScreen
				onBack={() => setScreen('main')}
				showExplanation={showExplanation}
				onShowExplanationChange={setShowExplanation}
				advancedMode={advancedMode}
				onAdvancedModeChange={setAdvancedMode}
			/>
		);

	return (
		<>
			<div id="print-colophon">
				Made with Summa — https://gjhilton.github.io/Summa/
			</div>
			<Renderer
				lines={visibleLines}
				totalDisplay={totalDisplay}
				totalPence={totalPence}
				showExplanation={showExplanation}
				onShowExplanationChange={setShowExplanation}
				advancedMode={advancedMode}
				onAdvancedModeChange={setAdvancedMode}
				sensors={sensors}
				onDragEnd={handleDragEnd}
				onHelp={() => setScreen('help')}
				onFieldChange={handleFieldChange}
				onQuantityChange={handleQuantityChange}
				onTitleChange={handleTitleChange}
				onRemoveLine={handleRemoveLine}
				onAddLine={handleAddLine}
				onAddExtended={handleAddExtended}
				onAddSubtotal={handleAddSubtotal}
				onClear={handleClear}
				onDuplicateLine={handleDuplicateLine}
				onClearItem={handleClearItem}
				breadcrumbs={breadcrumbs}
				navigationPath={navigationPath}
				subTitle={subTitle}
				onSubTitleChange={handleSubTitleChange}
				onNavigate={handleNavigate}
				onDone={navigationPath.length > 0 ? handleDone : undefined}
				onEditSubtotal={handleEditSubtotal}
				hasError={hasError || undefined}
				onUndo={() => undo.pop(setLines)}
				canUndo={undo.canUndo}
				swipeOpenId={swipeOpenId}
				onSwipeOpenIdChange={setSwipeOpenId}
				onSaveOpen={() => {
					setSaveFilename('');
					setSaveOpen(true);
				}}
				onSaveClose={() => setSaveOpen(false)}
				saveFilename={saveFilename}
				onSaveFilenameChange={setSaveFilename}
				onSave={handleSave}
				saveDialogRef={saveDialogRef}
				onLoadOpen={() => setLoadOpen(true)}
				onLoadClose={handleLoadClose}
				loadError={loadError}
				loadLoading={loadLoading}
				loadHasFile={loadHasFile}
				loadInputRef={loadInputRef}
				onLoadFile={handleLoadFile}
				onLoadFileChange={handleLoadFileChange}
				loadDialogRef={loadDialogRef}
			/>
		</>
	);
}
