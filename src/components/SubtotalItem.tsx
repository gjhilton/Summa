import { css, cx } from "../generated/css";
import { SubtotalItemView } from "../types/lineView";
import { lineError, lineHoverVars } from "../styles/shared";
import TitleInput from "./TitleInput";
import RemoveButton from "./RemoveButton";
import LedgerRow from "./LedgerRow";
import LsdFieldGroup from "./LsdFieldGroup";
import Button from "./Button";
import Icon from "./Icon";

interface SubtotalItemProps {
  view: SubtotalItemView;
  canRemove: boolean;
  showWorking: boolean;
  onEdit: () => void;
  onRemove: () => void;
  onChangeTitle: (v: string) => void;
}

const subtotalRow = css({
  borderTopWidth: "medium",
  borderTopStyle: "solid",
  borderTopColor: "ink",
  marginTop: "0.5rem",
  paddingTop: "2rem",
});

const titleCol = css({
  display: "flex",
  alignItems: "center",
  gap: "xs",
  paddingLeft: "sm",
  paddingRight: "sm",
});

const titleFlex = css({ flex: "1" });

export default function SubtotalItem({
  view,
  canRemove,
  showWorking,
  onEdit,
  onRemove,
  onChangeTitle,
}: SubtotalItemProps) {
  const { title, totalDisplay, error } = view;
  return (
    <LedgerRow
      className={cx(
        subtotalRow,
        lineHoverVars,
        error ? lineError : undefined,
      )}
    >
      <RemoveButton canRemove={canRemove} label="Remove subtotal" onClick={onRemove} />
      <span />
      <div className={titleCol}>
        <TitleInput value={title} onChange={onChangeTitle} className={titleFlex} />
        <Button variant="icon" aria-label="Edit subtotal" onClick={onEdit}>
          <Icon icon="pencil" size={16} />
        </Button>
      </div>
      <LsdFieldGroup
        values={totalDisplay}
        showWorking={showWorking}
        hasError={error}
        noBorder
        fmtZero
        dimZero
        weightByZero
      />
      <span />
    </LedgerRow>
  );
}
