import { styled } from "../styled-system/jsx"
import { cva } from "../styled-system/css"

// container: always equal columns
const Equally = styled("div", {
  base: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(0, 1fr))", // all children equal width
  },
})

// Map border variant to thickness and color
const borderMap = {
  subtotal: { thickness: "1px", color: "black" },
  total: { thickness: "5px", color: "black" },
  default: { thickness: "1px", color: "transparent" },
}

// Grid container: n rows on mobile / n columns on desktop
const itemRecipe = cva({
  base: {
    marginBottom: "1rem",
    display: "grid",
    gridTemplateColumns: { base: "1fr", md: "repeat(auto-fit, minmax(0, 1fr))" },
    borderLeft: 0,
    borderRight: 0,
  },
  variants: {
    borders: Object.fromEntries(
      Object.entries(borderMap).map(([key, { thickness, color }]) => [
        key === "default" ? undefined : key, // skip default as a variant
        {
          borderTop: `${thickness} solid ${color}`,
          borderBottom: `${thickness} solid ${color}`,
        },
      ])
    ),
  },
})

export const Item = styled("div", itemRecipe)

const Box = styled("div", {
  base: {
    bg: "gray.100"
  },
})

const Block = Box // later we may need rows to share something boxes dont

const inputRecipe = cva({
  base: {
    border: "1px solid",
    borderColor: "transparent",
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
		borderColor: "black"
      },
      false: {
        bg: "gray.100",
        color: "gray.500",
      },
    },
  },
  defaultVariants: {
    editable: true,
  },
})

const StyledInput = styled("input", inputRecipe)


/* ----- exported components ---- */

export function TextInput({ 
	editable = true, 
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
    	<TextField value={value}/>
    {label}
  </label>
</Box>

export const Currency = ({
	editable
}) =>
	<Equally>
		<CurrencyField label="li" editable="editable"/>
		<CurrencyField label="s" editable="editable"/>
		<CurrencyField label="d" editable="editable"/>
	</Equally>

export const BlockTitle = ({
	title,
	children,
	editable
}) =>
	<Block>
	<Equally>
		<TextField value="Unit item" editable={editable}/>
		{children}
		</Equally>
	</Block>

export const BlockCurrency = ({children}) =>
	<Block>
		<Currency />
	</Block>

export const ItemUnit = () =>
	<Item>
		<BlockTitle title="unit item title" editable={true}/>
	</Item>

export const ItemExtended = () =>
	<Item>
		<BlockTitle title="extended item title" editable={true}/>
		<BlockCurrency />
		<BlockCurrency />
	</Item>

export const ItemSubTotal = () =>
	<Item borders="subtotal">
		<BlockTitle title="subtotal item title" editable={false}/>
		<BlockCurrency />
	</Item>

export const ItemTotal = () =>
	<Item borders="total">
		<BlockTitle title="unit item title" editable={false}/>
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
	

