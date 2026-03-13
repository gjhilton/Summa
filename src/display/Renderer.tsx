import { useState } from 'react'
import type { CalculationState } from '@/types/calculation'
import { ScreenMain } from './ScreenMain'

interface Props {
  data: CalculationState
}

export function Renderer({ data }: Props) {
  const [showCalculations, setShowCalculations] = useState(false)
  const [advancedMode, setAdvancedMode] = useState(false)
  return (
    <ScreenMain
      data={data}
      showCalculations={showCalculations}
      onShowCalculationsChange={setShowCalculations}
      advancedMode={advancedMode}
      onAdvancedModeChange={setAdvancedMode}
    />
  )
}
