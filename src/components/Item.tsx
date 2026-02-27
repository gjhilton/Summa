import { css, cx } from "../generated/css";
import { LineItemView, BaseLineItemProps } from "../types/lineView";
import { workingRowStyles, hidden, lineError, removeIcon, lineHoverVars } from "../styles/shared";
import Button from "./Button";
import Icon from "./Icon";
import LedgerRow from "./LedgerRow";
import LsdFieldGroup from "./LsdFieldGroup";

interface ItemProps extends BaseLineItemProps {
  view: LineItemView;
}

const opCol = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  paddingLeft: "sm",
  paddingRight: "sm",
  userSelect: "none",
  gap: "xs",
});

const opMain = css({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  fontSize: "6xl",
  fontWeight: "100",
});

const opWorkingRow = css({
  ...workingRowStyles,
  whiteSpace: "nowrap",
});

const opCross = css({
  display: "inline-block",
  position: "relative",
  width: "0.5em",
  height: "0.5em",
  _before: {
    content: '""',
    position: "absolute",
    width: "1px",
    height: "100%",
    left: "50%",
    top: "0",
    transform: "translateX(-50%)",
    bg: "transparent",
  },
  _after: {
    content: '""',
    position: "absolute",
    height: "1px",
    width: "100%",
    top: "50%",
    left: "0",
    transform: "translateY(-50%)",
    bg: "transparent",
  },
});

const supD = css({ marginLeft: "2px" }); // pence superscript in op working row

export default function Item({
  view,
  canRemove,
  showWorking,
  onChangeField,
  onRemove,
}: ItemProps) {
  const { literals, error, fieldErrors, totalPence, showOp } = view;
  return (
    <LedgerRow className={cx(lineHoverVars, error ? lineError : undefined)}>
      <Button
        variant="icon"
        aria-label="Remove line"
        className={cx(removeIcon, canRemove ? undefined : hidden)}
        onClick={onRemove}
      >
        <Icon icon="trash" size={16} />
      </Button>
      <span />
      <div className={opCol}>
        <div className={opMain}>
          {!showWorking && showOp && (
            <span className={opCross} aria-hidden="true" />
          )}
        </div>
        {showWorking && (
          <span className={opWorkingRow}>
            {!error && totalPence > 0 && (
              <>
                {totalPence}
                <sup className={supD}>d</sup> =
              </>
            )}
          </span>
        )}
      </div>
      <LsdFieldGroup
        values={literals}
        fieldErrors={fieldErrors}
        showWorking={showWorking}
        hasError={error}
        onChange={onChangeField}
      />
      <span />
    </LedgerRow>
  );
}
