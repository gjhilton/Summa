import React from "react"
import { CurrencyField } from "@/display/MainScreen"

const narrow = (Story) => (
  <div style={{ maxWidth: 480, margin: "2rem auto", fontFamily: "serif" }}>
    <Story />
  </div>
)

export default {
  title: "Prototype/Fields/CurrencyField",
  decorators: [narrow],
  parameters: { layout: "fullscreen" },
}

export const ReadOnlyPounds = {
  name: "Read-only · pounds (li)",
  render: () => <CurrencyField editable={false} label="li" value="x" />,
}

export const ReadOnlyShillings = {
  name: "Read-only · shillings (s)",
  render: () => <CurrencyField editable={false} label="s" value="vj" />,
}

export const ReadOnlyPence = {
  name: "Read-only · pence (d)",
  render: () => <CurrencyField editable={false} label="d" value="iij" />,
}

export const EditableWithValue = {
  name: "Editable · with value",
  render: () => <CurrencyField editable={true} label="s" value="viij" />,
}

export const EditableEmpty = {
  name: "Editable · empty",
  render: () => <CurrencyField editable={true} label="s" value="" />,
}

export const PoundsFieldWithError = {
  name: "Pounds field — error state",
  render: () => <CurrencyField label="li" value="xyz" editable error />,
}

export const ShillingsFieldWithError = {
  name: "Shillings field — error state",
  render: () => <CurrencyField label="s" value="xyz" editable error />,
}
