import { css } from "../generated/css";
import { AnyLineState, ItemType, LsdStrings } from "../types/calculation";
import { toLineView } from "../state/displayLogic";
import Item from "./Item";
import ExtendedItem from "./ExtendedItem";
import SubtotalItem from "./SubtotalItem";
import Total from "./Total";
import Button from "./Button";
import Toggle from "./Toggle";

interface CalculationProps {
  lines: AnyLineState[];
  totalDisplay: LsdStrings;
  totalPence: number;
  showWorking: boolean;
  onShowWorkingChange: (v: boolean) => void;
  onUpdateField: (lineId: string, f: "l" | "s" | "d", v: string) => void;
  onUpdateQuantity: (lineId: string, v: string) => void;
  onUpdateTitle: (lineId: string, v: string) => void;
  onAddLine: () => void;
  onAddExtendedItem: () => void;
  onAddSubtotalItem: () => void;
  onRemoveLine: (id: string) => void;
  onReset: () => void;
  onEditSubtotalItem: (id: string) => void;
  useExtendedItem: boolean;
  onUseExtendedItemChange: (v: boolean) => void;
  advancedOptionsDisabled?: boolean;
}

const layout = css({ display: "flex", flexDirection: "column", gap: "xs" });
const addBar = css({ marginTop: "lg", display: "flex", gap: "sm", justifyContent: "flex-end" });
const rowCountBar = css({ textAlign: "right", marginTop: "lg", fontSize: "m" });
const bottomBar = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: "xs",
});

const toggleStack = css({ display: "flex", flexDirection: "column", gap: "xs" });

export default function Calculation({
  lines,
  totalDisplay,
  totalPence,
  showWorking,
  onShowWorkingChange,
  onUpdateField,
  onUpdateQuantity,
  onUpdateTitle,
  onAddLine,
  onAddExtendedItem,
  onAddSubtotalItem,
  onRemoveLine,
  onReset,
  onEditSubtotalItem,
  useExtendedItem,
  onUseExtendedItemChange,
  advancedOptionsDisabled = false,
}: CalculationProps) {
  const views = lines.map((line, i) => toLineView(line, i > 0));
  return (
    <div className={layout}>
      {views.map((view) => {
        if (view.itemType === ItemType.SUBTOTAL_ITEM) {
          return (
            <SubtotalItem
              key={view.id}
              view={view}
              canRemove={lines.length > 2}
              showWorking={showWorking}
              onEdit={() => onEditSubtotalItem(view.id)}
              onRemove={() => onRemoveLine(view.id)}
              onChangeTitle={(v) => onUpdateTitle(view.id, v)}
            />
          );
        }
        if (view.itemType === ItemType.EXTENDED_ITEM) {
          return (
            <ExtendedItem
              key={view.id}
              view={view}
              canRemove={lines.length > 2}
              showWorking={showWorking}
              onChangeField={(f, v) => onUpdateField(view.id, f, v)}
              onChangeQuantity={(v) => onUpdateQuantity(view.id, v)}
              onRemove={() => onRemoveLine(view.id)}
              onChangeTitle={(v) => onUpdateTitle(view.id, v)}
            />
          );
        }
        return (
          <Item
            key={view.id}
            view={view}
            canRemove={lines.length > 2}
            showWorking={showWorking}
            onChangeField={(f, v) => onUpdateField(view.id, f, v)}
            onRemove={() => onRemoveLine(view.id)}
            onChangeTitle={(v) => onUpdateTitle(view.id, v)}
          />
        );
      })}
      <div className={addBar}>
        <Button onClick={onAddLine}>New line item</Button>
        {useExtendedItem && (
          <Button onClick={onAddExtendedItem}>
            New extended item
          </Button>
        )}
        {useExtendedItem && (
          <Button onClick={onAddSubtotalItem}>
            New subtotal item
          </Button>
        )}
      </div>
      <Total
        display={totalDisplay}
        totalPence={totalPence}
        showWorking={showWorking}
      />
      <div className={rowCountBar}>Total items: {lines.length}</div>
      <div className={bottomBar}>
        <div className={toggleStack}>
          <Toggle
            id="show-working"
            label="Show working"
            checked={showWorking}
            onChange={onShowWorkingChange}
          />
          <Toggle
            id="advanced-options"
            label="Advanced options"
            checked={useExtendedItem}
            onChange={onUseExtendedItemChange}
            disabled={advancedOptionsDisabled}
          />
        </div>
        <Button onClick={() => window.confirm("Reset all lines?") && onReset()}>
          Clear
        </Button>
      </div>
    </div>
  );
}
