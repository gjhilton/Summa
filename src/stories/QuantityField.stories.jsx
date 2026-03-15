import React from "react"
import { QuantityField } from "@/display/MainScreen"

const narrow = (Story) => (
  <div style={{ maxWidth: 480, margin: "2rem auto", fontFamily: "serif" }}>
    <Story />
  </div>
)

export default {
  title: "Prototype/Fields/QuantityField",
  decorators: [narrow],
  parameters: { layout: "fullscreen" },
}

export const ReadOnly = {
  name: "Read-only · with value",
  render: () => <QuantityField editable={false} value="xij" />,
}

export const Editable = {
  name: "Editable · with value",
  render: () => <QuantityField editable={true} value="xij" />,
}

export const EditableEmpty = {
  name: "Editable · empty",
  render: () => <QuantityField editable={true} value="" />,
}

export const WithError = {
  name: "Editable — error state",
  render: () => <QuantityField value="xyz" editable error />,
}
