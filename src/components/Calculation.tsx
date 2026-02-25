import { css } from "../generated/css";
import {
  AnyLineState,
  LsdStrings,
  isItemWithQuantity,
} from "../types/calculation";
import Item from "./Item";
import ItemWithQuantity from "./ItemWithQuantity";
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
  onAddLine: () => void;
  onAddItemWithQuantity: () => void;
  onRemoveLine: (id: string) => void;
  onReset: () => void;
  useItemWithQuantity: boolean;
}

const layout = css({ display: "flex", flexDirection: "column", gap: "xs" });
const addBar = css({ marginTop: "lg", display: "flex", gap: "sm" });
const bottomBar = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: "lg",
});

export default function Calculation({
  lines,
  totalDisplay,
  totalPence,
  showWorking,
  onShowWorkingChange,
  onUpdateField,
  onUpdateQuantity,
  onAddLine,
  onAddItemWithQuantity,
  onRemoveLine,
  onReset,
  useItemWithQuantity,
}: CalculationProps) {
  return (
    <div className={layout}>
      {lines.map((line, i) =>
        isItemWithQuantity(line) ? (
          <ItemWithQuantity
            key={line.id}
            line={line}
            canRemove={lines.length > 2}
            showWorking={showWorking}
            onChangeField={(f, v) => onUpdateField(line.id, f, v)}
            onChangeQuantity={(v) => onUpdateQuantity(line.id, v)}
            onRemove={() => onRemoveLine(line.id)}
          />
        ) : (
          <Item
            key={line.id}
            literals={line.literals}
            error={line.error}
            fieldErrors={line.fieldErrors}
            canRemove={lines.length > 2}
            showOp={i > 0}
            showWorking={showWorking}
            totalPence={line.totalPence}
            onChangeField={(f, v) => onUpdateField(line.id, f, v)}
            onRemove={() => onRemoveLine(line.id)}
          />
        ),
      )}
      <div className={addBar}>
        <Button onClick={onAddLine}>Add item</Button>
        {useItemWithQuantity && (
          <Button onClick={onAddItemWithQuantity}>
            Add item with quantity
          </Button>
        )}
      </div>
      <Total
        display={totalDisplay}
        totalPence={totalPence}
        showWorking={showWorking}
      />
      <div className={bottomBar}>
        <Toggle
          id="show-working"
          label="Show working"
          checked={showWorking}
          onChange={onShowWorkingChange}
        />
        <Button onClick={() => window.confirm("Reset all lines?") && onReset()}>
          Clear
        </Button>
      </div>
    </div>
  );
}
