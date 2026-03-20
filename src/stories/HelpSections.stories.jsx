import React from "react"
import { HelpIntro } from "@/display/help/00-HelpIntro"
import { HelpGettingStarted } from "@/display/help/01-HelpGettingStarted"
import { HelpHistoricalNote } from "@/display/help/02-HelpHistoricalNote"
import { HelpOrganising } from "@/display/help/03-HelpOrganising"
import { HelpExplanations } from "@/display/help/04-HelpExplanations"
import { HelpAdvanced } from "@/display/help/05-HelpAdvanced"
import { HelpExtendedItems } from "@/display/help/06-HelpExtendedItems"
import { HelpSubtotalItems } from "@/display/help/07-HelpSubtotalItems"
import { HelpSaveLoad } from "@/display/help/08-HelpSaveLoad"
import { HelpAbout } from "@/display/help/09-HelpAbout"
import { HelpChangelog } from "@/display/help/10-HelpChangelog"

const narrow = (Story) => (
  <div style={{ maxWidth: 480, margin: "2rem auto", fontFamily: "serif", padding: "0 1.5rem" }}>
    <Story />
  </div>
)

export default {
  title: "Prototype/Help/Sections",
  decorators: [narrow],
  parameters: { layout: "fullscreen" },
}

export const Intro = {
  name: "00 — HelpIntro",
  render: () => <HelpIntro />,
}

export const GettingStarted = {
  name: "01 — HelpGettingStarted",
  render: () => <HelpGettingStarted />,
}

export const HistoricalNote = {
  name: "02 — HelpHistoricalNote",
  render: () => <HelpHistoricalNote />,
}

export const Organising = {
  name: "03 — HelpOrganising",
  render: () => <HelpOrganising />,
}

export const ExplanationsDisabled = {
  name: "04 — HelpExplanations (disabled)",
  render: () => (
    <HelpExplanations
      showExplanation={false}
      onShowExplanationChange={() => {}}
    />
  ),
}

export const ExplanationsEnabled = {
  name: "04 — HelpExplanations (enabled)",
  render: () => (
    <HelpExplanations
      showExplanation={true}
      onShowExplanationChange={() => {}}
    />
  ),
}

export const AdvancedDisabled = {
  name: "05 — HelpAdvanced (disabled)",
  render: () => (
    <HelpAdvanced
      advancedMode={false}
      onAdvancedModeChange={() => {}}
    />
  ),
}

export const AdvancedEnabled = {
  name: "05 — HelpAdvanced (enabled)",
  render: () => (
    <HelpAdvanced
      advancedMode={true}
      onAdvancedModeChange={() => {}}
    />
  ),
}

export const ExtendedItems = {
  name: "06 — HelpExtendedItems",
  render: () => <HelpExtendedItems />,
}

export const SubtotalItems = {
  name: "07 — HelpSubtotalItems",
  render: () => <HelpSubtotalItems />,
}

export const SaveLoad = {
  name: "08 — HelpSaveLoad",
  render: () => <HelpSaveLoad />,
}

export const About = {
  name: "09 — HelpAbout",
  render: () => <HelpAbout />,
}

export const Changelog = {
  name: "10 — HelpChangelog",
  render: () => <HelpChangelog />,
}
