import { describe, it, expect } from "vitest";
import { penceToLsd } from "../utils/currency";

describe("penceToLsd", () => {
  it("returns all zeros for 0", () => {
    expect(penceToLsd(0)).toEqual({ l: 0, s: 0, d: 0 });
  });

  it("converts 240 pence to 1 pound", () => {
    expect(penceToLsd(240)).toEqual({ l: 1, s: 0, d: 0 });
  });

  it("converts 12 pence to 1 shilling", () => {
    expect(penceToLsd(12)).toEqual({ l: 0, s: 1, d: 0 });
  });

  it("converts 1 pence", () => {
    expect(penceToLsd(1)).toEqual({ l: 0, s: 0, d: 1 });
  });

  it("12d carries to 1s", () => {
    expect(penceToLsd(12)).toEqual({ l: 0, s: 1, d: 0 });
  });

  it("20s carries to 1l", () => {
    expect(penceToLsd(240)).toEqual({ l: 1, s: 0, d: 0 });
  });

  it("round-trips large values", () => {
    expect(penceToLsd(24239)).toEqual({ l: 100, s: 19, d: 11 });
  });

  it("throws on negative input", () => {
    expect(() => penceToLsd(-1)).toThrow();
  });

  it("throws on non-integer input", () => {
    expect(() => penceToLsd(1.5)).toThrow();
  });
});
