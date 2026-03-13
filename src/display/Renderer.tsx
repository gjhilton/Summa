import { useState } from 'react'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import type { AnyLineState, CalculationState } from '@/types/calculation'
import { ScreenMain } from './ScreenMain'

interface Props {
  data: CalculationState
  onReorder?: (lines: AnyLineState[]) => void
}

export function Renderer({ data, onReorder }: Props) {
  const [showExplanation, setShowExplanation] = useState(true)
  const [advancedMode, setAdvancedMode] = useState(false)
  const sensors = useSensors(useSensor(PointerSensor))

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id || !onReorder) return
    const oldIndex = data.lines.findIndex(l => l.id === active.id)
    const newIndex = data.lines.findIndex(l => l.id === over.id)
    onReorder(arrayMove(data.lines, oldIndex, newIndex))
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <ScreenMain
        lines={data.lines}
        totalDisplay={data.totalDisplay}
        totalPence={data.totalPence}
        showExplanation={showExplanation}
        onShowExplanationChange={setShowExplanation}
        advancedMode={advancedMode}
        onAdvancedModeChange={setAdvancedMode}
      />
    </DndContext>
  )
}
