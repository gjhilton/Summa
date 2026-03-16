import React, { useState } from "react"
import { SaveModalUI, LoadModalUI } from "@/display/MainScreen"

export default {
  title: "Prototype/Modals",
  parameters: { layout: "fullscreen" },
}

// ─── Save modal ───────────────────────────────────────────────────────────────

const SaveWrapper = ({ initialOpen = true }) => {
  const [isOpen, setIsOpen] = useState(initialOpen)
  return (
    <div style={{ fontFamily: "serif", padding: "2rem" }}>
      <button onClick={() => setIsOpen(true)}>Open Save modal</button>
      <SaveModalUI
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={(filename) => alert(`Save: ${filename}.summa.json`)}
      />
    </div>
  )
}

export const SaveModalOpen = {
  name: "Save modal — open (empty filename)",
  render: () => <SaveWrapper initialOpen={true} />,
}

export const SaveModalClosed = {
  name: "Save modal — closed",
  render: () => <SaveWrapper initialOpen={false} />,
}

const SaveModalWithFilename = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [saved, setSaved] = useState(null)
  return (
    <div style={{ fontFamily: "serif", padding: "2rem" }}>
      {saved && <p>Saved as: <strong>{saved}.summa.json</strong></p>}
      <button onClick={() => setIsOpen(true)}>Open Save modal</button>
      <SaveModalUI
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={(filename) => { setSaved(filename); setIsOpen(false) }}
      />
    </div>
  )
}

export const SaveModalInteractive = {
  name: "Save modal — interactive (type a name and save)",
  render: () => <SaveModalWithFilename />,
}

// ─── Load modal ───────────────────────────────────────────────────────────────

const LoadWrapper = ({ initialOpen = true }) => {
  const [isOpen, setIsOpen] = useState(initialOpen)
  const [loaded, setLoaded] = useState(null)

  async function handleLoad(file) {
    const text = await file.text()
    const data = JSON.parse(text)
    setLoaded(data)
    setIsOpen(false)
  }

  return (
    <div style={{ fontFamily: "serif", padding: "2rem" }}>
      {loaded && <p>Loaded: <strong>{loaded.metadata?.appName ?? "unknown"}</strong></p>}
      <button onClick={() => setIsOpen(true)}>Open Load modal</button>
      <LoadModalUI
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onLoad={handleLoad}
      />
    </div>
  )
}

export const LoadModalOpen = {
  name: "Load modal — open",
  render: () => <LoadWrapper initialOpen={true} />,
}

export const LoadModalClosed = {
  name: "Load modal — closed",
  render: () => <LoadWrapper initialOpen={false} />,
}

const LoadModalError = () => {
  const [isOpen, setIsOpen] = useState(true)

  async function handleLoad(_file) {
    throw new Error("Not a valid JSON file")
  }

  return (
    <div style={{ fontFamily: "serif", padding: "2rem" }}>
      <button onClick={() => setIsOpen(true)}>Open Load modal</button>
      <LoadModalUI
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onLoad={handleLoad}
      />
    </div>
  )
}

export const LoadModalWithError = {
  name: "Load modal — error state (select any file to trigger)",
  render: () => <LoadModalError />,
}

const LoadModalSlow = () => {
  const [isOpen, setIsOpen] = useState(true)

  async function handleLoad(_file) {
    await new Promise((resolve) => setTimeout(resolve, 3000))
  }

  return (
    <div style={{ fontFamily: "serif", padding: "2rem" }}>
      <button onClick={() => setIsOpen(true)}>Open Load modal</button>
      <LoadModalUI
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onLoad={handleLoad}
      />
    </div>
  )
}

export const LoadModalLoading = {
  name: "Load modal — loading state (select a file to see spinner)",
  render: () => <LoadModalSlow />,
}
