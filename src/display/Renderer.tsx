import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import type { AnyLineState, LsdStrings } from '@/types/calculation'
import type { IdPath } from '@/utils/calculationLogic'
import { MainScreen } from './MainScreen'

interface Props {
  lines: AnyLineState[]
  totalDisplay: LsdStrings
  totalPence: number
  showExplanation: boolean
  onShowExplanationChange: (value: boolean) => void
  advancedMode: boolean
  onAdvancedModeChange: (value: boolean) => void
  onDragEnd: (event: DragEndEvent) => void
  onHelp: () => void
  onFieldChange: (id: string, field: 'l' | 's' | 'd', value: string) => void
  onQuantityChange: (id: string, value: string) => void
  onTitleChange: (id: string, value: string) => void
  onRemoveLine: (id: string) => void
  onAddLine: () => void
  onAddExtended: () => void
  onAddSubtotal: () => void
  onClear: () => void
  onDuplicateLine: (id: string) => void
  onClearItem: (id: string) => void
  onSave: (filename: string) => void
  onLoad: (file: File) => Promise<void>
  breadcrumbs: Array<{ id: string; title: string; path: IdPath }>
  navigationPath: IdPath
  subTitle?: string
  onSubTitleChange: (v: string) => void
  onNavigate: (path: IdPath) => void
  onDone?: () => void
  onEditSubtotal: (id: string) => void
  hasError?: boolean
}

export function Renderer({
  lines,
  totalDisplay,
  totalPence,
  showExplanation,
  onShowExplanationChange,
  advancedMode,
  onAdvancedModeChange,
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
  onSave,
  onLoad,
  breadcrumbs,
  navigationPath,
  subTitle,
  onSubTitleChange,
  onNavigate,
  onDone,
  onEditSubtotal,
  hasError,
}: Props) {
  const sensors = useSensors(useSensor(PointerSensor))

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
        onSave={onSave}
        onLoad={onLoad}
        breadcrumbs={breadcrumbs}
        navigationPath={navigationPath}
        subTitle={subTitle}
        onSubTitleChange={onSubTitleChange}
        onNavigate={onNavigate}
        onDone={onDone}
        onEditSubtotal={onEditSubtotal}
        hasError={hasError}
      />
    </DndContext>
  )
}
