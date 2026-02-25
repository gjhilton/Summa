import { css, cx } from "../generated/css";
import { ItemWithQuantityState } from "../types/calculation";
import { formatLsdDisplay } from "../state/calculationLogic";
import { normalizeEarlyModernInput } from "../utils/earlyModern";
import { isValidRoman, romanToInteger } from "../utils/roman";
import Field from "./Field";
import Button from "./Button";
import Icon from "./Icon";
import LedgerRow from "./LedgerRow";
import LsdFieldGroup from "./LsdFieldGroup";
import { hidden, lineError } from "../styles/shared";

interface ItemWithQuantityProps {
  line: ItemWithQuantityState;
  canRemove: boolean;
  showWorking: boolean;
  onChangeField: (f: "l" | "s" | "d", v: string) => void;
  onChangeQuantity: (v: string) => void;
  onRemove: () => void;
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
  paddingLeft: "xs",
  paddingRight: "xs",
  fontSize: "6xl",
  fontWeight: "100",
  userSelect: "none",
});

const mulSymbol = css({
  display: "inline-block",
  position: "relative",
  width: "0.5em",
  height: "0.5em",
  transform: "rotate(45deg)",
  _before: {
    content: '""',
    position: "absolute",
    width: "1px",
    height: "100%",
    left: "50%",
    top: "0",
    transform: "translateX(-50%)",
    bg: "currentColor",
  },
  _after: {
    content: '""',
    position: "absolute",
    height: "1px",
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
  _before: {
    content: '""',
    position: "absolute",
    height: "1px",
    width: "100%",
    top: "33%",
    left: "0",
    bg: "currentColor",
  },
  _after: {
    content: '""',
    position: "absolute",
    height: "1px",
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
  paddingLeft: "xs",
  paddingRight: "xs",
  userSelect: "none",
  fontSize: "6xl",
  fontWeight: "100",
});

const BRACKET_WIDTH = "1em";
const BRACKET_INSET = "-4px";
// LedgerRow padding is "sm" (0.5rem); two adjacent rows have a 1rem gap between content areas.
// 100% = height of the bracket cell = height of the subtotal row (both rows are equal height).
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

const multiplyCol = css({ gridColumn: "span 3" });

const supD = css({ marginLeft: "2px" });

export default function ItemWithQuantity({
  line,
  canRemove,
  showWorking,
  onChangeField,
  onChangeQuantity,
  onRemove,
}: ItemWithQuantityProps) {
  const {
    literals,
    quantity,
    fieldErrors,
    quantityError,
    error,
    basePence,
    totalPence,
  } = line;

  const qNorm = normalizeEarlyModernInput(quantity);
  const quantityInt =
    !quantityError && isValidRoman(qNorm) ? romanToInteger(qNorm) : null;

  const subtotalDisplay = formatLsdDisplay(totalPence);

  const quantityWorking =
    showWorking && !error && quantityInt !== null ? quantityInt : undefined;

  const multiplicationWorking =
    showWorking && !error && quantityInt !== null && basePence > 0 ? (
      <>
        {quantityInt} × {basePence}
        <sup className={supD}>d</sup> = {totalPence}
        <sup className={supD}>d</sup>
      </>
    ) : undefined;

  const errorClass = error ? lineError : undefined;

  return (
    <>
      {/* Input row: remove | ( | op | qty | × | l | s | d | ) */}
      <LedgerRow columns={COLUMNS} className={cx(inputRow, errorClass)}>
        <Button
          variant="icon"
          aria-label="Remove item"
          className={canRemove ? undefined : hidden}
          onClick={onRemove}
        >
          <Icon icon="cross" />
        </Button>
        <div className={opMain} />
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

      {/* Subtotal row: empty | working(span 3) | = | l | s | d | empty */}
      <LedgerRow columns={COLUMNS} className={errorClass}>
        <span />
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
          fmtZero
        />
        <span />
      </LedgerRow>
    </>
  );
}
