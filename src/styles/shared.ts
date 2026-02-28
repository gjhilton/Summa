import { css } from "../generated/css";

/**
 * Shared focus ring applied to all interactive elements (buttons, inputs, toggles).
 */
export const focusRing = {
  outlineWidth: "0",
  boxShadow: "0 2px 0 0 lemonchiffon",
};

/**
 * Shared styles for the working-row text shown below each field and in the op column.
 */
export const workingRowStyles = {
  display: "block",
  width: "100%",
  minHeight: "1.5em",
  fontSize: "s",
  color: "ink",
  textAlign: "right",
} as const;

export const hidden = css({ visibility: "hidden" });

export const supD = css({ marginLeft: "2px" });

export const workingRowNowrap = css({ ...workingRowStyles, whiteSpace: "nowrap" });

export const lineError = css({ bg: "errorLineBg" });

export const removeIcon = css({ color: "var(--rm-color)", opacity: "var(--rm-opacity)" });

/**
 * Shared title input style — matches Field's editable input appearance.
 */
export const titleInput = css({
  width: "100%",
  padding: "xs",
  fontSize: "xl",
  borderBottomWidth: "1px",
  borderBottomStyle: "solid",
  borderBottomColor: "rgba(0,0,0,0.1)",
  bg: "transparent",
  fontFamily: "inherit",
  textAlign: "left",
  outlineWidth: "0",
  outlineStyle: "none",
  transition: "all 200ms ease-in-out",
  _hover: { borderBottomColor: "ink" },
  _focus: { borderBottomColor: "ink" },
  _focusVisible: focusRing,
  _placeholder: { opacity: "0.4" },
});

export const lineHoverVars = css({
  "--rm-color": "currentColor",
  "--rm-fill": "transparent",
  "--rm-x": "currentColor",
  "--rm-opacity": "0.2",
  _hover: {
    "--rm-color": "var(--colors-error)",
    "--rm-fill": "var(--colors-error)",
    "--rm-x": "white",
    "--rm-opacity": "1",
  },
});
