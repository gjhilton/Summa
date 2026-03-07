import React from "react"
import { styled } from "../styled-system/jsx"
import { cva } from "../styled-system/css"
import { Button } from "./Button"

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

const PageWidth = styled("div", {
  base: {
  margin: "0 1.5rem" // same as ContentWrapper
  },
})

// Content wrapper: contains the borders and margins
const ContentWrapper = styled("div", {
  base: {
    display: { base: "block", md: "flex" },
    "& > *": { flex: "1" },
    "& > *:last-child": { flex: "0 0 33.333%" },
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

const Block = styled("div", {
  base: {
    marginTop: "0.5rem",
  },
})

const Label = styled("label", {
  base: {
    display: "flex",
    alignItems: "center",
  },
})

const LabelText = styled("sup", {
  base: {
    flexShrink: 0,
    paddingLeft: "0.25rem",
    paddingRight: "0.65rem",
  },
})


const inputRecipe = cva({
  base: {
    border: "0",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: "transparent",
    flex: "1",
    minWidth: "0",
    outline: "none",
    transition: "all 0.2s",
  },
  variants: {
    align: {
		l: {
			textAlign: "left"
		},
		r: {
		textAlign: "right"
		}
	},
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
  align: "left",
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
	editable,
	align
}) =>
<Box>
	<label>
	   {label}
    	<TextInput value={value} editable={editable} align={align}/>
  </label>
</Box>

export const CurrencyField = ({
	value,
	label,
	editable
}) =>
<Box>
	<Label>
		<TextInput align="r" value={value} editable={editable}/>
		<LabelText>{label}</LabelText>
	</Label>
</Box>

export const Currency = ({
	editable,
	values = {
		l: "x",
		s: "vj",
		d: "iij"
	}
}) =>
	<Equally>
		<CurrencyField label="li" editable={editable} value={values.l}/>
		<CurrencyField label="s" editable={editable} value={values.s}/>
		<CurrencyField label="d" editable={editable} value={values.d}/>
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
	<PageWidth>
	<Equally>


<Button variant="primary">
  Save
</Button>
<Button>Load</Button>
<Button variant="danger">
  Delete
</Button>

</Equally>	
</PageWidth>
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
	

