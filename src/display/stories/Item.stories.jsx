import React from "react"
import { Item, BlockTitle, BlockCurrency, QuantityField } from "../ScreenMain"

const narrow = (Story) => (
  <div style={{ maxWidth: 480, margin: "0 auto", fontFamily: "serif" }}>
    <Story />
  </div>
)

export default {
  title: "Prototype/Item",
  decorators: [narrow],
  parameters: { layout: "fullscreen" },
}

// ── No actions (e.g. total row) ───────────────────────────────────────────────

export const Default = {
  name: "No actions · closed",
  render: () => (
    <Item>
      <BlockTitle title="Candles, tallow" editable={true} />
      <BlockCurrency editable={true} />
    </Item>
  ),
}

// ── With action strip ─────────────────────────────────────────────────────────

export const WithActionsClosed = {
  name: "With actions · closed",
  render: () => (
    <Item showActions>
      <BlockTitle title="Candles, tallow" editable={true} />
      <BlockCurrency editable={true} />
    </Item>
  ),
}

export const WithActionsOpen = {
  name: "With actions · swiped open",
  render: () => (
    <Item showActions isOpen>
      <BlockTitle title="Candles, tallow" editable={true} />
      <BlockCurrency editable={true} />
    </Item>
  ),
}

export const WithActionsDesktopHover = {
  name: "With actions · desktop hover",
  render: () => (
    <Item showActions desktopVisible>
      <BlockTitle title="Candles, tallow" editable={true} />
      <BlockCurrency editable={true} />
    </Item>
  ),
}

// ── Border variants ───────────────────────────────────────────────────────────

export const SubtotalClosed = {
  name: "Subtotal border · closed",
  render: () => (
    <Item borders="subtotal" showActions>
      <BlockTitle title="Subtotal" editable={false} />
      <BlockCurrency />
    </Item>
  ),
}

export const SubtotalOpen = {
  name: "Subtotal border · swiped open",
  render: () => (
    <Item borders="subtotal" showActions isOpen>
      <BlockTitle title="Subtotal" editable={false} />
      <BlockCurrency />
    </Item>
  ),
}

export const SubtotalDesktopHover = {
  name: "Subtotal border · desktop hover",
  render: () => (
    <Item borders="subtotal" showActions desktopVisible>
      <BlockTitle title="Subtotal" editable={false} />
      <BlockCurrency />
    </Item>
  ),
}

export const TotalBorder = {
  name: "Total border · no actions",
  render: () => (
    <Item borders="total">
      <BlockTitle title="Total" editable={false} />
      <BlockCurrency />
    </Item>
  ),
}

// ── Content variants ──────────────────────────────────────────────────────────

export const ExtendedClosed = {
  name: "Extended item · closed",
  render: () => (
    <Item showActions>
      <BlockTitle title="Beeswax candles" editable={true}>
        <QuantityField editable={true} value="xij" />
      </BlockTitle>
      <BlockCurrency editable={true} />
      <BlockCurrency />
    </Item>
  ),
}

export const ExtendedOpen = {
  name: "Extended item · swiped open",
  render: () => (
    <Item showActions isOpen>
      <BlockTitle title="Beeswax candles" editable={true}>
        <QuantityField editable={true} value="xij" />
      </BlockTitle>
      <BlockCurrency editable={true} />
      <BlockCurrency />
    </Item>
  ),
}

export const ExtendedDesktopHover = {
  name: "Extended item · desktop hover",
  render: () => (
    <Item showActions desktopVisible>
      <BlockTitle title="Beeswax candles" editable={true}>
        <QuantityField editable={true} value="xij" />
      </BlockTitle>
      <BlockCurrency editable={true} />
      <BlockCurrency />
    </Item>
  ),
}
