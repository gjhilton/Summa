import React from "react"
import { SubHeaderEdit } from "@/display/MainScreen"

const narrow = (Story) => (
  <div style={{ maxWidth: 480, margin: "2rem auto", fontFamily: "serif" }}>
    <Story />
  </div>
)

export default {
  title: "Prototype/Screen/SubHeaderEdit",
  decorators: [narrow],
  parameters: { layout: "fullscreen" },
}

export const SingleLevel = {
  name: "One level deep",
  render: () => (
    <SubHeaderEdit
      breadcrumbs={[
        { id: '', title: 'Summa totalis', path: [] },
        { id: '1', title: 'sundries', path: ['1'] },
      ]}
      onNavigate={() => {}}
      subTitle="sundries"
      onSubTitleChange={() => {}}
      onDone={() => {}}
    />
  ),
}

export const TwoLevelsDeep = {
  name: "Two levels deep",
  render: () => (
    <SubHeaderEdit
      breadcrumbs={[
        { id: '', title: 'Summa totalis', path: [] },
        { id: '1', title: 'sundries', path: ['1'] },
        { id: '2', title: 'kitchen', path: ['1', '2'] },
      ]}
      onNavigate={() => {}}
      subTitle="kitchen"
      onSubTitleChange={() => {}}
      onDone={() => {}}
    />
  ),
}

export const UntitledSubCalc = {
  name: "Untitled sub-calculation",
  render: () => (
    <SubHeaderEdit
      breadcrumbs={[
        { id: '', title: 'Summa totalis', path: [] },
        { id: '1', title: 'Untitled', path: ['1'] },
      ]}
      onNavigate={() => {}}
      subTitle=""
      onSubTitleChange={() => {}}
      onDone={() => {}}
    />
  ),
}
