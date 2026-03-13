import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import type { AnyLineState, LsdStrings } from '@/types/calculation'
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
      />
    </DndContext>
  )
}
