import React from "react"
import { BreadcrumbNav } from "@/display/MainScreen"

const narrow = (Story) => (
  <div style={{ maxWidth: 480, margin: "2rem auto", fontFamily: "serif" }}>
    <Story />
  </div>
)

export default {
  title: "Prototype/Screen/BreadcrumbNav",
  decorators: [narrow],
  parameters: { layout: "fullscreen" },
}

export const SingleLevel = {
  name: "One level deep",
  render: () => (
    <BreadcrumbNav
      breadcrumbs={[
        { id: '', title: 'Summa totalis', path: [] },
        { id: '1', title: 'sundries', path: ['1'] },
      ]}
      onNavigate={() => {}}
    />
  ),
}

export const TwoLevelsDeep = {
  name: "Two levels deep",
  render: () => (
    <BreadcrumbNav
      breadcrumbs={[
        { id: '', title: 'Summa totalis', path: [] },
        { id: '1', title: 'sundries', path: ['1'] },
        { id: '2', title: 'kitchen', path: ['1', '2'] },
      ]}
      onNavigate={() => {}}
    />
  ),
}

export const RootOnly = {
  name: "Root only (no ancestors)",
  render: () => (
    <BreadcrumbNav
      breadcrumbs={[
        { id: '', title: 'Summa totalis', path: [] },
      ]}
      onNavigate={() => {}}
    />
  ),
}

export const LongTitles = {
  name: "Long breadcrumb titles",
  render: () => (
    <BreadcrumbNav
      breadcrumbs={[
        { id: '', title: 'Summa totalis', path: [] },
        { id: '1', title: 'Household expenditure', path: ['1'] },
        { id: '2', title: 'Kitchen provisions', path: ['1', '2'] },
      ]}
      onNavigate={() => {}}
    />
  ),
}
