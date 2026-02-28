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

/**
 * Universal ledger column grid shared by all row types.
 * col 1 auto  = remove button
 * col 2 1em   = ( bracket (ExtendedItem) or spacer
 * col 3 1fr   = title / qty  (all titles and ExtendedItem qty align here)
 * col 4 auto  = × / = operator (ExtendedItem) or spacer
 * col 5 20%   = l (pounds)
 * col 6 20%   = s (shillings)
 * col 7 20%   = d (pence)
 * col 8 1em   = ) bracket (ExtendedItem) or trailing spacer
 */
export const LEDGER_COLUMNS = "1.5rem 1em 1fr auto 20% 20% 20% 1em";

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
