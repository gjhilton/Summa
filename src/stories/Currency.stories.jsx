import React from "react"
import { Currency } from "@/display/ScreenMain"

const narrow = (Story) => (
  <div style={{ maxWidth: 480, margin: "2rem auto", fontFamily: "serif" }}>
    <Story />
  </div>
)

export default {
  title: "Prototype/Fields/Currency",
  decorators: [narrow],
  parameters: { layout: "fullscreen" },
}

export const ReadOnly = {
  name: "Read-only · all three fields",
  render: () => <Currency editable={false} values={{ l: "x", s: "vj", d: "iij" }} />,
}

export const Editable = {
  name: "Editable · all three fields",
  render: () => <Currency editable={true} values={{ l: "x", s: "vj", d: "iij" }} />,
}

export const EditableEmpty = {
  name: "Editable · all empty",
  render: () => <Currency editable={true} values={{ l: "", s: "", d: "" }} />,
}

export const Zeros = {
  name: "Read-only · zeros",
  render: () => <Currency editable={false} values={{ l: "0", s: "0", d: "0" }} />,
}

export const LargeValues = {
  name: "Read-only · large values",
  render: () => <Currency editable={false} values={{ l: "mcccxlij", s: "xix", d: "xj" }} />,
}
