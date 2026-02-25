/**
 * Convert pounds, shillings, pence to total pence.
 * 1 pound = 240 pence, 1 shilling = 12 pence.
 * All inputs must be non-negative integers.
 */
export function lsdToPence(l: number, s: number, d: number): number {
  if (!Number.isInteger(l) || !Number.isInteger(s) || !Number.isInteger(d)) {
    throw new Error("lsdToPence: all arguments must be integers");
  }
  if (l < 0 || s < 0 || d < 0) {
    throw new Error("lsdToPence: all arguments must be non-negative");
  }
  return l * 240 + s * 12 + d;
}

/**
 * Convert total pence to pounds, shillings, pence.
 * Input must be a non-negative integer.
 */
export function penceToLsd(total: number): { l: number; s: number; d: number } {
  if (!Number.isInteger(total)) {
    throw new Error("penceToLsd: input must be an integer");
  }
  if (total < 0) {
    throw new Error("penceToLsd: input must be non-negative");
  }
  const l = Math.floor(total / 240);
  const remainder = total % 240;
  const s = Math.floor(remainder / 12);
  const d = remainder % 12;
  return { l, s, d };
}
