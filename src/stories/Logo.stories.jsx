import React from "react"
import { Logo } from "@/display/MainScreen"

const centred = (Story) => (
  <div style={{ maxWidth: 480, margin: "2rem auto", fontFamily: "serif" }}>
    <Story />
  </div>
)

export default {
  title: "Prototype/Logo",
  decorators: [centred],
  parameters: { layout: "fullscreen" },
}

export const Small = {
  name: "Small",
  render: () => <Logo size="s" />,
}

export const Medium = {
  name: "Medium (default)",
  render: () => <Logo />,
}

export const Large = {
  name: "Large",
  render: () => <Logo size="l" />,
}

export const AllSizes = {
  name: "All sizes",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div><p style={{ margin: "0 0 0.5rem", fontSize: "0.8rem" }}>size=&quot;s&quot;</p><Logo size="s" /></div>
      <div><p style={{ margin: "0 0 0.5rem", fontSize: "0.8rem" }}>size=&quot;m&quot; (default)</p><Logo size="m" /></div>
      <div><p style={{ margin: "0 0 0.5rem", fontSize: "0.8rem" }}>size=&quot;l&quot;</p><Logo size="l" /></div>
    </div>
  ),
}
