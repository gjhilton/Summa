import React from "react"
import { BlockCurrency } from "@/display/MainScreen"

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

export const ReadOnlyWithValues = {
  name: "Read-only — with values",
  render: () => <BlockCurrency values={{ l: "x", s: "vj", d: "iij" }} />,
}

export const EditableWithValues = {
  name: "Editable — with values",
  render: () => <BlockCurrency editable={true} values={{ l: "ij", s: "xiiij", d: "viij" }} />,
}

export const WithFieldErrors = {
  name: "With field errors",
  render: () => (
    <BlockCurrency
      editable={true}
      values={{ l: "abc", s: "vj", d: "xyz" }}
      fieldErrors={{ l: true, s: false, d: true }}
    />
  ),
}

export const ZeroValues = {
  name: "Zero values",
  render: () => <BlockCurrency values={{ l: "0", s: "0", d: "0" }} />,
}
