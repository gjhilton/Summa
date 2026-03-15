import React from "react"
import { ScreenHeader, HeaderSpacer } from "@/display/shared/Header"
import { Button } from "@/display/shared/Button"

const narrow = (Story) => (
  <div style={{ maxWidth: 480, margin: "0 auto", fontFamily: "serif" }}>
    <Story />
  </div>
)

export default {
  title: "Prototype/ScreenHeader",
  decorators: [narrow],
  parameters: { layout: "fullscreen" },
}

export const Empty = {
  name: "Empty",
  render: () => <ScreenHeader />,
}

export const WithBack = {
  name: "With back button",
  render: () => (
    <ScreenHeader>
      <Button onClick={() => alert("back")}>← back</Button>
    </ScreenHeader>
  ),
}

export const WithActions = {
  name: "With action buttons",
  render: () => (
    <ScreenHeader>
      <Button variant="primary">export</Button>
      <Button>load</Button>
      <HeaderSpacer />
      <Button variant="danger">clear</Button>
    </ScreenHeader>
  ),
}
