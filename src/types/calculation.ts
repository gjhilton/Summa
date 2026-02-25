export type LsdStrings = { l: string; s: string; d: string };

export type LsdBooleans = { l: boolean; s: boolean; d: boolean };

export interface LineState {
  id: string;
  error: boolean;
  fieldErrors: LsdBooleans;
  literals: LsdStrings;
  totalPence: number;
}

export interface ItemWithQuantityState {
  id: string;
  error: boolean;
  fieldErrors: LsdBooleans;
  quantityError: boolean;
  literals: LsdStrings;
  quantity: string;
  basePence: number;
  totalPence: number;
}

export type AnyLineState = LineState | ItemWithQuantityState;

export function isItemWithQuantity(
  line: AnyLineState,
): line is ItemWithQuantityState {
  return "quantity" in line;
}

export interface CalculationState {
  lines: AnyLineState[];
  totalPence: number;
  totalDisplay: LsdStrings;
}
