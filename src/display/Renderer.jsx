import React from "react"
import { ScreenMain } from "./ScreenMain"

export function Renderer({ data }) {
  const [showCalculations, setShowCalculations] = React.useState(false)
  const [advancedMode, setAdvancedMode] = React.useState(false)
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
