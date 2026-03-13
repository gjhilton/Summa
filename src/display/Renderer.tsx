import { useState } from 'react'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import type { AnyLineState, CalculationState } from '@/types/calculation'
import { ScreenMain } from './ScreenMain'

interface Props {
  data: CalculationState
}

export function Renderer({ data }: Props) {
  const [lines, setLines] = useState<AnyLineState[]>(() => data.lines)
  const [showExplanation, setShowExplanation] = useState(true)
  const [advancedMode, setAdvancedMode] = useState(false)
  const sensors = useSensors(useSensor(PointerSensor))

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return
    setLines(prev => {
      const oldIndex = prev.findIndex(l => l.id === active.id)
      const newIndex = prev.findIndex(l => l.id === over.id)
      return arrayMove(prev, oldIndex, newIndex)
    })
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <ScreenMain
        lines={lines}
        totalDisplay={data.totalDisplay}
        showExplanation={showExplanation}
        onShowExplanationChange={setShowExplanation}
        advancedMode={advancedMode}
        onAdvancedModeChange={setAdvancedMode}
      />
    </DndContext>
  )
}
