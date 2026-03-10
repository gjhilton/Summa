import React from "react"
import { ItemUnit, ItemExtended, ItemSubTotal, ItemTotal, SwipeProvider } from "../Prototype"

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

export const Unit = {
  name: "ItemUnit",
  render: () => <ItemUnit />,
}

export const Extended = {
  name: "ItemExtended",
  render: () => <ItemExtended />,
}

export const SubTotal = {
  name: "ItemSubTotal",
  render: () => <ItemSubTotal />,
}

export const Total = {
  name: "ItemTotal (no swipe)",
  render: () => <ItemTotal />,
}

export const AllItems = {
  name: "All item types stacked",
  render: () => (
    <>
      <ItemUnit />
      <ItemExtended />
      <ItemSubTotal />
      <ItemTotal />
    </>
  ),
}
