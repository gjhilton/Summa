import { useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import type { DragEndEvent } from '@dnd-kit/core'
import { DUMMY_DATA } from '@/display/dummyData'
import { Renderer } from '@/display/Renderer'
import type { AnyLineState } from '@/types/calculation'

export default function App() {
  const [lines, setLines] = useState<AnyLineState[]>(DUMMY_DATA.lines)
  const [showExplanation, setShowExplanation] = useState(true)
  const [advancedMode, setAdvancedMode] = useState(false)

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return
    setLines(prev => {
      const oldIndex = prev.findIndex(l => l.id === active.id)
      const newIndex = prev.findIndex(l => l.id === over.id)
      return arrayMove(prev, oldIndex, newIndex)
    })
  }

  return (
    <Renderer
      lines={lines}
      totalDisplay={DUMMY_DATA.totalDisplay}
      totalPence={DUMMY_DATA.totalPence}
      showExplanation={showExplanation}
      onShowExplanationChange={setShowExplanation}
      advancedMode={advancedMode}
      onAdvancedModeChange={setAdvancedMode}
      onDragEnd={handleDragEnd}
    />
  )
}
