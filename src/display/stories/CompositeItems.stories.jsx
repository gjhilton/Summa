import React from "react"
import { ItemUnit, ItemExtended, ItemSubTotal, ItemTotal, SwipeProvider, DUMMY_DATA } from "../Prototype"

// These use SwipeableItem internally so they need SwipeProvider
const withSwipe = (Story) => (
  <SwipeProvider>
    <div style={{ maxWidth: 480, margin: "0 auto", fontFamily: "serif" }}>
      <Story />
    </div>
  </SwipeProvider>
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
  render: () => <ItemUnit title={lineItem.title} literals={lineItem.literals} />,
}

export const Extended = {
  name: "ItemExtended",
  render: () => <ItemExtended title={extendedItem.title} literals={extendedItem.literals} quantity={extendedItem.quantity} />,
}

export const SubTotal = {
  name: "ItemSubTotal",
  render: () => <ItemSubTotal title={subTotalItem.title} count={subTotalItem.lines.length} totalDisplay={subTotalItem.totalDisplay} onEdit={() => {}} />,
}

export const Total = {
  name: "ItemTotal (no swipe)",
  render: () => <ItemTotal totalDisplay={DUMMY_DATA.totalDisplay} />,
}

export const AllItems = {
  name: "All item types stacked",
  render: () => (
    <>
      <ItemUnit title={lineItem.title} literals={lineItem.literals} />
      <ItemExtended title={extendedItem.title} literals={extendedItem.literals} quantity={extendedItem.quantity} />
      <ItemSubTotal title={subTotalItem.title} count={subTotalItem.lines.length} totalDisplay={subTotalItem.totalDisplay} onEdit={() => {}} />
      <ItemTotal totalDisplay={DUMMY_DATA.totalDisplay} />
    </>
  ),
}
