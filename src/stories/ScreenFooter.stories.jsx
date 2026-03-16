import React from "react"
import { ScreenFooter } from "@/display/shared/Footer"
import { Toggle } from "@/display/MainScreen"

const narrow = (Story) => (
  <div style={{ maxWidth: 480, margin: "0 auto", fontFamily: "serif" }}>
    <Story />
  </div>
)

export default {
  title: "Prototype/ScreenFooter",
  decorators: [narrow],
  parameters: { layout: "fullscreen" },
}

export const Default = {
  name: "Credits only",
  render: () => <ScreenFooter />,
}

export const WithHelp = {
  name: "With help button",
  render: () => <ScreenFooter onHelp={() => alert("help")} />,
}

export const WithControls = {
  name: "With controls",
  render: () => (
    <ScreenFooter controls={<>
      <Toggle id="s1" label="explain calculations" checked={false} onChange={() => {}} />
      <Toggle id="s2" label="advanced mode" checked={false} onChange={() => {}} />
    </>} />
  ),
}

export const WithControlsAndHelp = {
  name: "With controls and help button",
  render: () => (
    <ScreenFooter
      onHelp={() => alert("help")}
      controls={<>
        <Toggle id="s3" label="explain calculations" checked={true} onChange={() => {}} />
        <Toggle id="s4" label="advanced mode" checked={false} onChange={() => {}} />
      </>}
    />
  ),
}
