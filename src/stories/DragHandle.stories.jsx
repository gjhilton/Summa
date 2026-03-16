import React from "react"
import { DndContext } from "@dnd-kit/core"
import { SortableContext, useSortable } from "@dnd-kit/sortable"
import { DragHandle, GripIcon } from "@/display/MainScreen"
import { DragCtx } from "@/display/DragCtx"

export default {
  title: "Prototype/Drag Handle",
  parameters: { layout: "centered" },
}

export const Icon = {
  name: "GripIcon",
  render: () => <GripIcon />,
}

export const WithoutContext = {
  name: "DragHandle — no context (renders nothing)",
  render: () => <DragHandle />,
}

function LiveHandle({ id }) {
  const { listeners, attributes, setNodeRef } = useSortable({ id })
  return (
    <DragCtx.Provider value={{ listeners, attributes }}>
      <div ref={setNodeRef} style={{ display: "flex", alignItems: "stretch", height: "3rem" }}>
        <DragHandle />
      </div>
    </DragCtx.Provider>
  )
}

export const WithContext = {
  name: "DragHandle — with context (interactive)",
  render: () => (
    <DndContext>
      <SortableContext items={["a"]}>
        <LiveHandle id="a" />
      </SortableContext>
    </DndContext>
  ),
}
