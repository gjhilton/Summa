import { ItemType, LsdStrings, LsdBooleans } from "./calculation";

interface BaseLineView {
  id: string;
  itemType: ItemType;
  error: boolean;
  fieldErrors: LsdBooleans;
  literals: LsdStrings;
  totalPence: number;
}

export interface LineItemView extends BaseLineView {
  itemType: ItemType.LINE_ITEM;
  showOp: boolean;
}

export interface ExtendedItemView extends BaseLineView {
  itemType: ItemType.EXTENDED_ITEM;
  quantity: string;
  quantityError: boolean;
  quantityInt: number | null; // null = invalid/empty
  basePence: number;
  subtotalDisplay: LsdStrings; // zeros already blanked
}

export type AnyLineView = LineItemView | ExtendedItemView;

export interface BaseLineItemProps {
  canRemove: boolean;
  showWorking: boolean;
  onChangeField: (f: "l" | "s" | "d", v: string) => void;
  onRemove: () => void;
}
