import { css } from "../generated/css";
import { AnyLineState, ItemType, LsdStrings } from "../types/calculation";
import { toLineView } from "../state/displayLogic";
import LineItem from "./LineItem";
import ExtendedItem from "./ExtendedItem";
import SubtotalItem from "./SubtotalItem";
import TotalRow from "./TotalRow";
import Button from "./Button";
import Toggle from "./Toggle";
import SortableItem from "./SortableItem";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";

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
  onReorderLines: (oldIndex: number, newIndex: number) => void;
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
  onReorderLines,
  onReset,
  onEditSubtotalItem,
  useExtendedItem,
  onUseExtendedItemChange,
  advancedOptionsDisabled = false,
}: CalculationProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = lines.findIndex((l) => l.id === active.id);
      const newIndex = lines.findIndex((l) => l.id === over.id);
      onReorderLines(oldIndex, newIndex);
    }
  }

  const views = lines.map((line) => toLineView(line));
  const ids = lines.map((l) => l.id);

  return (
    <div className={layout}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          {views.map((view) => {
            if (view.itemType === ItemType.SUBTOTAL_ITEM) {
              return (
                <SortableItem key={view.id} id={view.id}>
                  <SubtotalItem
                    view={view}
                    canRemove={lines.length > 2}
                    showWorking={showWorking}
                    onEdit={() => onEditSubtotalItem(view.id)}
                    onRemove={() => onRemoveLine(view.id)}
                    onChangeTitle={(v) => onUpdateTitle(view.id, v)}
                  />
                </SortableItem>
              );
            }
            if (view.itemType === ItemType.EXTENDED_ITEM) {
              return (
                <SortableItem key={view.id} id={view.id}>
                  <ExtendedItem
                    view={view}
                    canRemove={lines.length > 2}
                    showWorking={showWorking}
                    onChangeField={(f, v) => onUpdateField(view.id, f, v)}
                    onChangeQuantity={(v) => onUpdateQuantity(view.id, v)}
                    onRemove={() => onRemoveLine(view.id)}
                    onChangeTitle={(v) => onUpdateTitle(view.id, v)}
                  />
                </SortableItem>
              );
            }
            return (
              <SortableItem key={view.id} id={view.id}>
                <LineItem
                  view={view}
                  canRemove={lines.length > 2}
                  showWorking={showWorking}
                  onChangeField={(f, v) => onUpdateField(view.id, f, v)}
                  onRemove={() => onRemoveLine(view.id)}
                  onChangeTitle={(v) => onUpdateTitle(view.id, v)}
                />
              </SortableItem>
            );
          })}
        </SortableContext>
      </DndContext>
      <div className={addBar}>
        <Button onClick={onAddLine}>New line item</Button>
        {useExtendedItem && (
          <Button onClick={onAddExtendedItem}>New extended item</Button>
        )}
        {useExtendedItem && (
          <Button onClick={onAddSubtotalItem}>New subtotal item</Button>
        )}
      </div>
      <TotalRow
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
