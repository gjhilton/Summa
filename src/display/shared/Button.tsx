import React from 'react'
import { styled } from "@/styled-system/jsx"
import { cva, type RecipeVariantProps } from "@/styled-system/css"


const buttonRecipe = cva({
  base: {
    width: "full",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    columnGap: "0.35em",

    px: "4",
    py: "2",

    fontWeight: "600",
    lineHeight: "1",
    textAlign: "center",

    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: "0",

    whiteSpace: "nowrap",
    maxWidth: { md: "10rem" },

    transition: "background 0.2s, color 0.2s, border-color 0.2s",

    _focusVisible: {
      outline: "2px solid black",
      outlineOffset: "2px",
    },

    _disabled: {
      bg: "gray.200",
      borderColor: "gray.300",
      color: "gray.400",
      cursor: "not-allowed",
      opacity: 1,
      textDecoration: "line-through",
    },
  },

  variants: {
    variant: {
      outline: {
        bg: "white",
        color: "black",
        borderColor: "black",

        _hover: {
          bg: "gray.100",
        },
      },

      primary: {
        bg: "black",
        color: "white",
        borderColor: "black",

        _hover: {
          bg: "gray.900",
        },
      },

      danger: {
        bg: "white",
        color: "red.600",
        borderColor: "red.600",

        _hover: {
          bg: "red.50",
        },
      },
    },
  },

  defaultVariants: {
    variant: "outline",
  },
})

type ButtonVariants = RecipeVariantProps<typeof buttonRecipe>

export type ButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariants & {
    icon?: React.ComponentType
  }

const StyledButton = styled("button", buttonRecipe)

export function Button({ icon: Icon, children, ...props }: ButtonProps) {
  return (
    <StyledButton {...props}>
      {Icon && <Icon />}
      {children}
    </StyledButton>
  )
}
