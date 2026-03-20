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
      <HelpScreen
        showExplanation={false}
        onShowExplanationChange={() => {}}
        advancedMode={false}
        onAdvancedModeChange={() => {}}
      />
    </div>
  ),
}

export const WithBack = {
  name: "With back button",
  render: () => (
    <div style={{ maxWidth: 480, margin: "0 auto", fontFamily: "serif" }}>
      <HelpScreen
        onBack={() => alert("back")}
        showExplanation={false}
        onShowExplanationChange={() => {}}
        advancedMode={false}
        onAdvancedModeChange={() => {}}
      />
    </div>
  ),
}

export const WithExplanationsEnabled = {
  name: "Explanations enabled",
  render: () => (
    <div style={{ maxWidth: 480, margin: "0 auto", fontFamily: "serif" }}>
      <HelpScreen
        onBack={() => {}}
        showExplanation={true}
        onShowExplanationChange={() => {}}
        advancedMode={false}
        onAdvancedModeChange={() => {}}
      />
    </div>
  ),
}

export const WithAdvancedEnabled = {
  name: "Advanced mode enabled",
  render: () => (
    <div style={{ maxWidth: 480, margin: "0 auto", fontFamily: "serif" }}>
      <HelpScreen
        onBack={() => {}}
        showExplanation={false}
        onShowExplanationChange={() => {}}
        advancedMode={true}
        onAdvancedModeChange={() => {}}
      />
    </div>
  ),
}
