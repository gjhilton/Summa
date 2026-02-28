import { describe, it, expect } from "vitest";
import {
  emptyLine,
  emptySubtotalItem,
  recomputeSubtotal,
  getLinesAtPath,
  updateLinesAtPath,
  getBreadcrumbs,
  updateTitle,
  processFieldUpdate,
  computeGrandTotal,
} from "../state/calculationLogic";
import {
  AnyLineState,
  ItemType,
  SubtotalItemState,
  isSubtotalItem,
} from "../types/calculation";

describe("emptySubtotalItem", () => {
  it("has correct shape", () => {
    const item = emptySubtotalItem();
    expect(item.itemType).toBe(ItemType.SUBTOTAL_ITEM);
    expect(item.id).toBeTruthy();
    expect(item.title).toBe("");
    expect(item.lines).toHaveLength(2);
    expect(item.totalPence).toBe(0);
    expect(item.error).toBe(false);
  });

  it("lines are empty LineState instances", () => {
    const item = emptySubtotalItem();
    expect(item.lines[0].itemType).toBe(ItemType.LINE_ITEM);
    expect(item.lines[1].itemType).toBe(ItemType.LINE_ITEM);
  });
});

describe("recomputeSubtotal", () => {
  it("recomputes totalPence from children", () => {
    const item = emptySubtotalItem();
    const updatedLines = processFieldUpdate(item.lines, item.lines[0].id, "d", "v");
    const recomputed = recomputeSubtotal({ ...item, lines: updatedLines });
    expect(recomputed.totalPence).toBe(5);
    expect(recomputed.error).toBe(false);
  });

  it("propagates error from any child", () => {
    const item = emptySubtotalItem();
    const updatedLines = processFieldUpdate(item.lines, item.lines[0].id, "d", "zz");
    const recomputed = recomputeSubtotal({ ...item, lines: updatedLines });
    expect(recomputed.error).toBe(true);
    expect(recomputed.totalPence).toBe(0);
  });

  it("excludes error children from its own totalPence but error=true causes parent to exclude it", () => {
    // recomputeSubtotal uses computeGrandTotal which sums non-error children.
    // So totalPence = 3 (the valid 3d child), but error = true (the other child errored).
    // The parent's computeGrandTotal then excludes this subtotal entirely (contributing 0).
    const item = emptySubtotalItem();
    let lines = processFieldUpdate(item.lines, item.lines[0].id, "d", "iii");
    lines = processFieldUpdate(lines, lines[1].id, "d", "zz");
    const recomputed = recomputeSubtotal({ ...item, lines });
    expect(recomputed.error).toBe(true);
    expect(recomputed.totalPence).toBe(3); // non-error child (3d) is counted within the subtotal
  });

  it("totalDisplay is formatted correctly", () => {
    const item = emptySubtotalItem();
    const updatedLines = processFieldUpdate(item.lines, item.lines[0].id, "d", "xij");
    const recomputed = recomputeSubtotal({ ...item, lines: updatedLines });
    expect(recomputed.totalPence).toBe(12);
    expect(recomputed.totalDisplay.s).toBe("j");
    expect(recomputed.totalDisplay.d).toBe("0");
  });
});

describe("getLinesAtPath", () => {
  it("returns rootLines for empty path", () => {
    const lines: AnyLineState[] = [emptyLine(), emptyLine()];
    expect(getLinesAtPath(lines, [])).toBe(lines);
  });

  it("returns sub-lines for one-level path", () => {
    const sub = emptySubtotalItem();
    const root: AnyLineState[] = [emptyLine(), sub];
    const result = getLinesAtPath(root, [sub.id]);
    expect(result).toBe(sub.lines);
  });

  it("returns current level if path id not found", () => {
    const root: AnyLineState[] = [emptyLine(), emptyLine()];
    const result = getLinesAtPath(root, ["nonexistent-id"]);
    expect(result).toBe(root);
  });

  it("navigates two levels deep", () => {
    const innerSub = emptySubtotalItem();
    const outerSub: SubtotalItemState = {
      ...emptySubtotalItem(),
      lines: [innerSub, emptyLine()],
    };
    const root: AnyLineState[] = [outerSub, emptyLine()];
    const result = getLinesAtPath(root, [outerSub.id, innerSub.id]);
    expect(result).toBe(innerSub.lines);
  });
});

describe("updateLinesAtPath", () => {
  it("applies updater at root level for empty path", () => {
    const root: AnyLineState[] = [emptyLine(), emptyLine()];
    const newLine = emptyLine();
    const result = updateLinesAtPath(root, [], (lines) => [...lines, newLine]);
    expect(result).toHaveLength(3);
    expect(result[2]).toBe(newLine);
  });

  it("applies updater at one level deep and recomputes subtotal", () => {
    const sub = emptySubtotalItem();
    const root: AnyLineState[] = [sub, emptyLine()];
    const result = updateLinesAtPath(root, [sub.id], (lines) =>
      processFieldUpdate(lines, lines[0].id, "d", "v"),
    );
    const updatedSub = result[0];
    expect(isSubtotalItem(updatedSub)).toBe(true);
    if (isSubtotalItem(updatedSub)) {
      expect(updatedSub.totalPence).toBe(5);
    }
  });

  it("updates root grand total after deep change", () => {
    const sub = emptySubtotalItem();
    const root: AnyLineState[] = [sub, emptyLine()];
    const updated = updateLinesAtPath(root, [sub.id], (lines) =>
      processFieldUpdate(lines, lines[0].id, "d", "iii"),
    );
    const { totalPence } = computeGrandTotal(updated);
    expect(totalPence).toBe(3);
  });

  it("returns unchanged lines for stale path", () => {
    const root: AnyLineState[] = [emptyLine(), emptyLine()];
    const result = updateLinesAtPath(root, ["nonexistent"], (lines) => {
      // Should never be called for a stale path
      return [...lines, emptyLine()];
    });
    // Stale path: no matching subtotal found, original lines returned unchanged
    expect(result).toHaveLength(2);
  });
});

describe("getBreadcrumbs", () => {
  it("returns root crumb for empty path", () => {
    const lines: AnyLineState[] = [emptyLine()];
    const crumbs = getBreadcrumbs(lines, []);
    expect(crumbs).toHaveLength(1);
    expect(crumbs[0].title).toBe("Summa");
    expect(crumbs[0].path).toEqual([]);
  });

  it("returns two crumbs for one-level path", () => {
    const sub: SubtotalItemState = { ...emptySubtotalItem(), title: "Quarter" };
    const root: AnyLineState[] = [sub, emptyLine()];
    const crumbs = getBreadcrumbs(root, [sub.id]);
    expect(crumbs).toHaveLength(2);
    expect(crumbs[0].title).toBe("Summa");
    expect(crumbs[1].title).toBe("Quarter");
    expect(crumbs[1].path).toEqual([sub.id]);
  });

  it("uses 'Untitled' for subtotal with empty title", () => {
    const sub = emptySubtotalItem(); // title = ""
    const root: AnyLineState[] = [sub];
    const crumbs = getBreadcrumbs(root, [sub.id]);
    expect(crumbs[1].title).toBe("Untitled");
  });

  it("returns three crumbs for two-level path", () => {
    const innerSub: SubtotalItemState = { ...emptySubtotalItem(), title: "Inner" };
    const outerSub: SubtotalItemState = {
      ...emptySubtotalItem(),
      title: "Outer",
      lines: [innerSub, emptyLine()],
    };
    const root: AnyLineState[] = [outerSub, emptyLine()];
    const crumbs = getBreadcrumbs(root, [outerSub.id, innerSub.id]);
    expect(crumbs).toHaveLength(3);
    expect(crumbs[0].title).toBe("Summa");
    expect(crumbs[1].title).toBe("Outer");
    expect(crumbs[2].title).toBe("Inner");
  });
});

describe("updateTitle", () => {
  it("updates title of a matching LineState", () => {
    const line = emptyLine();
    const lines: AnyLineState[] = [line, emptyLine()];
    const result = updateTitle(lines, line.id, "Wages");
    expect(result[0].title).toBe("Wages");
    expect(result[1].title).toBe("");
  });

  it("updates title of a matching SubtotalItemState", () => {
    const sub = emptySubtotalItem();
    const lines: AnyLineState[] = [sub, emptyLine()];
    const result = updateTitle(lines, sub.id, "Quarter total");
    expect(result[0].title).toBe("Quarter total");
  });

  it("leaves non-matching lines unchanged", () => {
    const line0 = emptyLine();
    const line1 = emptyLine();
    const lines: AnyLineState[] = [line0, line1];
    const result = updateTitle(lines, line0.id, "Changed");
    expect(result[0].title).toBe("Changed");
    expect(result[1]).toBe(line1);
  });
});

describe("error propagation upward", () => {
  it("subtotal with errored child contributes 0 to parent total", () => {
    const sub = emptySubtotalItem();
    const subWithError = recomputeSubtotal({
      ...sub,
      lines: processFieldUpdate(sub.lines, sub.lines[0].id, "d", "zz"),
    });
    const rootLine = emptyLine();
    const root: AnyLineState[] = [subWithError, rootLine];
    const updated = processFieldUpdate(root, rootLine.id, "d", "v");
    const { totalPence } = computeGrandTotal(updated);
    // subWithError.error = true, so it contributes 0; rootLine contributes 5d
    expect(totalPence).toBe(5);
  });

  it("subtotal without errors contributes its totalPence to parent total", () => {
    const sub = emptySubtotalItem();
    const subWithValue = recomputeSubtotal({
      ...sub,
      lines: processFieldUpdate(sub.lines, sub.lines[0].id, "d", "iii"),
    });
    const rootLine = emptyLine();
    const root: AnyLineState[] = [subWithValue, rootLine];
    const updated = processFieldUpdate(root, rootLine.id, "d", "v");
    const { totalPence } = computeGrandTotal(updated);
    // subWithValue = 3d, rootLine = 5d → total = 8d
    expect(totalPence).toBe(8);
  });
});
