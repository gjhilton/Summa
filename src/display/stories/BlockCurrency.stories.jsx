import React from "react"
import { BlockCurrency } from "../ScreenMain"

const narrow = (Story) => (
  <div style={{ maxWidth: 480, margin: "2rem auto", fontFamily: "serif" }}>
    <Story />
  </div>
)

export default {
  title: "Prototype/Blocks/BlockCurrency",
  decorators: [narrow],
  parameters: { layout: "fullscreen" },
}

export const ReadOnly = {
  name: "Read-only",
  render: () => <BlockCurrency />,
}

export const Editable = {
  name: "Editable",
  render: () => <BlockCurrency editable={true} />,
}
