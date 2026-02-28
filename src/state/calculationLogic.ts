import {
  LsdStrings,
  LsdBooleans,
  LineState,
  ExtendedItemState,
  SubtotalItemState,
  AnyLineState,
  CalculationState,
  ItemType,
  isExtendedItem,
  isSubtotalItem,
} from "../types/calculation";
import {
  normalizeEarlyModernInput,
  formatEarlyModernOutput,
} from "../utils/earlyModern";
import { isValidRoman, romanToInteger, integerToRoman } from "../utils/roman";
import { penceToLsd } from "../utils/currency";

const PENCE_MULTIPLIERS = { l: 240, s: 12, d: 1 } as const;

function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback for non-secure HTTP contexts (e.g. LAN dev access over plain HTTP)
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function emptyLine(): LineState {
  return {
    id: generateId(),
    itemType: ItemType.LINE_ITEM,
    title: "",
    error: false,
    fieldErrors: { l: false, s: false, d: false },
    literals: { l: "", s: "", d: "" },
    totalPence: 0,
  };
}

export function emptyExtendedItem(): ExtendedItemState {
  return {
    id: generateId(),
    itemType: ItemType.EXTENDED_ITEM,
    title: "",
    error: false,
    fieldErrors: { l: false, s: false, d: false },
    quantityError: false,
    literals: { l: "", s: "", d: "" },
    quantity: "j",
    basePence: 0,
    totalPence: 0,
  };
}

export function emptySubtotalItem(): SubtotalItemState {
  const lines: AnyLineState[] = [emptyLine(), emptyLine()];
  const { totalPence, totalDisplay } = computeGrandTotal(lines);
  return {
    id: generateId(),
    itemType: ItemType.SUBTOTAL_ITEM,
    title: "",
    lines,
    totalPence,
    totalDisplay,
    error: false,
  };
}

export function recomputeSubtotal(item: SubtotalItemState): SubtotalItemState {
  const error = item.lines.some((l) => l.error);
  const { totalPence, totalDisplay } = computeGrandTotal(item.lines);
  return { ...item, error, totalPence, totalDisplay };
}

export type IdPath = string[];

/**
 * Return the lines array at the given path depth.
 */
export function getLinesAtPath(
  rootLines: AnyLineState[],
  path: IdPath,
): AnyLineState[] {
  let current = rootLines;
  for (const id of path) {
    const item = current.find((l) => l.id === id);
    if (!item || !isSubtotalItem(item)) return current;
    current = item.lines;
  }
  return current;
}

/**
 * Immutably apply updater at path depth, recomputing each SubtotalItemState
 * on the way back up.
 */
export function updateLinesAtPath(
  rootLines: AnyLineState[],
  path: IdPath,
  updater: (lines: AnyLineState[]) => AnyLineState[],
): AnyLineState[] {
  if (path.length === 0) return updater(rootLines);
  const [head, ...rest] = path;
  return rootLines.map((line) => {
    if (line.id !== head || !isSubtotalItem(line)) return line;
    const newLines = updateLinesAtPath(line.lines, rest, updater);
    return recomputeSubtotal({ ...line, lines: newLines });
  });
}

/**
 * Breadcrumb data for each path level.
 * crumbs[0] = { id: "", title: "Summa", path: [] } (root)
 */
export function getBreadcrumbs(
  rootLines: AnyLineState[],
  path: IdPath,
): Array<{ id: string; title: string; path: IdPath }> {
  const crumbs: Array<{ id: string; title: string; path: IdPath }> = [
    { id: "", title: "Summa totalis", path: [] },
  ];
  let currentLines = rootLines;
  for (let i = 0; i < path.length; i++) {
    const id = path[i];
    const item = currentLines.find((l) => l.id === id);
    if (!item || !isSubtotalItem(item)) break;
    crumbs.push({
      id,
      title: item.title || "Untitled",
      path: path.slice(0, i + 1),
    });
    currentLines = item.lines;
  }
  return crumbs;
}

/** Immutably update the title of the matching line (works for all 3 item types) */
export function updateTitle(
  lines: AnyLineState[],
  lineId: string,
  value: string,
): AnyLineState[] {
  return lines.map((line) => {
    if (line.id !== lineId) return line;
    return { ...line, title: value };
  });
}

/**
 * Format a non-negative integer for the total display.
 * Returns '0' for zero, otherwise applies early modern formatting.
 */
export function formatComponent(value: number): string {
  if (value === 0) return "0";
  return formatEarlyModernOutput(integerToRoman(value));
}

export function formatLsdDisplay(pence: number): LsdStrings {
  const { l, s, d } = penceToLsd(pence);
  return { l: formatComponent(l), s: formatComponent(s), d: formatComponent(d) };
}

/**
 * Compute grand total from all non-error lines, return updated totalPence and totalDisplay.
 */
export function computeGrandTotal(lines: AnyLineState[]): {
  totalPence: number;
  totalDisplay: LsdStrings;
} {
  const totalPence = lines
    .filter((line) => !line.error)
    .reduce((sum, line) => sum + line.totalPence, 0);
  return { totalPence, totalDisplay: formatLsdDisplay(totalPence) };
}

export function computeLinePence(literals: LsdStrings): {
  totalPence: number;
  error: boolean;
  fieldErrors: LsdBooleans;
} {
  let totalPence = 0;
  const fieldErrors: LsdBooleans = { l: false, s: false, d: false };
  for (const field of ["l", "s", "d"] as const) {
    const value = literals[field];
    if (!value) continue;
    const norm = normalizeEarlyModernInput(value);
    if (!isValidRoman(norm)) {
      fieldErrors[field] = true;
    } else {
      totalPence += romanToInteger(norm) * PENCE_MULTIPLIERS[field];
    }
  }
  const error = fieldErrors.l || fieldErrors.s || fieldErrors.d;
  return { totalPence: error ? 0 : totalPence, error, fieldErrors };
}

function computeExtendedItemPence(
  literals: LsdStrings,
  quantity: string,
): {
  basePence: number;
  totalPence: number;
  error: boolean;
  fieldErrors: LsdBooleans;
  quantityError: boolean;
} {
  const {
    totalPence: basePence,
    error: lsdError,
    fieldErrors,
  } = computeLinePence(literals);
  const qNorm = normalizeEarlyModernInput(quantity);
  const quantityError = !quantity || !isValidRoman(qNorm);
  const quantityInt = quantityError ? 0 : romanToInteger(qNorm);
  const error = lsdError || quantityError;
  const totalPence = error ? 0 : basePence * quantityInt;
  return {
    basePence: lsdError ? 0 : basePence,
    totalPence,
    error,
    fieldErrors,
    quantityError,
  };
}

function updateLine(
  line: LineState,
  field: "l" | "s" | "d",
  value: string,
): LineState {
  const literals = { ...line.literals, [field]: value };
  const { totalPence, error, fieldErrors } = computeLinePence(literals);
  return { ...line, literals, totalPence, error, fieldErrors };
}

export function updateExtendedItemField(
  line: ExtendedItemState,
  field: "l" | "s" | "d",
  value: string,
): ExtendedItemState {
  const literals = { ...line.literals, [field]: value };
  const { basePence, totalPence, error, fieldErrors, quantityError } =
    computeExtendedItemPence(literals, line.quantity);
  return {
    ...line,
    literals,
    basePence,
    totalPence,
    error,
    fieldErrors,
    quantityError,
  };
}

export function updateExtendedItemQuantity(
  line: ExtendedItemState,
  value: string,
): ExtendedItemState {
  const { basePence, totalPence, error, fieldErrors, quantityError } =
    computeExtendedItemPence(line.literals, value);
  return {
    ...line,
    quantity: value,
    basePence,
    totalPence,
    error,
    fieldErrors,
    quantityError,
  };
}

/**
 * Apply a field update to the matching line in the array and recompute everything.
 */
export function processFieldUpdate(
  lines: AnyLineState[],
  lineId: string,
  field: "l" | "s" | "d",
  value: string,
): AnyLineState[] {
  return lines.map((line) => {
    if (line.id !== lineId) return line;
    if (isSubtotalItem(line)) return line;
    return isExtendedItem(line)
      ? updateExtendedItemField(line, field, value)
      : updateLine(line, field, value);
  });
}

export function processQuantityUpdate(
  lines: AnyLineState[],
  lineId: string,
  value: string,
): AnyLineState[] {
  return lines.map((line) =>
    line.id === lineId && isExtendedItem(line)
      ? updateExtendedItemQuantity(line, value)
      : line,
  );
}

export function withNewLines(
  prev: CalculationState,
  lines: AnyLineState[],
): CalculationState {
  const { totalPence, totalDisplay } = computeGrandTotal(lines);
  return { ...prev, lines, totalPence, totalDisplay };
}

/**
 * For "show working" mode: returns the text prefix and pence value separately
 * so the caller can render the 'd' as a superscript.
 * e.g. { prefix: "4 × 12 = ", pence: 48 }. Returns null for empty or invalid input.
 */
export function computeFieldWorking(
  value: string,
  field: "l" | "s" | "d",
): { prefix: string; pence: number } | null {
  if (!value) return null;
  const norm = normalizeEarlyModernInput(value);
  if (!isValidRoman(norm)) return null;
  const integer = romanToInteger(norm);
  const multiplier = PENCE_MULTIPLIERS[field];
  const pence = integer * multiplier;
  const prefix = multiplier === 1 ? "" : `${integer} × ${multiplier} = `;
  return { prefix, pence };
}

export function initialState(): CalculationState {
  const lines = [emptyLine(), emptyLine()];
  const { totalPence, totalDisplay } = computeGrandTotal(lines);
  return { lines, totalPence, totalDisplay };
}
