import React from "react"
import { DndContext } from "@dnd-kit/core"
import { SortableContext, useSortable } from "@dnd-kit/sortable"
import { ItemUnit, ItemExtended, ItemSubTotal, ItemTotal, SwipeProvider } from "@/display/MainScreen"
import { DragCtx } from "@/display/DragCtx"
import { DUMMY_DATA } from "@/utils/dummyData"

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

export const ItemExtendedWithResult = {
  name: "ItemExtended — with computed result",
  render: () => (
    <WithDrag id="b"><ItemExtended
      title="Beeswax candles"
      literals={{ l: '0', s: 'ij', d: '0' }}
      quantity="xij"
      resultDisplay={{ l: '0', s: 'xviij', d: '0' }}
      onTitleChange={() => {}} onFieldChange={() => {}}
      onQuantityChange={() => {}} onRemove={() => {}}
    /></WithDrag>
  ),
}

export const ItemUnitWithErrors = {
  name: "ItemUnit — field errors",
  render: () => (
    <WithDrag id="a"><ItemUnit
      title="Bad entry"
      literals={{ l: 'xyz', s: 'iij', d: 'abc' }}
      fieldErrors={{ l: true, s: false, d: true }}
      error
      explanation="this item has an error: only Roman numerals allowed in li and d fields"
      explanationIsError
      onTitleChange={() => {}} onFieldChange={() => {}} onRemove={() => {}}
    /></WithDrag>
  ),
}

export const ItemExtendedWithErrors = {
  name: "ItemExtended — field + quantity errors",
  render: () => (
    <WithDrag id="b"><ItemExtended
      title="Bad entry"
      literals={{ l: 'xyz', s: 'ij', d: '0' }}
      quantity="abc"
      resultDisplay={{ l: '0', s: '0', d: '0' }}
      fieldErrors={{ l: true, s: false, d: false }}
      quantityError
      error
      explanation="this item has an error: only Roman numerals allowed in li and quantity fields"
      explanationIsError
      onTitleChange={() => {}} onFieldChange={() => {}}
      onQuantityChange={() => {}} onRemove={() => {}}
    /></WithDrag>
  ),
}

export const ItemExtendedMissingQuantity = {
  name: "ItemExtended — quantity missing",
  render: () => (
    <WithDrag id="b"><ItemExtended
      title="Beeswax candles"
      literals={{ l: '0', s: 'ij', d: '0' }}
      quantity=""
      resultDisplay={{ l: '0', s: '0', d: '0' }}
      fieldErrors={{ l: false, s: false, d: false }}
      quantityError
      error
      explanation="this item has an error: quantity is required"
      explanationIsError
      onTitleChange={() => {}} onFieldChange={() => {}}
      onQuantityChange={() => {}} onRemove={() => {}}
    /></WithDrag>
  ),
}

export const ItemSubTotalWithError = {
  name: "ItemSubTotal — error (child has invalid entry)",
  render: () => (
    <WithDrag id="c"><ItemSubTotal
      title="sundries"
      count={3}
      totalDisplay={{ l: '0', s: '0', d: '0' }}
      error
      explanation="this item has an error: a sub-item contains invalid input"
      explanationIsError
      onEdit={() => {}}
    /></WithDrag>
  ),
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
