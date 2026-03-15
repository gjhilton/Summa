import React from "react"
import { HelpScreen } from "@/display/HelpScreen"

export default {
  title: "Prototype/HelpScreen",
  parameters: { layout: "fullscreen" },
}

export const Default = {
  name: "No back button",
  render: () => (
    <div style={{ maxWidth: 480, margin: "0 auto", fontFamily: "serif" }}>
      <HelpScreen />
    </div>
  ),
}

export const WithBack = {
  name: "With back button",
  render: () => (
    <div style={{ maxWidth: 480, margin: "0 auto", fontFamily: "serif" }}>
      <HelpScreen onBack={() => alert("back")} />
    </div>
  ),
}
