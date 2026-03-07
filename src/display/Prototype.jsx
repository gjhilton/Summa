import React from "react"
import { styled } from "../styled-system/jsx"
import { cva } from "../styled-system/css"
import { Button } from "./Button"

// Map border variant to thickness and color
const borderMap = {
  subtotal: { thickness: "1px", color: "transparent", style: "solid" },
  total: { thickness: "3px", color: "black", style: "double" },
  default: { thickness: "1px", color: "transparent", style: "solid" },
}

// Swipe context — tracks which item's action strip is open
const SwipeContext = React.createContext({ openId: null, setOpenId: () => {} })
function useSwipeContext() { return React.useContext(SwipeContext) }

function SwipeProvider({ children }) {
  const [openId, setOpenId] = React.useState(null)
  return (
    <SwipeContext.Provider value={{ openId, setOpenId }}>
      {children}
    </SwipeContext.Provider>
  )
}

// Action strip — revealed on swipe left
const ActionStripWrapper = styled("div", {
  base: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "240px",
    display: "flex",
    flexDirection: "row",
    zIndex: 1,
    overflow: "hidden",
    background: "#e8e8e8",
    boxShadow: "inset 8px 0 16px -4px rgba(0,0,0,0.25)",
  },
})

const actionButtonBase = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "2px",
  border: "none",
  cursor: "pointer",
  fontSize: "0.65rem",
  fontFamily: "inherit",
  color: "white",
  padding: "0 4px",
  lineHeight: 1.2,
}

function ActionStrip({ onClose, desktopVisible }) {
  // Touch devices: strip is always opaque — content slides away to reveal it
  // Hover devices: strip fades in/out on row hover
  const style = canHover
    ? {
        opacity: desktopVisible ? 1 : 0,
        transform: desktopVisible ? "translateX(0)" : "translateX(12px)",
        transition: "opacity 0.2s ease, transform 0.2s ease",
        pointerEvents: desktopVisible ? "auto" : "none",
      }
    : {}
  return (
    <ActionStripWrapper style={style}>
      <button
        style={{ ...actionButtonBase, background: "transparent", color: "#333" }}
        onClick={onClose}
        aria-label="Delete row"
      >
        <span style={{ fontSize: "1rem" }}>🗑</span>
        Delete
      </button>
      <button
        style={{ ...actionButtonBase, background: "transparent", color: "#333" }}
        onClick={onClose}
        aria-label="Duplicate row"
      >
        <span style={{ fontSize: "1rem" }}>⧉</span>
        Duplicate
      </button>
      <button
        style={{ ...actionButtonBase, background: "transparent", color: "#333" }}
        onClick={onClose}
        aria-label="Clear item"
      >
        <span style={{ fontSize: "1rem" }}>✕</span>
        Clear
      </button>
    </ActionStripWrapper>
  )
}

// Base container: grid and button positioning
const StyledItem = styled("div", {
  base: {
    position: "relative",
    marginBottom: "3rem",
    overflow: "hidden",
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
    position: "relative",
    zIndex: 2,
    display: { base: "block", md: "flex" },
    "& > *": { flex: "1" },
    "& > *:last-child": { flex: "0 0 33.333%" },
    borderTopWidth: "1px",
    borderBottomWidth: "1px",
    borderTopStyle: "solid",
    borderBottomStyle: "solid",
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    padding: "0 1.5rem",
  },
  variants: {
    hasButton: {
    //  true: { marginLeft: "1.5rem" },
    },
    borders: Object.fromEntries(
      Object.entries(borderMap).map(([key, { thickness, color, style }]) => [
        key === "default" ? undefined : key,
        {
          borderTopWidth: thickness,
          borderBottomWidth: thickness,
          borderTopStyle: style,
          borderBottomStyle: style,
          borderTopColor: color,
          borderBottomColor: color,
          ...(key === "total" ? { paddingBottom: "1rem" } : {}),
        },
      ])
    ),
  },
  defaultVariants: {
    hasButton: false,
    borders: undefined,
  },
})

// Detect if device supports hover (non-touch pointer)
const canHover = typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches

// Component
export function Item({ borders, leftButton, noSwipe, children, ...props }) {
  const id = React.useId()
  const { openId, setOpenId } = useSwipeContext()
  const isOpen = !noSwipe && openId === id
  const [hovered, setHovered] = React.useState(false)
  const startX = React.useRef(null)
  const startY = React.useRef(null)
  const isVertical = React.useRef(false)

  function onTouchStart(e) {
    startX.current = e.touches[0].clientX
    startY.current = e.touches[0].clientY
    isVertical.current = false
  }

  function onTouchMove(e) {
    if (isVertical.current) return
    const dx = e.touches[0].clientX - startX.current
    const dy = e.touches[0].clientY - startY.current
    if (Math.abs(dy) > Math.abs(dx)) isVertical.current = true
  }

  function onTouchEnd(e) {
    if (isVertical.current) return
    const dx = e.changedTouches[0].clientX - startX.current
    if (dx < -40) setOpenId(id)
    else if (dx > 20) setOpenId(null)
  }

  function onClose() {
    setOpenId(null)
    setHovered(false)
  }

  return (
    <StyledItem
      {...props}
      onMouseEnter={!noSwipe && canHover ? () => setHovered(true) : undefined}
      onMouseLeave={!noSwipe && canHover ? () => setHovered(false) : undefined}
    >
      {leftButton && <LeftButtonWrapper>{leftButton}</LeftButtonWrapper>}
      {!noSwipe && <ActionStrip onClose={onClose} desktopVisible={canHover && hovered} />}
      <ContentWrapper
        hasButton={!!leftButton}
        borders={borders}
        style={{
          transform: isOpen ? "translateX(-240px)" : "translateX(0)",
          transition: "transform 0.25s ease, background 0.25s ease, box-shadow 0.25s ease",
          touchAction: noSwipe ? undefined : "pan-y",
          background: isOpen ? "#fef9e0" : "white",
          boxShadow: isOpen ? "6px 0 16px rgba(0,0,0,0.3)" : "none",
        }}
        onTouchStart={noSwipe ? undefined : onTouchStart}
        onTouchMove={noSwipe ? undefined : onTouchMove}
        onTouchEnd={noSwipe ? undefined : onTouchEnd}
      >
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
    gap: "0",
  },
})

const Box = styled("div", {
  base: {
    // bg: "gray.100"
  },
})

const Block = styled("div", {
  base: {
    marginTop: "1rem",
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


const PlainLabelText = styled("span", {
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
    width: "100%",
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
        bg: "transparent",
        color: "black",
        borderBottomColor: "rgba(0,0,0,0.1)",
        _focus: { borderBottomColor: "black" },
      },
      false: {
        borderBottomColor: "transparent",
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
<Box paddingRight="1.5rem">
	<label>
	   {label}
    	<TextInput value={value} editable={editable} align={align} fontWeight="bold"/>
  </label>
</Box>

export const QuantityField = ({
	value,
	editable
}) =>
<Box>
	<Label>
		<PlainLabelText fontSize="1.1em">✕</PlainLabelText>
		<TextInput align="r" value={value} editable={editable}/>
		<PlainLabelText>@</PlainLabelText>
	</Label>
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
		<BlockTitle title="extended item" editable={true}>
			<QuantityField editable={true}/>
		</BlockTitle>
		<BlockCurrency editable={true}/>
		<BlockCurrency />
	</Item>

export const ItemSubTotal = () =>
	<Item borders="subtotal">
		<BlockTitle title="subtotal" editable={false}/>
		<BlockCurrency />
	</Item>

export const ItemTotal = () =>
	<Item borders="total" noSwipe>
		<BlockTitle title="total" editable={false}/>
		<BlockCurrency />
	</Item>

const Header = styled("header", {
  base: {
    margin: "1rem 0 3rem"
  },
})

const HeaderBar = styled("div", {
  base: {
    display: "grid",
    gridTemplateColumns: "auto auto 1fr auto",
    alignItems: "center",
  },
})

export const HeaderEdit = () =>
	<Header>
		<PageWidth>
			<HeaderBar>
				<Button variant="primary">Save</Button>
				<Button>Load</Button>
				<div />
				<Button variant="danger">Clear</Button>
			</HeaderBar>
		</PageWidth>
	</Header>

export const ListOfItems = () =>
	<SwipeProvider>
		<section>
			<ItemUnit/>
			<ItemExtended />
			<ItemSubTotal />
			<ItemTotal />
		</section>
	</SwipeProvider>

export const ScreenMain = () =>
	<main>
		<HeaderEdit />
		<ListOfItems/>
	</main>
	

