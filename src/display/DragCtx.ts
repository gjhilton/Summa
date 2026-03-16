import React from 'react'
import type { DraggableAttributes, DraggableSyntheticListeners } from '@dnd-kit/core'

export interface DragCtxValue {
  listeners: DraggableSyntheticListeners
  attributes: DraggableAttributes
}

export const DragCtx = React.createContext<DragCtxValue | null>(null)
