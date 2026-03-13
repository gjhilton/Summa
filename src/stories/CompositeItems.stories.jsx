import React from "react"
import { DndContext } from "@dnd-kit/core"
import { SortableContext, useSortable } from "@dnd-kit/sortable"
import { ItemUnit, ItemExtended, ItemSubTotal, ItemTotal, SwipeProvider, DragCtx } from "@/display/MainScreen"
import { DUMMY_DATA } from "@/display/dummyData"

// Wraps a single item as a sortable so DragHandle receives context
function WithDrag({ id, children }) {
  const { listeners, attributes, setNodeRef } = useSortable({ id })
  return (
    <DragCtx.Provider value={{ listeners, attributes }}>
      <div ref={setNodeRef}>{children}</div>
    </DragCtx.Provider>
  )
}

const withSwipe = (Story) => (
  <DndContext>
    <SortableContext items={["a", "b", "c"]}>
      <SwipeProvider>
        <div style={{ maxWidth: 480, margin: "0 auto", fontFamily: "serif" }}>
          <Story />
        </div>
      </SwipeProvider>
    </SortableContext>
  </DndContext>
)

export default {
  title: "Prototype/Composite Items",
  decorators: [withSwipe],
  parameters: { layout: "fullscreen" },
}

const lineItem = DUMMY_DATA.lines[0]
const extendedItem = DUMMY_DATA.lines[1]
const subTotalItem = DUMMY_DATA.lines[2]

export const Unit = {
  name: "ItemUnit",
  render: () => <WithDrag id="a"><ItemUnit title={lineItem.title} literals={lineItem.literals} /></WithDrag>,
}

export const Extended = {
  name: "ItemExtended",
  render: () => <WithDrag id="b"><ItemExtended title={extendedItem.title} literals={extendedItem.literals} quantity={extendedItem.quantity} /></WithDrag>,
}

export const SubTotal = {
  name: "ItemSubTotal",
  render: () => <WithDrag id="c"><ItemSubTotal title={subTotalItem.title} count={subTotalItem.lines.length} totalDisplay={subTotalItem.totalDisplay} onEdit={() => {}} /></WithDrag>,
}

export const Total = {
  name: "ItemTotal (no swipe, no drag)",
  render: () => <ItemTotal totalDisplay={DUMMY_DATA.totalDisplay} />,
}

export const AllItems = {
  name: "All item types stacked",
  render: () => (
    <>
      <WithDrag id="a"><ItemUnit title={lineItem.title} literals={lineItem.literals} /></WithDrag>
      <WithDrag id="b"><ItemExtended title={extendedItem.title} literals={extendedItem.literals} quantity={extendedItem.quantity} /></WithDrag>
      <WithDrag id="c"><ItemSubTotal title={subTotalItem.title} count={subTotalItem.lines.length} totalDisplay={subTotalItem.totalDisplay} onEdit={() => {}} /></WithDrag>
      <ItemTotal totalDisplay={DUMMY_DATA.totalDisplay} />
    </>
  ),
}
