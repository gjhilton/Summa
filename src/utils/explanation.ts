import { romanToInteger, isValidRoman } from '@/utils/roman'
import { normalizeEarlyModernInput } from '@/utils/earlyModern'
import { ItemType } from '@/types/calculation'
import type { AnyLineState, LsdStrings } from '@/types/calculation'
import { LSD_MULTIPLIERS } from '@/utils/currency'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ExplanationTerm = {
  integer: number
  multiplier: number
  pence: number
}

export type LsdExplanation = {
  type: 'lsd'
  terms: ExplanationTerm[]
  totalPence: number
}

export type ExtendedExplanation = {
  type: 'extended'
  unitCostTerms: ExplanationTerm[]
  basePence: number
  quantity: number
  totalPence: number
}

export type TotalExplanation = {
  type: 'total'
  terms: ExplanationTerm[]
  totalPence: number
}

export type Explanation = LsdExplanation | ExtendedExplanation | TotalExplanation

// ─── Private helpers ──────────────────────────────────────────────────────────

function buildTerms(literals: LsdStrings): ExplanationTerm[] {
  return (['l', 's', 'd'] as const).flatMap(f => {
    const norm = normalizeEarlyModernInput(literals[f])
    if (!isValidRoman(norm)) return []
    const integer = romanToInteger(norm)
    const multiplier = LSD_MULTIPLIERS[f]
    return [{ integer, multiplier, pence: integer * multiplier }]
  })
}

function lsdExplanation(
  literals: LsdStrings,
  totalPence: number,
  error: boolean
): LsdExplanation | null {
  if (error) return null
  const terms = buildTerms(literals)
  if (!terms.length) return null
  return { type: 'lsd', terms, totalPence }
}

function extendedExplanation(
  literals: LsdStrings,
  quantity: string,
  basePence: number,
  totalPence: number,
  error: boolean
): ExtendedExplanation | null {
  if (error || basePence === 0) return null
  const norm = normalizeEarlyModernInput(quantity)
  if (!isValidRoman(norm)) return null
  const qInt = romanToInteger(norm)
  const unitCostTerms = buildTerms(literals)
  if (!unitCostTerms.length) return null
  return { type: 'extended', unitCostTerms, basePence, quantity: qInt, totalPence }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function explainTotal(totalDisplay: LsdStrings, totalPence: number): TotalExplanation | null {
  if (totalPence === 0) return null
  const terms = buildTerms(totalDisplay)
  if (!terms.length) return null
  return { type: 'total', terms, totalPence }
}

export function explain(item: AnyLineState): Explanation | null {
  switch (item.itemType) {
    case ItemType.LINE_ITEM:
      return lsdExplanation(item.literals, item.totalPence, item.error)
    case ItemType.EXTENDED_ITEM:
      return extendedExplanation(item.literals, item.quantity, item.basePence, item.totalPence, item.error)
    case ItemType.SUBTOTAL_ITEM:
      return lsdExplanation(item.totalDisplay, item.totalPence, item.error)
  }
}
