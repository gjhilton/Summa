import React from "react"
import { SplashScreen } from "@/display/SplashScreen"

export default {
  title: "Prototype/SplashScreen",
  parameters: { layout: "fullscreen" },
}

export const Default = {
  name: "Default",
  render: () => (
    <SplashScreen
      onGetStarted={() => {}}
      onReadManual={() => {}}
    />
  ),
}
