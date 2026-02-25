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
