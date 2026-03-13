import { describe, it, expect } from 'vitest'
import { ItemType } from '@/types/calculation'
import type { LsdStrings } from '@/types/calculation'
import { explain, explainTotal } from '@/utils/explanation'

// ─── Item factories ───────────────────────────────────────────────────────────

const NO_ERRORS = { l: false, s: false, d: false }

function lineItem(literals: LsdStrings, totalPence: number, error = false) {
  return { id: 'test', itemType: ItemType.LINE_ITEM as const, title: '', literals, totalPence, error, fieldErrors: NO_ERRORS }
}

function extendedItem(literals: LsdStrings, quantity: string, basePence: number, totalPence: number, error = false) {
  return { id: 'test', itemType: ItemType.EXTENDED_ITEM as const, title: '', literals, quantity, basePence, totalPence, error, fieldErrors: NO_ERRORS, quantityError: false }
}

function subtotalItem(totalDisplay: LsdStrings, totalPence: number, error = false) {
  return { id: 'test', itemType: ItemType.SUBTOTAL_ITEM as const, title: '', lines: [], totalDisplay, totalPence, error }
}

// ─── LINE_ITEM ────────────────────────────────────────────────────────────────

describe('explain() — LINE_ITEM', () => {

  describe('returns null when', () => {
    it('error is true', () => {
      expect(explain(lineItem({ l: '0', s: 'iij', d: 'vj' }, 42, true))).toBeNull()
    })
    it('error is true even with valid literals', () => {
      expect(explain(lineItem({ l: 'j', s: 'v', d: 'iij' }, 303, true))).toBeNull()
    })
    it('all fields are zero', () => {
      expect(explain(lineItem({ l: '0', s: '0', d: '0' }, 0))).toBeNull()
    })
    it('all fields are empty string', () => {
      expect(explain(lineItem({ l: '', s: '', d: '' }, 0))).toBeNull()
    })
    it('all fields are invalid Roman', () => {
      expect(explain(lineItem({ l: 'xyz', s: 'abc', d: '???' }, 0))).toBeNull()
    })
  })

  describe('single field — d', () => {
    it('single pence (j = 1)', () => {
      expect(explain(lineItem({ l: '0', s: '0', d: 'j' }, 1))).toEqual({
        type: 'lsd', terms: [{ integer: 1, multiplier: 1, pence: 1 }], totalPence: 1,
      })
    })
    it('six pence (vj = 6)', () => {
      expect(explain(lineItem({ l: '0', s: '0', d: 'vj' }, 6))).toEqual({
        type: 'lsd', terms: [{ integer: 6, multiplier: 1, pence: 6 }], totalPence: 6,
      })
    })
    it('twelve pence (xij = 12)', () => {
      expect(explain(lineItem({ l: '0', s: '0', d: 'xij' }, 12))).toEqual({
        type: 'lsd', terms: [{ integer: 12, multiplier: 1, pence: 12 }], totalPence: 12,
      })
    })
  })

  describe('single field — s', () => {
    it('one shilling (j = 1, 12d)', () => {
      expect(explain(lineItem({ l: '0', s: 'j', d: '0' }, 12))).toEqual({
        type: 'lsd', terms: [{ integer: 1, multiplier: 12, pence: 12 }], totalPence: 12,
      })
    })
    it('three shillings (iij = 3, 36d)', () => {
      expect(explain(lineItem({ l: '0', s: 'iij', d: '0' }, 36))).toEqual({
        type: 'lsd', terms: [{ integer: 3, multiplier: 12, pence: 36 }], totalPence: 36,
      })
    })
    it('twenty shillings (xx = 20, 240d)', () => {
      expect(explain(lineItem({ l: '0', s: 'xx', d: '0' }, 240))).toEqual({
        type: 'lsd', terms: [{ integer: 20, multiplier: 12, pence: 240 }], totalPence: 240,
      })
    })
  })

  describe('single field — l', () => {
    it('one pound (j = 1, 240d)', () => {
      expect(explain(lineItem({ l: 'j', s: '0', d: '0' }, 240))).toEqual({
        type: 'lsd', terms: [{ integer: 1, multiplier: 240, pence: 240 }], totalPence: 240,
      })
    })
    it('two pounds (ij = 2, 480d)', () => {
      expect(explain(lineItem({ l: 'ij', s: '0', d: '0' }, 480))).toEqual({
        type: 'lsd', terms: [{ integer: 2, multiplier: 240, pence: 480 }], totalPence: 480,
      })
    })
  })

  describe('multiple fields', () => {
    it('s and d (iij s vj d = 42d)', () => {
      expect(explain(lineItem({ l: '0', s: 'iij', d: 'vj' }, 42))).toEqual({
        type: 'lsd',
        terms: [{ integer: 3, multiplier: 12, pence: 36 }, { integer: 6, multiplier: 1, pence: 6 }],
        totalPence: 42,
      })
    })
    it('l and s (j li v s = 300d)', () => {
      expect(explain(lineItem({ l: 'j', s: 'v', d: '0' }, 300))).toEqual({
        type: 'lsd',
        terms: [{ integer: 1, multiplier: 240, pence: 240 }, { integer: 5, multiplier: 12, pence: 60 }],
        totalPence: 300,
      })
    })
    it('l, s, and d (j li v s iij d = 303d)', () => {
      expect(explain(lineItem({ l: 'j', s: 'v', d: 'iij' }, 303))).toEqual({
        type: 'lsd',
        terms: [
          { integer: 1, multiplier: 240, pence: 240 },
          { integer: 5, multiplier: 12, pence: 60 },
          { integer: 3, multiplier: 1, pence: 3 },
        ],
        totalPence: 303,
      })
    })
    it('returns terms in l → s → d order', () => {
      const result = explain(lineItem({ l: 'j', s: 'j', d: 'j' }, 253))
      expect(result?.type).toBe('lsd')
      if (result?.type === 'lsd') expect(result.terms.map(t => t.multiplier)).toEqual([240, 12, 1])
    })
  })

  describe('early modern input normalisation', () => {
    it('normalises j to i in d field (vj = 6)', () => {
      const result = explain(lineItem({ l: '0', s: '0', d: 'vj' }, 6))
      expect(result?.type).toBe('lsd')
      if (result?.type === 'lsd') expect(result.terms[0].integer).toBe(6)
    })
    it('normalises j to i in s field (ij = 2)', () => {
      const result = explain(lineItem({ l: '0', s: 'ij', d: '0' }, 24))
      expect(result?.type).toBe('lsd')
      if (result?.type === 'lsd') expect(result.terms[0]).toEqual({ integer: 2, multiplier: 12, pence: 24 })
    })
    it('handles uppercase input (III s)', () => {
      const result = explain(lineItem({ l: '0', s: 'III', d: '0' }, 36))
      expect(result?.type).toBe('lsd')
      if (result?.type === 'lsd') expect(result.terms[0].integer).toBe(3)
    })
    it('handles mixed case (IiJ s = 3)', () => {
      const result = explain(lineItem({ l: '0', s: 'IiJ', d: '0' }, 36))
      expect(result?.type).toBe('lsd')
      if (result?.type === 'lsd') expect(result.terms[0].integer).toBe(3)
    })
  })

  describe('invalid fields are skipped', () => {
    it('skips invalid l, returns s and d terms', () => {
      const result = explain(lineItem({ l: 'bad', s: 'ij', d: 'iij' }, 27))
      expect(result?.type).toBe('lsd')
      if (result?.type === 'lsd') {
        expect(result.terms).toHaveLength(2)
        expect(result.terms[0]).toEqual({ integer: 2, multiplier: 12, pence: 24 })
        expect(result.terms[1]).toEqual({ integer: 3, multiplier: 1, pence: 3 })
      }
    })
    it('skips invalid s, returns d term only', () => {
      const result = explain(lineItem({ l: '0', s: '???', d: 'v' }, 5))
      expect(result?.type).toBe('lsd')
      if (result?.type === 'lsd') {
        expect(result.terms).toHaveLength(1)
        expect(result.terms[0]).toEqual({ integer: 5, multiplier: 1, pence: 5 })
      }
    })
    it('skips zero l, returns s term only', () => {
      const result = explain(lineItem({ l: '0', s: 'ij', d: '0' }, 24))
      expect(result?.type).toBe('lsd')
      if (result?.type === 'lsd') {
        expect(result.terms).toHaveLength(1)
        expect(result.terms[0].multiplier).toBe(12)
      }
    })
  })

  it('preserves totalPence exactly as passed (does not recompute)', () => {
    const result = explain(lineItem({ l: '0', s: 'ij', d: '0' }, 999))
    expect(result?.type).toBe('lsd')
    if (result?.type === 'lsd') expect(result.totalPence).toBe(999)
  })
})

// ─── EXTENDED_ITEM ────────────────────────────────────────────────────────────

describe('explain() — EXTENDED_ITEM', () => {
  const unitLiterals = { l: '0', s: 'ij', d: 'j' }  // 2s 1d = 25d

  describe('returns null when', () => {
    it('error is true', () => {
      expect(explain(extendedItem(unitLiterals, 'ij', 25, 50, true))).toBeNull()
    })
    it('error is true even when all other values are valid', () => {
      expect(explain(extendedItem({ l: '0', s: 'v', d: '0' }, 'x', 60, 600, true))).toBeNull()
    })
    it('basePence is 0', () => {
      expect(explain(extendedItem({ l: '0', s: '0', d: '0' }, 'ij', 0, 0))).toBeNull()
    })
    it('quantity is invalid Roman', () => {
      expect(explain(extendedItem(unitLiterals, 'xyz', 25, 50))).toBeNull()
    })
    it('quantity is "0"', () => {
      expect(explain(extendedItem(unitLiterals, '0', 25, 0))).toBeNull()
    })
    it('quantity is empty string', () => {
      expect(explain(extendedItem(unitLiterals, '', 25, 0))).toBeNull()
    })
    it('unit cost literals produce no valid terms', () => {
      expect(explain(extendedItem({ l: '0', s: '0', d: '0' }, 'ij', 25, 50))).toBeNull()
    })
  })

  describe('quantity parsing', () => {
    it('parses j as 1', () => {
      const result = explain(extendedItem({ l: '0', s: 'v', d: '0' }, 'j', 60, 60))
      expect(result?.type).toBe('extended')
      if (result?.type === 'extended') expect(result.quantity).toBe(1)
    })
    it('parses ij as 2', () => {
      const result = explain(extendedItem({ l: '0', s: 'ij', d: '0' }, 'ij', 24, 48))
      expect(result?.type).toBe('extended')
      if (result?.type === 'extended') expect(result.quantity).toBe(2)
    })
    it('parses xij as 12 (early modern j normalisation)', () => {
      const result = explain(extendedItem({ l: '0', s: 'ij', d: '0' }, 'xij', 24, 288))
      expect(result?.type).toBe('extended')
      if (result?.type === 'extended') expect(result.quantity).toBe(12)
    })
    it('parses uppercase XII as 12', () => {
      const result = explain(extendedItem({ l: '0', s: 'ij', d: '0' }, 'XII', 24, 288))
      expect(result?.type).toBe('extended')
      if (result?.type === 'extended') expect(result.quantity).toBe(12)
    })
    it('parses xx as 20', () => {
      const result = explain(extendedItem({ l: '0', s: 'j', d: '0' }, 'xx', 12, 240))
      expect(result?.type).toBe('extended')
      if (result?.type === 'extended') expect(result.quantity).toBe(20)
    })
  })

  describe('single-field unit cost', () => {
    it('shillings only', () => {
      expect(explain(extendedItem({ l: '0', s: 'ij', d: '0' }, 'ij', 24, 48))).toEqual({
        type: 'extended',
        unitCostTerms: [{ integer: 2, multiplier: 12, pence: 24 }],
        basePence: 24, quantity: 2, totalPence: 48,
      })
    })
    it('pence only', () => {
      expect(explain(extendedItem({ l: '0', s: '0', d: 'vj' }, 'iij', 6, 18))).toEqual({
        type: 'extended',
        unitCostTerms: [{ integer: 6, multiplier: 1, pence: 6 }],
        basePence: 6, quantity: 3, totalPence: 18,
      })
    })
    it('pounds only', () => {
      expect(explain(extendedItem({ l: 'j', s: '0', d: '0' }, 'v', 240, 1200))).toEqual({
        type: 'extended',
        unitCostTerms: [{ integer: 1, multiplier: 240, pence: 240 }],
        basePence: 240, quantity: 5, totalPence: 1200,
      })
    })
  })

  describe('multi-field unit cost', () => {
    it('s and d (ij s j d = 25d)', () => {
      expect(explain(extendedItem({ l: '0', s: 'ij', d: 'j' }, 'ij', 25, 50))).toEqual({
        type: 'extended',
        unitCostTerms: [
          { integer: 2, multiplier: 12, pence: 24 },
          { integer: 1, multiplier: 1, pence: 1 },
        ],
        basePence: 25, quantity: 2, totalPence: 50,
      })
    })
    it('l, s, and d', () => {
      const result = explain(extendedItem({ l: 'j', s: 'v', d: 'iij' }, 'ij', 303, 606))
      expect(result?.type).toBe('extended')
      if (result?.type === 'extended') {
        expect(result.unitCostTerms).toHaveLength(3)
        expect(result.unitCostTerms[0]).toEqual({ integer: 1, multiplier: 240, pence: 240 })
        expect(result.unitCostTerms[1]).toEqual({ integer: 5, multiplier: 12, pence: 60 })
        expect(result.unitCostTerms[2]).toEqual({ integer: 3, multiplier: 1, pence: 3 })
      }
    })
    it('unitCostTerms are in l → s → d order', () => {
      const result = explain(extendedItem({ l: 'j', s: 'j', d: 'j' }, 'ij', 253, 506))
      expect(result?.type).toBe('extended')
      if (result?.type === 'extended') expect(result.unitCostTerms.map(t => t.multiplier)).toEqual([240, 12, 1])
    })
  })

  it('preserves basePence and totalPence as passed', () => {
    const result = explain(extendedItem({ l: '0', s: 'ij', d: '0' }, 'ij', 999, 1998))
    expect(result?.type).toBe('extended')
    if (result?.type === 'extended') {
      expect(result.basePence).toBe(999)
      expect(result.totalPence).toBe(1998)
    }
  })
})

// ─── TOTAL (grand total row) ──────────────────────────────────────────────────

describe('explainTotal()', () => {

  describe('returns null when', () => {
    it('totalPence is 0', () => {
      expect(explainTotal({ l: '0', s: '0', d: '0' }, 0)).toBeNull()
    })
    it('all totalDisplay fields are zero', () => {
      expect(explainTotal({ l: '0', s: '0', d: '0' }, 42)).toBeNull()
    })
    it('all totalDisplay fields are invalid Roman', () => {
      expect(explainTotal({ l: 'bad', s: 'bad', d: 'bad' }, 42)).toBeNull()
    })
  })

  it('single shilling', () => {
    expect(explainTotal({ l: '0', s: 'j', d: '0' }, 12)).toEqual({
      type: 'total', terms: [{ integer: 1, multiplier: 12, pence: 12 }], totalPence: 12,
    })
  })

  it('s and d', () => {
    expect(explainTotal({ l: '0', s: 'iij', d: 'vj' }, 42)).toEqual({
      type: 'total',
      terms: [{ integer: 3, multiplier: 12, pence: 36 }, { integer: 6, multiplier: 1, pence: 6 }],
      totalPence: 42,
    })
  })

  it('l, s, and d', () => {
    expect(explainTotal({ l: 'j', s: 'vij', d: 'vj' }, 330)).toEqual({
      type: 'total',
      terms: [
        { integer: 1, multiplier: 240, pence: 240 },
        { integer: 7, multiplier: 12, pence: 84 },
        { integer: 6, multiplier: 1, pence: 6 },
      ],
      totalPence: 330,
    })
  })

  it('preserves totalPence as passed', () => {
    const result = explainTotal({ l: '0', s: 'ij', d: '0' }, 999)
    expect(result?.totalPence).toBe(999)
  })

  it('terms are in l → s → d order', () => {
    const result = explainTotal({ l: 'j', s: 'j', d: 'j' }, 253)
    expect(result?.terms.map(t => t.multiplier)).toEqual([240, 12, 1])
  })
})

// ─── SUBTOTAL_ITEM ────────────────────────────────────────────────────────────

describe('explain() — SUBTOTAL_ITEM', () => {

  describe('returns null when', () => {
    it('error is true', () => {
      expect(explain(subtotalItem({ l: '0', s: 'iij', d: '0' }, 36, true))).toBeNull()
    })
    it('totalDisplay is all zero', () => {
      expect(explain(subtotalItem({ l: '0', s: '0', d: '0' }, 0))).toBeNull()
    })
  })

  it('single shilling total', () => {
    expect(explain(subtotalItem({ l: '0', s: 'j', d: '0' }, 12))).toEqual({
      type: 'lsd', terms: [{ integer: 1, multiplier: 12, pence: 12 }], totalPence: 12,
    })
  })

  it('s and d total', () => {
    expect(explain(subtotalItem({ l: '0', s: 'iij', d: 'vj' }, 42))).toEqual({
      type: 'lsd',
      terms: [{ integer: 3, multiplier: 12, pence: 36 }, { integer: 6, multiplier: 1, pence: 6 }],
      totalPence: 42,
    })
  })

  it('l, s, and d total', () => {
    expect(explain(subtotalItem({ l: 'j', s: 'v', d: 'iij' }, 303))).toEqual({
      type: 'lsd',
      terms: [
        { integer: 1, multiplier: 240, pence: 240 },
        { integer: 5, multiplier: 12, pence: 60 },
        { integer: 3, multiplier: 1, pence: 3 },
      ],
      totalPence: 303,
    })
  })

  it('returns terms in l → s → d order', () => {
    const result = explain(subtotalItem({ l: 'j', s: 'j', d: 'j' }, 253))
    expect(result?.type).toBe('lsd')
    if (result?.type === 'lsd') expect(result.terms.map(t => t.multiplier)).toEqual([240, 12, 1])
  })

  it('skips zero fields, returns only non-zero terms', () => {
    const result = explain(subtotalItem({ l: '0', s: 'v', d: '0' }, 60))
    expect(result?.type).toBe('lsd')
    if (result?.type === 'lsd') {
      expect(result.terms).toHaveLength(1)
      expect(result.terms[0]).toEqual({ integer: 5, multiplier: 12, pence: 60 })
    }
  })

  it('preserves totalPence as passed', () => {
    const result = explain(subtotalItem({ l: '0', s: 'ij', d: '0' }, 999))
    expect(result?.type).toBe('lsd')
    if (result?.type === 'lsd') expect(result.totalPence).toBe(999)
  })
})
