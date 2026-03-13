import { useState, useEffect, useRef } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import type { DragEndEvent } from '@dnd-kit/core'
import { Renderer } from '@/display/Renderer'
import { HelpScreen } from '@/display/HelpScreen'
import { SplashScreen } from '@/display/SplashScreen'
import type { AnyLineState } from '@/types/calculation'
import { isSubtotalItem } from '@/types/calculation'
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
} from '@/utils/calculationLogic'
import type { IdPath } from '@/utils/calculationLogic'
import { createSummaFile, parseSummaFile } from '@/utils/serialization'
import { loadFromStorage, saveToStorage, markWelcomeSeen } from '@/utils/storage'

type Screen = 'welcome' | 'main' | 'help'

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [lines, setLines] = useState<AnyLineState[]>(() => loadFromStorage())
  const [navigationPath, setNavigationPath] = useState<IdPath>([])
  const [showExplanation, setShowExplanation] = useState(true)
  const [advancedMode, setAdvancedMode] = useState(false)
  const [undoStacks, setUndoStacks] = useState<Record<string, AnyLineState[][]>>({})
  const lastCoalesceKeyRef = useRef<string | null>(null)

  useEffect(() => {
    saveToStorage(lines)
  }, [lines])

  const pathKey = navigationPath.join('/')
  const canUndo = (undoStacks[pathKey]?.length ?? 0) > 0

  const visibleLines = getLinesAtPath(lines, navigationPath)
  const { totalPence, totalDisplay, hasError } = computeGrandTotal(visibleLines)
  const breadcrumbs = getBreadcrumbs(lines, navigationPath)

  // Derive subTitle from raw state, not the breadcrumb display (which substitutes
  // 'Untitled' for empty titles — causing the edit field to ghost-write 'Untitled'
  // on blur for any sub-calc the user navigates into without typing a title).
  const subTitle = (() => {
    if (navigationPath.length === 0) return undefined
    const id = navigationPath[navigationPath.length - 1]
    const item = getLinesAtPath(lines, navigationPath.slice(0, -1)).find(l => l.id === id)
    return item && isSubtotalItem(item) ? item.title : ''
  })()

  function pushUndo(snapshot: AnyLineState[], coalesceKey?: string) {
    if (coalesceKey && coalesceKey === lastCoalesceKeyRef.current) return
    lastCoalesceKeyRef.current = coalesceKey ?? null
    setUndoStacks(stacks => {
      const existing = stacks[pathKey] ?? []
      const trimmed = existing.length >= 25 ? existing.slice(1) : existing
      return { ...stacks, [pathKey]: [...trimmed, snapshot] }
    })
  }

  function mutate(updater: (lines: AnyLineState[]) => AnyLineState[], coalesceKey?: string) {
    pushUndo(lines, coalesceKey)
    setLines(prev => updateLinesAtPath(prev, navigationPath, updater))
  }

  function handleUndo() {
    lastCoalesceKeyRef.current = null
    setUndoStacks(stacks => {
      const stack = stacks[pathKey] ?? []
      if (stack.length === 0) return stacks
      setLines(stack[stack.length - 1])
      return { ...stacks, [pathKey]: stack.slice(0, -1) }
    })
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return
    mutate(prev => {
      const oldIndex = prev.findIndex(l => l.id === active.id)
      const newIndex = prev.findIndex(l => l.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return prev
      return arrayMove(prev, oldIndex, newIndex)
    })
  }

  function handleFieldChange(id: string, field: 'l' | 's' | 'd', value: string) {
    mutate(prev => processFieldUpdate(prev, id, field, value), `${pathKey}\0${id}\0${field}`)
  }

  function handleQuantityChange(id: string, value: string) {
    mutate(prev => processQuantityUpdate(prev, id, value), `${pathKey}\0qty\0${id}`)
  }

  function handleTitleChange(id: string, value: string) {
    mutate(prev => updateTitle(prev, id, value), `${pathKey}\0title\0${id}`)
  }

  function handleRemoveLine(id: string) {
    mutate(prev => prev.filter(l => l.id !== id))
  }

  function handleAddLine() {
    mutate(prev => [...prev, emptyLine()])
  }

  function handleAddExtended() {
    mutate(prev => [...prev, emptyExtendedItem()])
  }

  function handleAddSubtotal() {
    mutate(prev => [...prev, emptySubtotalItem()])
  }

  function handleClear() {
    if (navigationPath.length === 0) {
      pushUndo(lines)
      setLines(initialState().lines)
    } else {
      mutate(() => [emptyLine(), emptyLine()])
    }
  }

  function handleDuplicateLine(id: string) {
    mutate(prev => {
      const idx = prev.findIndex(l => l.id === id)
      if (idx === -1) return prev
      const copy = duplicateLine(prev[idx])
      return [...prev.slice(0, idx + 1), copy, ...prev.slice(idx + 1)]
    })
  }

  function handleClearItem(id: string) {
    mutate(prev => prev.map(l => l.id === id ? clearItem(l) : l))
  }

  function handleSave(filename: string) {
    const { totalPence: tp, totalDisplay: td, hasError } = computeGrandTotal(lines)
    const file = createSummaFile({ lines, totalPence: tp, totalDisplay: td, hasError })
    const json = JSON.stringify(file, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.summa.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  async function handleLoad(file: File): Promise<void> {
    const json = await file.text()
    const state = parseSummaFile(json)
    setLines(state.lines)
    setNavigationPath([])
    setUndoStacks({})
  }

  function handleNavigate(path: IdPath) {
    lastCoalesceKeyRef.current = null
    setNavigationPath(path)
  }

  function handleDone() {
    lastCoalesceKeyRef.current = null
    setNavigationPath(prev => prev.slice(0, -1))
  }

  function handleEditSubtotal(id: string) {
    lastCoalesceKeyRef.current = null
    setNavigationPath(prev => [...prev, id])
  }

  function handleSubTitleChange(v: string) {
    if (v === (subTitle ?? '').trim()) return
    pushUndo(lines)
    const subtotalId = navigationPath[navigationPath.length - 1]
    const parentPath = navigationPath.slice(0, -1)
    setLines(prev => updateLinesAtPath(prev, parentPath, parentLines => updateTitle(parentLines, subtotalId, v)))
  }

  function handleWelcomeGetStarted() {
    markWelcomeSeen()
    setScreen('main')
  }

  function handleWelcomeReadManual() {
    markWelcomeSeen()
    setScreen('help')
  }

  if (screen === 'welcome') return <SplashScreen onGetStarted={handleWelcomeGetStarted} onReadManual={handleWelcomeReadManual} />
  if (screen === 'help') return <HelpScreen onBack={() => setScreen('main')} showExplanation={showExplanation} onShowExplanationChange={setShowExplanation} advancedMode={advancedMode} onAdvancedModeChange={setAdvancedMode} />

  return (
    <Renderer
      lines={visibleLines}
      totalDisplay={totalDisplay}
      totalPence={totalPence}
      showExplanation={showExplanation}
      onShowExplanationChange={setShowExplanation}
      advancedMode={advancedMode}
      onAdvancedModeChange={setAdvancedMode}
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
      onSave={handleSave}
      onLoad={handleLoad}
      breadcrumbs={breadcrumbs}
      navigationPath={navigationPath}
      subTitle={subTitle}
      onSubTitleChange={handleSubTitleChange}
      onNavigate={handleNavigate}
      onDone={navigationPath.length > 0 ? handleDone : undefined}
      onEditSubtotal={handleEditSubtotal}
      hasError={hasError || undefined}
      onUndo={handleUndo}
      canUndo={canUndo}
    />
  )
}
