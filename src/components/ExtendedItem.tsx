import { css, cx } from "../generated/css";
import { ExtendedItemView, BaseLineItemProps } from "../types/lineView";
import Field from "./Field";
import LedgerRow from "./LedgerRow";
import LsdFieldGroup from "./LsdFieldGroup";
import { supD as supDClass, lineError, lineHoverVars } from "../styles/shared";
import TitleInput from "./TitleInput";
import RemoveButton from "./RemoveButton";

interface ExtendedItemProps extends BaseLineItemProps {
  view: ExtendedItemView;
  onChangeQuantity: (v: string) => void;
}

// auto(remove) | 1fr(op) | 1em(() | 20%(qty) | auto(@) | 20%(l) | 20%(s) | 20%(d) | 1em())
// The 1em bracket cols align with the new bracket cols in Item/Total rows.
const COLUMNS = "auto 1fr 1em 20% auto 20% 20% 20% 1em";

const inputRow = css({ fontStyle: "ritalic", fontWeight: "100" });

const opMain = css({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
});

const atSign = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  paddingLeft: "sm",
  paddingRight: "sm",
  fontSize: "6xl",
  fontWeight: "100",
  userSelect: "none",
});

const SYMBOL_LINE_WEIGHT = "2px"; // renders at 1px after scale(0.5)

const mulSymbol = css({
  display: "inline-block",
  position: "relative",
  width: "0.5em",
  height: "0.5em",
  transform: "rotate(45deg) scale(0.5)",
  _before: {
    content: '""',
    position: "absolute",
    width: SYMBOL_LINE_WEIGHT,
    height: "100%",
    left: "50%",
    top: "0",
    transform: "translateX(-50%)",
    bg: "currentColor",
  },
  _after: {
    content: '""',
    position: "absolute",
    height: SYMBOL_LINE_WEIGHT,
    width: "100%",
    top: "50%",
    left: "0",
    transform: "translateY(-50%)",
    bg: "currentColor",
  },
});

const eqSymbol = css({
  display: "inline-block",
  position: "relative",
  width: "0.5em",
  height: "0.5em",
  transform: "scale(0.5)",
  _before: {
    content: '""',
    position: "absolute",
    height: SYMBOL_LINE_WEIGHT,
    width: "100%",
    top: "33%",
    left: "0",
    bg: "currentColor",
  },
  _after: {
    content: '""',
    position: "absolute",
    height: SYMBOL_LINE_WEIGHT,
    width: "100%",
    top: "67%",
    left: "0",
    bg: "currentColor",
  },
});

const subtotalOpCol = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  paddingLeft: "sm",
  paddingRight: "sm",
  userSelect: "none",
  fontSize: "6xl",
  fontWeight: "100",
});

const BRACKET_WIDTH = "1em";
const BRACKET_INSET = "-4px";
// LedgerRow padding is "sm" (0.5rem); two adjacent rows have a 1rem gap between content areas.
// 100% = height of the bracket cell = height of the subtotal row (both rows are equal height).
// LABEL_ROW_HEIGHT accounts for the "extended cost" annotation row that sits between the two LedgerRows.
// Label rows have zero height; labels are visually offset into the next LedgerRow's padding area.
const BRACKET_BOTTOM = "calc(-1rem - 100% - 4px)";
const BRACKET_LINE_WEIGHT = "2px";
const BRACKET_LINE_STYLE = "solid";
const BRACKET_LINE_COLOR = "currentColor";
// Fixed radius (not 50%) so the curve stays circular when the bracket spans two rows.
const BRACKET_RADIUS = "0.5em";

const BRACKET_BEFORE = {
  content: '""',
  position: "absolute",
  top: BRACKET_INSET,
  bottom: BRACKET_BOTTOM,
  width: BRACKET_WIDTH,
  borderTopWidth: BRACKET_LINE_WEIGHT,
  borderTopStyle: BRACKET_LINE_STYLE,
  borderTopColor: BRACKET_LINE_COLOR,
  borderBottomWidth: BRACKET_LINE_WEIGHT,
  borderBottomStyle: BRACKET_LINE_STYLE,
  borderBottomColor: BRACKET_LINE_COLOR,
} as const;

// Full-height ( bracket: left + top + bottom borders, 50% radius on left corners
const openParenCol = css({
  position: "relative",
  _before: {
    ...BRACKET_BEFORE,
    right: "0",
    borderLeftWidth: BRACKET_LINE_WEIGHT,
    borderLeftStyle: BRACKET_LINE_STYLE,
    borderLeftColor: BRACKET_LINE_COLOR,
    borderTopLeftRadius: BRACKET_RADIUS,
    borderBottomLeftRadius: BRACKET_RADIUS,
  },
});

// Full-height ) bracket: right + top + bottom borders, 50% radius on right corners
const closeParenCol = css({
  position: "relative",
  _before: {
    ...BRACKET_BEFORE,
    left: BRACKET_LINE_WEIGHT,
    borderRightWidth: BRACKET_LINE_WEIGHT,
    borderRightStyle: BRACKET_LINE_STYLE,
    borderRightColor: BRACKET_LINE_COLOR,
    borderTopRightRadius: BRACKET_RADIUS,
    borderBottomRightRadius: BRACKET_RADIUS,
  },
});

const multiplyCol = css({ gridColumn: "span 2" });

const labelRow = css({
  display: "grid",
  paddingLeft: "sm",
  paddingRight: "sm",
  height: "0",
  overflow: "visible",
  alignItems: "start",
});

const itemGroup = css({
  "--lbl-opacity": "0",
  _hover: {
    "--lbl-opacity": "1",
  },
});

const fieldLabel = css({
  fontSize: "0.6rem",
  textTransform: "uppercase",
  userSelect: "none",
  textAlign: "left",
  letterSpacing: "0.06em",
  // push down past LedgerRow padding-top (0.5rem) and bracket top inset (-4px)
  transform: "translateY(0.6rem)",
  pointerEvents: "none",
  opacity: "var(--lbl-opacity)",
  transition: "opacity 0.15s",
});


const opColWithTitle = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
});

export default function ExtendedItem({
  view,
  canRemove,
  showWorking,
  onChangeField,
  onChangeQuantity,
  onChangeTitle,
  onRemove,
}: ExtendedItemProps) {
  const {
    literals,
    quantity,
    fieldErrors,
    quantityError,
    error,
    basePence,
    totalPence,
    quantityInt,
    subtotalDisplay,
    title,
  } = view;

  const quantityWorking =
    showWorking && !error && quantityInt !== null ? quantityInt : undefined;

  const multiplicationWorking =
    showWorking && !error && quantityInt !== null && basePence > 0 ? (
      <>
        {quantityInt} × {basePence}
        <sup className={supDClass}>d</sup> = {totalPence}
        <sup className={supDClass}>d</sup>
      </>
    ) : undefined;

  const errorClass = error ? lineError : undefined;

  return (
    <div className={cx(itemGroup, lineHoverVars)}>
      {/* Annotation row above input fields */}
      <div
        className={cx(labelRow, errorClass)}
        style={{ gridTemplateColumns: COLUMNS }}
      >
        <span style={{ gridColumn: "4" }} className={fieldLabel}>quantity</span>
        <span style={{ gridColumn: "6 / span 3" }} className={fieldLabel}>unit cost</span>
      </div>

      {/* Input row: remove | ( | op | qty | × | l | s | d | ) */}
      <LedgerRow columns={COLUMNS} className={cx(inputRow, errorClass)}>
        <RemoveButton canRemove={canRemove} label="Remove item" onClick={onRemove} />
        <div className={opColWithTitle}>
          <TitleInput value={title} onChange={onChangeTitle} />
          <div className={opMain} />
        </div>
        <span className={openParenCol} aria-hidden="true" />
        <Field
          value={quantity}
          label="q"
          error={quantityError}
          onChange={onChangeQuantity}
          showWorking={showWorking}
          working={quantityWorking}
        />
        <span className={atSign} aria-hidden="true">
          <span className={mulSymbol} />
        </span>
        <LsdFieldGroup
          values={literals}
          fieldErrors={fieldErrors}
          showWorking={showWorking}
          hasError={error}
          onChange={onChangeField}
        />
        <span className={closeParenCol} aria-hidden="true" />
      </LedgerRow>

      {/* Annotation row above subtotal fields */}
      <div
        className={cx(labelRow, errorClass)}
        style={{ gridTemplateColumns: COLUMNS }}
      >
        <span style={{ gridColumn: "6 / span 3" }} className={fieldLabel}>extended cost</span>
      </div>

      {/* Subtotal row: title | working(span 2) | = | l | s | d | empty */}
      <LedgerRow columns={COLUMNS} className={errorClass}>
        <TitleInput
          value={title}
          onChange={onChangeTitle}
          style={{ minWidth: "8em", fontStyle: "normal" }}
        />
        <Field
          value={"\u00A0"}
          label="q"
          noBorder
          showWorking={showWorking}
          working={multiplicationWorking}
          className={multiplyCol}
        />
        <div className={subtotalOpCol}>
          <span className={eqSymbol} aria-hidden="true" />
        </div>
        <LsdFieldGroup
          values={subtotalDisplay}
          showWorking={showWorking}
          hasError={error}
          noBorder
        />
        <span />
      </LedgerRow>
    </div>
  );
}
