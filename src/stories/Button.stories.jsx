import React from "react"
import { Button } from "@/display/shared/Button"

const PlusIcon = () => <strong>+</strong>

const narrow = (Story) => (
  <div style={{ maxWidth: 480, margin: "0 auto", fontFamily: "serif", padding: "1rem" }}>
    <Story />
  </div>
)

export default {
  title: "Prototype/Button",
  decorators: [narrow],
}

export const Default = {
  name: "Default",
  render: () => <Button onClick={() => {}}>load</Button>,
}

export const Primary = {
  name: "Primary",
  render: () => <Button variant="primary" onClick={() => {}}>export</Button>,
}

export const Danger = {
  name: "Danger",
  render: () => <Button variant="danger" onClick={() => {}}>clear</Button>,
}

export const WithIcon = {
  name: "With icon",
  render: () => <Button icon={PlusIcon} onClick={() => {}}>item</Button>,
}

export const Disabled = {
  name: "Disabled",
  render: () => <Button disabled onClick={() => {}}>save</Button>,
}

export const AllVariants = {
  name: "All variants",
  render: () => (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      <Button onClick={() => {}}>default</Button>
      <Button variant="primary" onClick={() => {}}>primary</Button>
      <Button variant="danger" onClick={() => {}}>danger</Button>
      <Button icon={PlusIcon} onClick={() => {}}>with icon</Button>
      <Button disabled onClick={() => {}}>disabled</Button>
    </div>
  ),
}
