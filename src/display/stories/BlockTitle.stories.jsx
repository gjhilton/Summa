import React from "react"
import { BlockTitle, QuantityField } from "../ScreenMain"

const narrow = (Story) => (
  <div style={{ maxWidth: 480, margin: "2rem auto", fontFamily: "serif" }}>
    <Story />
  </div>
)

export default {
  title: "Prototype/Blocks/BlockTitle",
  decorators: [narrow],
  parameters: { layout: "fullscreen" },
}

export const ReadOnly = {
  name: "Read-only",
  render: () => <BlockTitle title="Candles, tallow" editable={false} />,
}

export const Editable = {
  name: "Editable",
  render: () => <BlockTitle title="Candles, tallow" editable={true} />,
}

export const EditableEmpty = {
  name: "Editable · empty title",
  render: () => <BlockTitle title="" editable={true} />,
}

export const WithQuantityChild = {
  name: "With QuantityField child (extended item)",
  render: () => (
    <BlockTitle title="Beeswax candles" editable={true}>
      <QuantityField editable={true} value="xij" />
    </BlockTitle>
  ),
}

export const WithQuantityReadOnly = {
  name: "With QuantityField child · read-only",
  render: () => (
    <BlockTitle title="Beeswax candles" editable={false}>
      <QuantityField editable={false} value="xij" />
    </BlockTitle>
  ),
}
