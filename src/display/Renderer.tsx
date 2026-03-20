import { DndContext } from '@dnd-kit/core';
import type {
	DragEndEvent,
	SensorDescriptor,
	SensorOptions,
} from '@dnd-kit/core';
import type { AnyLineState, LsdStrings } from '@/types/calculation';
import type { IdPath } from '@/utils/calculationLogic';
import type { DialogRef } from './MainScreen';
import { MainScreen } from './MainScreen';
import React from 'react';

interface Props {
	lines: AnyLineState[];
	totalDisplay: LsdStrings;
	totalPence: number;
	showExplanation: boolean;
	onShowExplanationChange: (value: boolean) => void;
	advancedMode: boolean;
	onAdvancedModeChange: (value: boolean) => void;
	sensors: SensorDescriptor<SensorOptions>[];
	onDragEnd: (event: DragEndEvent) => void;
	onHelp: () => void;
	onFieldChange: (id: string, field: 'l' | 's' | 'd', value: string) => void;
	onQuantityChange: (id: string, value: string) => void;
	onTitleChange: (id: string, value: string) => void;
	onRemoveLine: (id: string) => void;
	onAddLine: () => void;
	onAddExtended: () => void;
	onAddSubtotal: () => void;
	onClear: () => void;
	onDuplicateLine: (id: string) => void;
	onClearItem: (id: string) => void;
	breadcrumbs: Array<{ id: string; title: string; path: IdPath }>;
	navigationPath: IdPath;
	subTitle?: string;
	onSubTitleChange: (v: string) => void;
	onNavigate: (path: IdPath) => void;
	onDone?: () => void;
	onEditSubtotal: (id: string) => void;
	hasError?: boolean;
	onUndo: () => void;
	canUndo: boolean;
	// Swipe state
	swipeOpenId: string | null;
	onSwipeOpenIdChange: (id: string | null) => void;
	// Modal state
	onSaveOpen: () => void;
	onSaveClose: () => void;
	saveFilename: string;
	onSaveFilenameChange: (v: string) => void;
	onSave: (filename: string) => void;
	saveDialogRef: DialogRef;
	onLoadOpen: () => void;
	onLoadClose: () => void;
	loadError: string;
	loadLoading: boolean;
	loadHasFile: boolean;
	loadInputRef: React.RefObject<HTMLInputElement | null>;
	onLoadFile: () => void;
	onLoadFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	loadDialogRef: DialogRef;
}

export function Renderer({
	lines,
	totalDisplay,
	totalPence,
	showExplanation,
	onShowExplanationChange,
	advancedMode,
	onAdvancedModeChange,
	sensors,
	onDragEnd,
	onHelp,
	onFieldChange,
	onQuantityChange,
	onTitleChange,
	onRemoveLine,
	onAddLine,
	onAddExtended,
	onAddSubtotal,
	onClear,
	onDuplicateLine,
	onClearItem,
	breadcrumbs,
	navigationPath,
	subTitle,
	onSubTitleChange,
	onNavigate,
	onDone,
	onEditSubtotal,
	hasError,
	onUndo,
	canUndo,
	swipeOpenId,
	onSwipeOpenIdChange,
	onSaveOpen,
	onSaveClose,
	saveFilename,
	onSaveFilenameChange,
	onSave,
	saveDialogRef,
	onLoadOpen,
	onLoadClose,
	loadError,
	loadLoading,
	loadHasFile,
	loadInputRef,
	onLoadFile,
	onLoadFileChange,
	loadDialogRef,
}: Props) {
	return (
		<DndContext sensors={sensors} onDragEnd={onDragEnd}>
			<MainScreen
				lines={lines}
				totalDisplay={totalDisplay}
				totalPence={totalPence}
				showExplanation={showExplanation}
				onShowExplanationChange={onShowExplanationChange}
				advancedMode={advancedMode}
				onAdvancedModeChange={onAdvancedModeChange}
				onHelp={onHelp}
				onFieldChange={onFieldChange}
				onQuantityChange={onQuantityChange}
				onTitleChange={onTitleChange}
				onRemoveLine={onRemoveLine}
				onAddLine={onAddLine}
				onAddExtended={onAddExtended}
				onAddSubtotal={onAddSubtotal}
				onClear={onClear}
				onDuplicateLine={onDuplicateLine}
				onClearItem={onClearItem}
				breadcrumbs={breadcrumbs}
				navigationPath={navigationPath}
				subTitle={subTitle}
				onSubTitleChange={onSubTitleChange}
				onNavigate={onNavigate}
				onDone={onDone}
				onEditSubtotal={onEditSubtotal}
				hasError={hasError}
				onUndo={onUndo}
				canUndo={canUndo}
				swipeOpenId={swipeOpenId}
				onSwipeOpenIdChange={onSwipeOpenIdChange}
				onSaveOpen={onSaveOpen}
				onSaveClose={onSaveClose}
				saveFilename={saveFilename}
				onSaveFilenameChange={onSaveFilenameChange}
				onSave={onSave}
				saveDialogRef={saveDialogRef}
				onLoadOpen={onLoadOpen}
				onLoadClose={onLoadClose}
				loadError={loadError}
				loadLoading={loadLoading}
				loadHasFile={loadHasFile}
				loadInputRef={loadInputRef}
				onLoadFile={onLoadFile}
				onLoadFileChange={onLoadFileChange}
				loadDialogRef={loadDialogRef}
			/>
		</DndContext>
	);
}
