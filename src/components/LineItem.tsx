import { css, cx } from "../generated/css";
import { LineItemView, BaseLineItemProps } from "../types/lineView";
import { lineError, lineHoverVars } from "../styles/shared";
import TitleInput from "./TitleInput";
import RemoveButton from "./RemoveButton";
import PenceWorkingRow from "./PenceWorkingRow";
import LedgerRow from "./LedgerRow";
import CurrencyFields from "./CurrencyFields";

interface LineItemProps extends BaseLineItemProps {
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

export default function LineItem({
  view,
  canRemove,
  showWorking,
  onChangeField,
  onChangeTitle,
  onRemove,
}: LineItemProps) {
  const { literals, error, fieldErrors, totalPence, title } = view;
  return (
    <LedgerRow className={cx(lineHoverVars, error ? lineError : undefined)}>
      <RemoveButton canRemove={canRemove} label="Remove line" onClick={onRemove} />
      <span />
      <div className={opCol}>
        <TitleInput value={title} onChange={onChangeTitle} />
        <div className={opMain} />
        <PenceWorkingRow showWorking={showWorking} pence={totalPence} error={error} />
      </div>
      <CurrencyFields
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
