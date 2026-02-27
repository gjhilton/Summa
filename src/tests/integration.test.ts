import { describe, it, expect } from "vitest";
import {
  emptyLine,
  emptyExtendedItem,
  processFieldUpdate,
  processQuantityUpdate,
  computeGrandTotal,
  initialState,
} from "../state/calculationLogic";
import { AnyLineState, isExtendedItem } from "../types/calculation";

function applyUpdates(
  lines: AnyLineState[],
  updates: { lineIndex: number; field: "l" | "s" | "d"; value: string }[],
): AnyLineState[] {
  let result = lines;
  for (const { lineIndex, field, value } of updates) {
    result = processFieldUpdate(result, result[lineIndex].id, field, value);
  }
  return result;
}

describe("initialState", () => {
  it("starts with exactly 2 lines", () => {
    const state = initialState();
    expect(state.lines).toHaveLength(2);
  });

  it("starts with totalPence = 0", () => {
    const state = initialState();
    expect(state.totalPence).toBe(0);
  });

  it("starts with totalDisplay all 0", () => {
    const state = initialState();
    expect(state.totalDisplay).toEqual({ l: "0", s: "0", d: "0" });
  });
});

describe("multi-line summation", () => {
  it("sums two lines with penny values", () => {
    const state = initialState();
    // Line 0: 0/0/3d, Line 1: 0/0/5d → total 8d
    const lines = applyUpdates(state.lines, [
      { lineIndex: 0, field: "d", value: "iii" },
      { lineIndex: 1, field: "d", value: "v" },
    ]);
    const { totalPence } = computeGrandTotal(lines);
    expect(totalPence).toBe(8);
  });

  it("sums two lines with shilling values", () => {
    const state = initialState();
    // 5s + 7s = 12s = 0l 12s 0d
    const lines = applyUpdates(state.lines, [
      { lineIndex: 0, field: "s", value: "v" },
      { lineIndex: 1, field: "s", value: "vii" },
    ]);
    const { totalPence, totalDisplay } = computeGrandTotal(lines);
    expect(totalPence).toBe(144); // 12 shillings = 144 pence
    expect(totalDisplay.l).toBe("0");
    expect(totalDisplay.s).toBe("xij"); // 12s in early modern
    expect(totalDisplay.d).toBe("0");
  });

  it("sums pound, shilling, pence across two lines", () => {
    const state = initialState();
    // Line 0: 1/0/0, Line 1: 0/1/0 → 1l 1s 0d = 252 pence
    const lines = applyUpdates(state.lines, [
      { lineIndex: 0, field: "l", value: "i" },
      { lineIndex: 1, field: "s", value: "i" },
    ]);
    const { totalPence } = computeGrandTotal(lines);
    expect(totalPence).toBe(252);
  });

  it("12d carries to 1s", () => {
    const state = initialState();
    // 6d + 6d = 12d = 1s 0d
    const lines = applyUpdates(state.lines, [
      { lineIndex: 0, field: "d", value: "vi" },
      { lineIndex: 1, field: "d", value: "vi" },
    ]);
    const { totalDisplay } = computeGrandTotal(lines);
    expect(totalDisplay.s).toBe("j");
    expect(totalDisplay.d).toBe("0");
  });

  it("20s carries to 1l", () => {
    const state = initialState();
    // 10s + 10s = 20s = 1l
    const lines = applyUpdates(state.lines, [
      { lineIndex: 0, field: "s", value: "x" },
      { lineIndex: 1, field: "s", value: "x" },
    ]);
    const { totalDisplay } = computeGrandTotal(lines);
    expect(totalDisplay.l).toBe("j");
    expect(totalDisplay.s).toBe("0");
  });
});

describe("line removal", () => {
  it("recalculates total after removing a line", () => {
    const state = initialState();
    let lines = applyUpdates(state.lines, [
      { lineIndex: 0, field: "d", value: "iii" },
      { lineIndex: 1, field: "d", value: "v" },
    ]);
    // Remove line 0 (3d) → only 5d remains
    const lineToRemove = lines[0].id;
    lines = lines.filter((l) => l.id !== lineToRemove);
    const { totalPence } = computeGrandTotal(lines);
    expect(totalPence).toBe(5);
  });
});

describe("reset behaviour", () => {
  it("reset returns exactly 2 empty lines", () => {
    const reset = initialState();
    expect(reset.lines).toHaveLength(2);
    expect(reset.lines[0].literals).toEqual({ l: "", s: "", d: "" });
    expect(reset.lines[1].literals).toEqual({ l: "", s: "", d: "" });
  });

  it("reset total is 0", () => {
    const reset = initialState();
    expect(reset.totalPence).toBe(0);
  });
});

describe("error line exclusion", () => {
  it("error line pence are excluded from total", () => {
    const state = initialState();
    // Set line 0 to valid 3d
    let lines = applyUpdates(state.lines, [
      { lineIndex: 0, field: "d", value: "iii" },
    ]);
    // Force line 1 into error state by entering invalid roman
    lines = processFieldUpdate(lines, lines[1].id, "d", "zz");
    expect(lines[1].error).toBe(true);

    const { totalPence } = computeGrandTotal(lines);
    // Only line 0's 3d should count
    expect(totalPence).toBe(3);
  });
});

describe("empty field handling", () => {
  it("empty string is treated as 0 without error", () => {
    const line = emptyLine();
    const lines = [line, emptyLine()];
    // Update to a value then clear it
    let updated = processFieldUpdate(lines, line.id, "d", "v");
    updated = processFieldUpdate(updated, line.id, "d", "");
    expect(updated[0].error).toBe(false);
    expect(updated[0].totalPence).toBe(0);
  });

  it("all empty fields sum to 0 pence", () => {
    const state = initialState();
    const { totalPence } = computeGrandTotal(state.lines);
    expect(totalPence).toBe(0);
  });
});

describe("boundary values", () => {
  it("correctly handles additive form iiii = 4d", () => {
    const state = initialState();
    const lines = applyUpdates(state.lines, [
      { lineIndex: 0, field: "d", value: "iiii" },
    ]);
    expect(lines[0].totalPence).toBe(4);
  });

  it("correctly handles early modern form iiij = 4d via normalization", () => {
    const state = initialState();
    const lines = applyUpdates(state.lines, [
      { lineIndex: 0, field: "d", value: "iiij" },
    ]);
    expect(lines[0].totalPence).toBe(4);
  });

  it("correctly handles u → v normalization", () => {
    const state = initialState();
    const lines = applyUpdates(state.lines, [
      { lineIndex: 0, field: "d", value: "uiii" }, // = viii = 8
    ]);
    expect(lines[0].totalPence).toBe(8);
    expect(lines[0].error).toBe(false);
  });
});

describe("ExtendedItem logic", () => {
  it("emptyExtendedItem has correct shape", () => {
    const item = emptyExtendedItem();
    expect(item.id).toBeTruthy();
    expect(item.quantity).toBe("j");
    expect(item.basePence).toBe(0);
    expect(item.totalPence).toBe(0);
    expect(item.error).toBe(false);
    expect(item.quantityError).toBe(false);
    expect(item.fieldErrors).toEqual({ l: false, s: false, d: false });
    expect(item.literals).toEqual({ l: "", s: "", d: "" });
  });

  it("isExtendedItem identifies the type correctly", () => {
    const item = emptyExtendedItem();
    const line = emptyLine();
    expect(isExtendedItem(item)).toBe(true);
    expect(isExtendedItem(line)).toBe(false);
  });

  it("processQuantityUpdate recomputes totalPence", () => {
    const item = emptyExtendedItem();
    // Set price to 5d, quantity to iii (3) → totalPence = 15
    let lines: AnyLineState[] = [item, emptyLine()];
    lines = processFieldUpdate(lines, item.id, "d", "v");
    lines = processQuantityUpdate(lines, item.id, "iii");
    const updated = lines[0];
    expect(isExtendedItem(updated)).toBe(true);
    if (isExtendedItem(updated)) {
      expect(updated.basePence).toBe(5);
      expect(updated.totalPence).toBe(15);
      expect(updated.error).toBe(false);
    }
  });

  it("processFieldUpdate on ExtendedItemState recomputes basePence and totalPence", () => {
    const item = emptyExtendedItem();
    // Set quantity = ii (2), then l/s/d = 0/0/6d → basePence=6, totalPence=12
    let lines: AnyLineState[] = [item, emptyLine()];
    lines = processQuantityUpdate(lines, item.id, "ii");
    lines = processFieldUpdate(lines, item.id, "d", "vi");
    const updated = lines[0];
    expect(isExtendedItem(updated)).toBe(true);
    if (isExtendedItem(updated)) {
      expect(updated.basePence).toBe(6);
      expect(updated.totalPence).toBe(12);
      expect(updated.error).toBe(false);
    }
  });

  it("grand total includes ExtendedItemState.totalPence (multiplied)", () => {
    // item: 5d × 3 = 15d; plain line: 7d → total = 22d
    const item = emptyExtendedItem();
    const line = emptyLine();
    let lines: AnyLineState[] = [item, line];
    lines = processFieldUpdate(lines, item.id, "d", "v");
    lines = processQuantityUpdate(lines, item.id, "iii");
    lines = processFieldUpdate(lines, line.id, "d", "vii");
    const { totalPence } = computeGrandTotal(lines);
    expect(totalPence).toBe(22);
  });

  it("invalid quantity sets error=true and excludes from grand total", () => {
    const item = emptyExtendedItem();
    let lines: AnyLineState[] = [item, emptyLine()];
    lines = processFieldUpdate(lines, item.id, "d", "v");
    lines = processQuantityUpdate(lines, item.id, "zz"); // invalid
    const updated = lines[0];
    expect(isExtendedItem(updated)).toBe(true);
    if (isExtendedItem(updated)) {
      expect(updated.quantityError).toBe(true);
      expect(updated.error).toBe(true);
      expect(updated.totalPence).toBe(0);
    }
    const { totalPence } = computeGrandTotal(lines);
    expect(totalPence).toBe(0);
  });

  it("quantity=i (1) with valid l/s/d → totalPence = basePence", () => {
    const item = emptyExtendedItem(); // quantity defaults to 'i'
    let lines: AnyLineState[] = [item, emptyLine()];
    // Set 1s 6d → basePence = 18
    lines = processFieldUpdate(lines, item.id, "s", "i");
    lines = processFieldUpdate(lines, item.id, "d", "vi");
    const updated = lines[0];
    expect(isExtendedItem(updated)).toBe(true);
    if (isExtendedItem(updated)) {
      expect(updated.basePence).toBe(18);
      expect(updated.totalPence).toBe(18); // 18 × 1
      expect(updated.error).toBe(false);
    }
  });

  it("empty quantity sets quantityError=true", () => {
    const item = emptyExtendedItem();
    let lines: AnyLineState[] = [item, emptyLine()];
    lines = processQuantityUpdate(lines, item.id, "");
    const updated = lines[0];
    expect(isExtendedItem(updated)).toBe(true);
    if (isExtendedItem(updated)) {
      expect(updated.quantityError).toBe(true);
      expect(updated.error).toBe(true);
    }
  });

  it("invalid l/s/d field sets error=true on ExtendedItemState", () => {
    const item = emptyExtendedItem();
    let lines: AnyLineState[] = [item, emptyLine()];
    lines = processFieldUpdate(lines, item.id, "d", "not-roman");
    const updated = lines[0];
    expect(isExtendedItem(updated)).toBe(true);
    if (isExtendedItem(updated)) {
      expect(updated.fieldErrors.d).toBe(true);
      expect(updated.error).toBe(true);
      expect(updated.totalPence).toBe(0);
    }
  });
});
