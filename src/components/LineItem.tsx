import { css, cx } from "../generated/css";
import { LineItemView, BaseLineItemProps } from "../types/lineView";
import { lineError, lineHoverVars } from "../styles/shared";
import TitleInput from "./TitleInput";
import RemoveButton from "./RemoveButton";
import PenceWorkingRow from "./PenceWorkingRow";
import CurrencyFields from "./CurrencyFields";
import ItemRow from "./ItemRow";

interface LineItemProps extends BaseLineItemProps {
  view: LineItemView;
}

const opCol = css({
  display: "flex",
  flexDirection: "column",
  paddingLeft: "sm",
  paddingRight: "sm",
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
    <ItemRow
      className={cx(lineHoverVars, error ? lineError : undefined)}
      remove={<RemoveButton canRemove={canRemove} label="Remove line" onClick={onRemove} />}
      title={
        <div className={opCol}>
          <TitleInput value={title} onChange={onChangeTitle} />
          <div className={opMain} />
          <PenceWorkingRow showWorking={showWorking} pence={totalPence} error={error} />
        </div>
      }
      currency={
        <CurrencyFields
          values={literals}
          fieldErrors={fieldErrors}
          showWorking={showWorking}
          hasError={error}
          onChange={onChangeField}
        />
      }
    />
  );
}
