import React from "react"
import { Arrow } from "@/display/help/Arrow"

const centred = (Story) => (
  <div style={{ maxWidth: 480, margin: "2rem auto", fontFamily: "serif", padding: "2rem" }}>
    <Story />
  </div>
)

export default {
  title: "Prototype/Help/Arrow",
  decorators: [centred],
  parameters: { layout: "fullscreen" },
}

export const Down = {
  name: "Down (default)",
  render: () => <Arrow />,
}

export const Up = {
  name: "Up",
  render: () => <Arrow direction="up" />,
}

export const Right = {
  name: "Right",
  render: () => <Arrow direction="right" />,
}

export const Left = {
  name: "Left",
  render: () => <Arrow direction="left" />,
}

export const DownLeft = {
  name: "Down-left",
  render: () => <Arrow direction="downLeft" />,
}

export const DownRight = {
  name: "Down-right",
  render: () => <Arrow direction="downRight" />,
}

export const UpLeft = {
  name: "Up-left",
  render: () => <Arrow direction="upLeft" />,
}

export const UpRight = {
  name: "Up-right",
  render: () => <Arrow direction="upRight" />,
}

export const AllDirections = {
  name: "All directions",
  render: () => (
    <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-end" }}>
      <div><Arrow direction="up" /><div style={{ fontSize: "0.75rem", textAlign: "center" }}>up</div></div>
      <div><Arrow direction="down" /><div style={{ fontSize: "0.75rem", textAlign: "center" }}>down</div></div>
      <div><Arrow direction="left" /><div style={{ fontSize: "0.75rem", textAlign: "center" }}>left</div></div>
      <div><Arrow direction="right" /><div style={{ fontSize: "0.75rem", textAlign: "center" }}>right</div></div>
      <div><Arrow direction="upLeft" /><div style={{ fontSize: "0.75rem", textAlign: "center" }}>upLeft</div></div>
      <div><Arrow direction="upRight" /><div style={{ fontSize: "0.75rem", textAlign: "center" }}>upRight</div></div>
      <div><Arrow direction="downLeft" /><div style={{ fontSize: "0.75rem", textAlign: "center" }}>downLeft</div></div>
      <div><Arrow direction="downRight" /><div style={{ fontSize: "0.75rem", textAlign: "center" }}>downRight</div></div>
    </div>
  ),
}
