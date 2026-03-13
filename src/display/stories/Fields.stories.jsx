import React from "react"
import { TextInput, TextField, QuantityField, CurrencyField, Currency } from "../ScreenMain"

const narrow = (Story) => (
  <div style={{ maxWidth: 480, margin: "2rem auto", fontFamily: "serif" }}>
    <Story />
  </div>
)

// ─── TextInput ────────────────────────────────────────────────────────────────

export default {
  title: "Prototype/Fields/TextInput",
  decorators: [narrow],
  parameters: { layout: "fullscreen" },
}

export const ReadOnlyLeft = {
  name: "Read-only · left",
  render: () => <TextInput editable={false} value="Candles, tallow" />,
}

export const ReadOnlyRight = {
  name: "Read-only · right",
  render: () => <TextInput editable={false} value="xiij" align="r" />,
}

export const EditableLeft = {
  name: "Editable · left",
  render: () => <TextInput editable={true} value="Candles, tallow" onChange={() => {}} />,
}

export const EditableRight = {
  name: "Editable · right",
  render: () => <TextInput editable={true} value="vj" align="r" onChange={() => {}} />,
}

export const EditableEmpty = {
  name: "Editable · empty",
  render: () => <TextInput editable={true} value="" onChange={() => {}} />,
}
