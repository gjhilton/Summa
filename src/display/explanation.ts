import { computeFieldWorking } from '@/state/calculationLogic'
import { romanToInteger, isValidRoman } from '@/utils/roman'
import { normalizeEarlyModernInput } from '@/utils/earlyModern'
import type { LsdStrings } from '@/types/calculation'

export const LSD_MULTIPLIERS: Record<'l' | 's' | 'd', number> = { l: 240, s: 12, d: 1 }

export type ExplanationTerm = {
  integer: number
  multiplier: number
  pence: number
}

export type LsdExplanation = {
  terms: ExplanationTerm[]
  totalPence: number
}

export type ExtendedExplanation = {
  unitCostTerms: ExplanationTerm[]
  basePence: number
  quantity: number
  totalPence: number
}

export function computeLsdExplanation(
  literals: LsdStrings,
  totalPence: number,
  error: boolean
): LsdExplanation | null {
  if (error) return null
  const terms: ExplanationTerm[] = (['l', 's', 'd'] as const).flatMap(f => {
    const r = computeFieldWorking(literals[f], f)
    if (!r) return []
    const multiplier = LSD_MULTIPLIERS[f]
    return [{ integer: r.pence / multiplier, multiplier, pence: r.pence }]
  })
  if (!terms.length) return null
  return { terms, totalPence }
}

export function computeExtendedExplanation(
  literals: LsdStrings,
  quantity: string,
  basePence: number,
  totalPence: number,
  error: boolean
): ExtendedExplanation | null {
  if (error || !basePence) return null
  const norm = normalizeEarlyModernInput(quantity)
  if (!isValidRoman(norm)) return null
  const qInt = romanToInteger(norm)
  if (!qInt) return null
  const lsdExplanation = computeLsdExplanation(literals, basePence, false)
  if (!lsdExplanation) return null
  return {
    unitCostTerms: lsdExplanation.terms,
    basePence,
    quantity: qInt,
    totalPence,
  }
}
