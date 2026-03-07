import React from "react"
import { styled } from "../styled-system/jsx"
import { cva } from "../styled-system/css"

// Map border variant to thickness and color
const borderMap = {
  subtotal: { thickness: "1px", color: "transparent" },
  total: { thickness: "5px", color: "black" },
  default: { thickness: "1px", color: "transparent" },
}

// Base container: grid and button positioning
const StyledItem = styled("div", {
  base: {
    position: "relative", // for absolute button
    marginBottom: "1rem",
    display: "grid",
    gridTemplateColumns: { base: "1fr", md: "repeat(auto-fit, minmax(0, 1fr))" },
  },
})

// Button wrapper: absolutely positioned outside content
const LeftButtonWrapper = styled("div", {
  base: {
    position: "absolute",
    left: 0,
    top: "50%",
    transform: "translateY(-50%)",
  },
})

// Content wrapper: contains the borders and margins
const ContentWrapper = styled("div", {
  base: {
    display: "block",
    borderTopWidth: "1px",
    borderBottomWidth: "1px",
    borderTopStyle: "solid",
    borderBottomStyle: "solid",
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
	margin: "0 1.5rem"
  },
  variants: {
    hasButton: {
    //  true: { marginLeft: "1.5rem" },
    },
    borders: Object.fromEntries(
      Object.entries(borderMap).map(([key, { thickness, color }]) => [
        key === "default" ? undefined : key,
        {
          borderTopWidth: thickness,
          borderBottomWidth: thickness,
          borderTopColor: color,
          borderBottomColor: color,
        },
      ])
    ),
  },
  defaultVariants: {
    hasButton: false,
    borders: undefined,
  },
})

// Component
export function Item({ borders, leftButton, children, ...props }) {
  return (
    <StyledItem {...props}>
      {leftButton && <LeftButtonWrapper>{leftButton}</LeftButtonWrapper>}
      <ContentWrapper hasButton={!!leftButton} borders={borders}>
        {children}
      </ContentWrapper>
    </StyledItem>
  )
}


// -------- 

// container: always equal columns
const Equally = styled("div", {
  base: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(0, 1fr))", // all children equal width
  },
})

const Box = styled("div", {
  base: {
    // bg: "gray.100"
  },
})

const Block = Box // later we may need rows to share something boxes dont

const inputRecipe = cva({
  base: {
    border: "0",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: "transparent",
    p: "2",
     w: "full",
    outline: "none",
    transition: "all 0.2s",
  },
  variants: {
    editable: {
      true: {
        bg: "white",
        color: "black",
        borderBottomColor: "black",
      },
      false: {
        fontStyle: "italic",
        borderBottomColor: "transparent",
       // color: "gray.500",
      },
    },
  },
  defaultVariants: {
    editable: false,
  },
})

const StyledInput = styled("input", inputRecipe)


/* ----- exported components ---- */

export function TextInput({ 
	editable, 
	value, 
	onChange, 
	...props
}) {
  return (
    <StyledInput
      editable={editable ? "true" : "false"} // recipe expects string "true"/"false"
      value={value}
      onChange={editable ? onChange : undefined}
      readOnly={!editable}
      {...props}
    />
  )
}

export const TextField = ({
	value,
	label,
	editable
}) =>
<Box>
	<label>
	   {label}
    	<TextInput value={value} editable={editable}/>
  </label>
</Box>

export const CurrencyField = ({
	value,
	label,
	editable
}) =>
<Box>
	<label>
    	<TextField value={value} editable={editable}/>
    {label}
  </label>
</Box>

export const Currency = ({
	editable
}) =>
	<Equally>
		<CurrencyField label="li" editable={editable}/>
		<CurrencyField label="s" editable={editable}/>
		<CurrencyField label="d" editable={editable}/>
	</Equally>

export const BlockTitle = ({
	title,
	children,
	editable
}) =>
	<Block>
	<Equally>
		<TextField value={title} editable={editable}/>
		{children}
		</Equally>
	</Block>

export const BlockCurrency = ({
children,
editable
}) =>
	<Block>
		<Currency editable={editable}/>
	</Block>

export const ItemUnit = () =>
	<Item>
		<BlockTitle title="unit item" editable={true}/>
		<BlockCurrency editable={true}/>
	</Item>

export const ItemExtended = () =>
	<Item>
		<BlockTitle title="extended item" editable={true}/>
		<BlockCurrency editable={true}/>
		<BlockCurrency />
	</Item>

export const ItemSubTotal = () =>
	<Item borders="subtotal">
		<BlockTitle title="subtotal" editable={false}/>
		<BlockCurrency />
	</Item>

export const ItemTotal = () =>
	<Item borders="total">
		<BlockTitle title="total" editable={false}/>
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
	

