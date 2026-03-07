import React from "react"
import { styled } from "../styled-system/jsx"

// container - n rows on mobile / n columns on desktop
const Item = styled("div", {
  base: {
    display: "grid",
    gridTemplateColumns: { base: "1fr", md: "repeat(auto-fit, minmax(0, 1fr))" },
  },
})

// row on mobile / column on desktop
const Block = styled("div", {
  base: {
    bg: "gray.100"
  },
})

export const BlockTitle = ({
	title,
	children
}) =>
	<Block>
		{title}
		{children}
	</Block>

export const BlockCurrency = ({children}) =>
	<Block>
	currency
	</Block>

export const ItemUnit = () =>
	<Item>
		<BlockTitle title="unit item title"/>
		<BlockCurrency />
	</Item>

export const ItemExtended = () =>
	<Item>
		<BlockTitle title="Extended item title"/>
		<BlockCurrency />
		<BlockCurrency />
	</Item>

export const ItemSubTotal = () =>
	<Item>
		<BlockTitle title="subtotal item title"/>
		<BlockCurrency />
	</Item>

export const ItemTotal = () =>
	<Item>
		<BlockTitle title="Summa logo" />
		<BlockCurrency />
	</Item>

export const HeaderEdit = () =>
	<header>
	edit buttons here
	</header>

export const ListOfItems = () =>
	<section>
		<ItemUnit />
		<ItemExtended />
		<ItemSubTotal />
		<ItemTotal />
	</section>

export const ScreenMain = () =>
	<main>
		<HeaderEdit />
		<ListOfItems/>
	</main>
