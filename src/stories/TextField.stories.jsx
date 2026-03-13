import React from "react"
import { TextField } from "@/display/ScreenMain"

const narrow = (Story) => (
  <div style={{ maxWidth: 480, margin: "2rem auto", fontFamily: "serif" }}>
    <Story />
  </div>
)

export default {
  title: "Prototype/Fields/TextField",
  decorators: [narrow],
  parameters: { layout: "fullscreen" },
}

export const ReadOnly = {
  name: "Read-only · with value",
  render: () => <TextField editable={false} value="Salt fish, barrel" />,
}

export const Editable = {
  name: "Editable · with value",
  render: () => <TextField editable={true} value="Salt fish, barrel" />,
}

export const EditableEmpty = {
  name: "Editable · empty",
  render: () => <TextField editable={true} value="" />,
}
