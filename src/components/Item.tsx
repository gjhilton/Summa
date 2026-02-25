import { css } from "../generated/css";
import { LsdStrings, LsdBooleans } from "../types/calculation";
import { workingRowStyles, hidden, lineError } from "../styles/shared";
import Button from "./Button";
import Icon from "./Icon";
import LedgerRow from "./LedgerRow";
import LsdFieldGroup from "./LsdFieldGroup";

interface ItemProps {
  literals: LsdStrings;
  error: boolean;
  fieldErrors?: LsdBooleans;
  canRemove: boolean;
  showOp: boolean;
  showWorking: boolean;
  totalPence: number;
  onChangeField: (f: "l" | "s" | "d", v: string) => void;
  onRemove: () => void;
}

const opCol = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  paddingLeft: "xs",
  paddingRight: "xs",
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

const supD = css({ marginLeft: "2px" }); // pence superscript in op working row

export default function Item({
  literals,
  error,
  fieldErrors = { l: false, s: false, d: false },
  canRemove,
  showOp,
  showWorking,
  totalPence,
  onChangeField,
  onRemove,
}: ItemProps) {
  return (
    <LedgerRow className={error ? lineError : undefined}>
      <Button
        variant="icon"
        aria-label="Remove line"
        className={canRemove ? undefined : hidden}
        onClick={onRemove}
      >
        <Icon icon="cross" />
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
