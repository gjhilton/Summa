import { css, cx } from "../generated/css";
import { LineItemView, BaseLineItemProps } from "../types/lineView";
import { lineError, lineHoverVars } from "../styles/shared";
import TitleInput from "./TitleInput";
import RemoveButton from "./RemoveButton";
import PenceWorkingRow from "./PenceWorkingRow";
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



export default function Item({
  view,
  canRemove,
  showWorking,
  onChangeField,
  onChangeTitle,
  onRemove,
}: ItemProps) {
  const { literals, error, fieldErrors, totalPence, showOp, title } = view;
  return (
    <LedgerRow className={cx(lineHoverVars, error ? lineError : undefined)}>
      <RemoveButton canRemove={canRemove} label="Remove line" onClick={onRemove} />
      <span />
      <div className={opCol}>
        <TitleInput value={title} onChange={onChangeTitle} />
        <div className={opMain}>
          {!showWorking && showOp && (
            <span className={opCross} aria-hidden="true" />
          )}
        </div>
        <PenceWorkingRow showWorking={showWorking} pence={totalPence} error={error} />
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
