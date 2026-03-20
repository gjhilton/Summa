import React from "react"
import { ScreenContainer } from "@/display/shared/ScreenContainer"
import { PageWidth } from "@/display/shared/PageWidth"

export default {
  title: "Prototype/Shared/Primitives",
  parameters: { layout: "fullscreen" },
}

export const ScreenContainerDefault = {
  name: "ScreenContainer — default (white background)",
  render: () => (
    <ScreenContainer style={{ minHeight: "8rem" }}>
      <PageWidth>
        <p style={{ fontFamily: "serif", padding: "1rem 0" }}>Default ScreenContainer — no background variant.</p>
      </PageWidth>
    </ScreenContainer>
  ),
}

export const ScreenContainerGrey = {
  name: "ScreenContainer — grey background",
  render: () => (
    <ScreenContainer background="grey" style={{ minHeight: "8rem" }}>
      <PageWidth>
        <p style={{ fontFamily: "serif", padding: "1rem 0" }}>ScreenContainer with grey background variant.</p>
      </PageWidth>
    </ScreenContainer>
  ),
}

export const PageWidthDemo = {
  name: "PageWidth — constrained margins",
  render: () => (
    <div style={{ background: "#eee", minHeight: "4rem", fontFamily: "serif" }}>
      <PageWidth style={{ background: "white", padding: "1rem 0" }}>
        Content constrained to page width with 1.5rem side margins.
      </PageWidth>
    </div>
  ),
}
