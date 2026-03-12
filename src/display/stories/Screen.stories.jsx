import React from "react"
import { HeaderEdit, FooterEdit, ListOfItems, ScreenMain, AddItemBar } from "../Prototype"

export default {
  title: "Prototype/Screen",
  parameters: { layout: "fullscreen" },
}

export const Header = {
  name: "HeaderEdit",
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480, margin: "0 auto", fontFamily: "serif" }}>
        <Story />
      </div>
    ),
  ],
  render: () => <HeaderEdit />,
}

export const List = {
  name: "ListOfItems (interactive)",
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480, margin: "0 auto", fontFamily: "serif" }}>
        <Story />
      </div>
    ),
  ],
  render: () => <ListOfItems />,
}

export const Footer = {
  name: "FooterEdit — no help button",
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480, margin: "0 auto", fontFamily: "serif" }}>
        <Story />
      </div>
    ),
  ],
  render: () => <FooterEdit />,
}

export const FooterWithHelp = {
  name: "FooterEdit — with help button",
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480, margin: "0 auto", fontFamily: "serif" }}>
        <Story />
      </div>
    ),
  ],
  render: () => <FooterEdit onHelp={() => alert("Help!")} />,
}

export const AddBarDefault = {
  name: "AddItemBar — default",
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480, margin: "0 auto", fontFamily: "serif" }}>
        <Story />
      </div>
    ),
  ],
  render: () => <AddItemBar onAdd={() => {}} />,
}

export const AddBarAdvanced = {
  name: "AddItemBar — advanced",
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480, margin: "0 auto", fontFamily: "serif" }}>
        <Story />
      </div>
    ),
  ],
  render: () => <AddItemBar advanced onAddUnit={() => {}} onAddExtended={() => {}} onAddSubtotal={() => {}} />,
}

export const Full = {
  name: "ScreenMain (full screen)",
  render: () => (
    <div style={{ maxWidth: 480, margin: "0 auto", fontFamily: "serif" }}>
      <ScreenMain />
    </div>
  ),
}
