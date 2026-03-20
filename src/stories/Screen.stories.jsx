import React, { useRef, useState } from "react"
import { HeaderEdit, FooterEdit, ListOfItems, AddItemBar, SubHeaderEdit, MainScreen } from "@/display/MainScreen"
import { DUMMY_DATA } from "@/utils/dummyData"
import { DndContext } from "@dnd-kit/core"

export default {
  title: "Prototype/Screen",
  parameters: { layout: "fullscreen" },
}

export const Header = {
  name: "HeaderEdit — default",
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480, margin: "0 auto", fontFamily: "serif" }}>
        <Story />
      </div>
    ),
  ],
  render: () => <HeaderEdit />,
}

export const HeaderWithUndo = {
  name: "HeaderEdit — with undo",
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480, margin: "0 auto", fontFamily: "serif" }}>
        <Story />
      </div>
    ),
  ],
  render: () => <HeaderEdit canUndo={true} onUndo={() => {}} />,
}

export const HeaderSaveDisabled = {
  name: "HeaderEdit — export disabled (has error)",
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480, margin: "0 auto", fontFamily: "serif" }}>
        <Story />
      </div>
    ),
  ],
  render: () => <HeaderEdit hasError={true} />,
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

export const FooterBothEnabled = {
  name: "FooterEdit — both toggles on",
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480, margin: "0 auto", fontFamily: "serif" }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <FooterEdit
      onHelp={() => {}}
      showExplanation={true}
      onShowExplanationChange={() => {}}
      advancedMode={true}
      onAdvancedModeChange={() => {}}
    />
  ),
}

export const ListAdvanced = {
  name: "ListOfItems — advanced mode",
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
      advanced={true}
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

export const ListWithExplanations = {
  name: "ListOfItems — with explanations",
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
      showExplanation={true}
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

function FullScreenWrapper() {
  const saveDialogRef = useRef(null)
  const loadDialogRef = useRef(null)
  const loadInputRef = useRef(null)
  const [swipeOpenId, setSwipeOpenId] = useState(null)
  return (
    <MainScreen
      lines={DUMMY_DATA.lines}
      totalDisplay={DUMMY_DATA.totalDisplay}
      totalPence={DUMMY_DATA.totalPence}
      showExplanation={false}
      onShowExplanationChange={() => {}}
      advancedMode={false}
      onAdvancedModeChange={() => {}}
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
      breadcrumbs={[{ id: '', title: 'Summa totalis', path: [] }]}
      navigationPath={[]}
      onSubTitleChange={() => {}}
      onNavigate={() => {}}
      onEditSubtotal={() => {}}
      onUndo={() => {}}
      canUndo={false}
      swipeOpenId={swipeOpenId}
      onSwipeOpenIdChange={setSwipeOpenId}
      onSaveOpen={() => {}}
      onSaveClose={() => {}}
      saveFilename=""
      onSaveFilenameChange={() => {}}
      onSave={() => {}}
      saveDialogRef={saveDialogRef}
      onLoadOpen={() => {}}
      onLoadClose={() => {}}
      loadError=""
      loadLoading={false}
      loadHasFile={false}
      loadInputRef={loadInputRef}
      onLoadFile={() => {}}
      onLoadFileChange={() => {}}
      loadDialogRef={loadDialogRef}
    />
  )
}

export const Full = {
  name: "MainScreen (full screen)",
  render: () => (
    <DndContext>
      <FullScreenWrapper />
    </DndContext>
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
