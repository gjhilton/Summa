import React, { useState } from "react"
import { Toggle } from "@/display/MainScreen"

const narrow = (Story) => (
  <div style={{ maxWidth: 480, margin: "2rem auto", fontFamily: "serif", padding: "1rem" }}>
    <Story />
  </div>
)

export default {
  title: "Prototype/Toggle",
  decorators: [narrow],
  parameters: { layout: "fullscreen" },
}

export const Unchecked = {
  name: "Unchecked",
  render: () => <Toggle id="t1" label="show working" checked={false} onChange={() => {}} />,
}

export const Checked = {
  name: "Checked",
  render: () => <Toggle id="t2" label="show working" checked={true} onChange={() => {}} />,
}

export const Disabled = {
  name: "Disabled",
  render: () => <Toggle id="t3" label="advanced mode" checked={false} onChange={() => {}} disabled />,
}

export const DisabledChecked = {
  name: "Disabled — checked",
  render: () => <Toggle id="t4" label="advanced mode" checked={true} onChange={() => {}} disabled />,
}

const InteractiveToggle = () => {
  const [checked, setChecked] = useState(false)
  return <Toggle id="t-interactive" label="explain calculations" checked={checked} onChange={setChecked} />
}

export const Interactive = {
  name: "Interactive (click to toggle)",
  render: () => <InteractiveToggle />,
}

export const AllVariants = {
  name: "All variants",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <Toggle id="a1" label="unchecked" checked={false} onChange={() => {}} />
      <Toggle id="a2" label="checked" checked={true} onChange={() => {}} />
      <Toggle id="a3" label="disabled unchecked" checked={false} onChange={() => {}} disabled />
      <Toggle id="a4" label="disabled checked" checked={true} onChange={() => {}} disabled />
    </div>
  ),
}
