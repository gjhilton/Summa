import React from "react"
import { HeaderEdit, FooterEdit, ListOfItems, AddItemBar, SubHeaderEdit } from "@/display/MainScreen"
import { DUMMY_DATA } from "@/utils/dummyData"
import { Renderer } from "@/display/Renderer"
import { DndContext } from "@dnd-kit/core"

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
      <DndContext>
        <div style={{ maxWidth: 480, margin: "0 auto", fontFamily: "serif" }}>
          <Story />
        </div>
      </DndContext>
    ),
  ],
  render: () => (
    <ListOfItems
      lines={DUMMY_DATA.lines}
      totalDisplay={DUMMY_DATA.totalDisplay}
      totalPence={DUMMY_DATA.totalPence}
      advanced={false}
      showExplanation={false}
      onFieldChange={() => {}}
      onQuantityChange={() => {}}
      onTitleChange={() => {}}
      onRemoveLine={() => {}}
      onAddLine={() => {}}
      onAddExtended={() => {}}
      onAddSubtotal={() => {}}
      onDuplicateLine={() => {}}
      onClearItem={() => {}}
      onEditSubtotal={() => {}}
    />
  ),
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
  render: () => (
    <FooterEdit
      showExplanation={false}
      onShowExplanationChange={() => {}}
      advancedMode={false}
      onAdvancedModeChange={() => {}}
    />
  ),
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
  render: () => (
    <FooterEdit
      onHelp={() => alert("Help!")}
      showExplanation={false}
      onShowExplanationChange={() => {}}
      advancedMode={false}
      onAdvancedModeChange={() => {}}
    />
  ),
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
  name: "Renderer (full screen)",
  render: () => (
    <div style={{ maxWidth: 480, margin: "0 auto", fontFamily: "serif" }}>
      <Renderer
        lines={DUMMY_DATA.lines}
        totalDisplay={DUMMY_DATA.totalDisplay}
        totalPence={DUMMY_DATA.totalPence}
        showExplanation={false}
        onShowExplanationChange={() => {}}
        advancedMode={false}
        onAdvancedModeChange={() => {}}
        onDragEnd={() => {}}
        onHelp={() => {}}
        onFieldChange={() => {}}
        onQuantityChange={() => {}}
        onTitleChange={() => {}}
        onRemoveLine={() => {}}
        onAddLine={() => {}}
        onAddExtended={() => {}}
        onAddSubtotal={() => {}}
        onClear={() => {}}
        onDuplicateLine={() => {}}
        onClearItem={() => {}}
        onSave={() => {}}
        onLoad={() => Promise.resolve()}
        breadcrumbs={[{ id: '', title: 'Summa totalis', path: [] }]}
        navigationPath={[]}
        onSubTitleChange={() => {}}
        onNavigate={() => {}}
        onEditSubtotal={() => {}}
      />
    </div>
  ),
}

const subtotalItem = DUMMY_DATA.lines[2]

export const SubLevelView = {
  name: "MainScreen — sub-level (navigation active)",
  render: () => (
    <DndContext>
      <div style={{ maxWidth: 480, margin: "0 auto", fontFamily: "serif" }}>
        <SubHeaderEdit
          breadcrumbs={[
            { id: '', title: 'Summa totalis', path: [] },
            { id: subtotalItem.id, title: subtotalItem.title, path: [subtotalItem.id] },
          ]}
          onNavigate={() => {}}
          subTitle={subtotalItem.title}
          onSubTitleChange={() => {}}
          onDone={() => {}}
        />
        <ListOfItems
          lines={subtotalItem.lines}
          totalDisplay={subtotalItem.totalDisplay}
          totalPence={subtotalItem.totalPence}
          advanced={false}
          showExplanation={false}
          onFieldChange={() => {}}
          onQuantityChange={() => {}}
          onTitleChange={() => {}}
          onRemoveLine={() => {}}
          onAddLine={() => {}}
          onAddExtended={() => {}}
          onAddSubtotal={() => {}}
          onDuplicateLine={() => {}}
          onClearItem={() => {}}
          onEditSubtotal={() => {}}
        />
      </div>
    </DndContext>
  ),
}
