import { describe, it, expect } from 'vitest'
import { computeLsdExplanation, computeExtendedExplanation } from './explanation'

describe('computeLsdExplanation', () => {

  describe('returns null when', () => {
    it('error is true', () => {
      expect(computeLsdExplanation({ l: '0', s: 'iij', d: 'vj' }, 42, true)).toBeNull()
    })
    it('error is true even with valid literals', () => {
      expect(computeLsdExplanation({ l: 'j', s: 'v', d: 'iij' }, 303, true)).toBeNull()
    })
    it('all fields are zero', () => {
      expect(computeLsdExplanation({ l: '0', s: '0', d: '0' }, 0, false)).toBeNull()
    })
    it('all fields are empty string', () => {
      expect(computeLsdExplanation({ l: '', s: '', d: '' }, 0, false)).toBeNull()
    })
    it('all fields are invalid Roman', () => {
      expect(computeLsdExplanation({ l: 'xyz', s: 'abc', d: '???' }, 0, false)).toBeNull()
    })
  })

  describe('single field — d', () => {
    it('single pence (j = 1)', () => {
      expect(computeLsdExplanation({ l: '0', s: '0', d: 'j' }, 1, false)).toEqual({
        terms: [{ integer: 1, multiplier: 1, pence: 1 }],
        totalPence: 1,
      })
    })
    it('six pence (vj = 6)', () => {
      expect(computeLsdExplanation({ l: '0', s: '0', d: 'vj' }, 6, false)).toEqual({
        terms: [{ integer: 6, multiplier: 1, pence: 6 }],
        totalPence: 6,
      })
    })
    it('twelve pence (xij = 12)', () => {
      expect(computeLsdExplanation({ l: '0', s: '0', d: 'xij' }, 12, false)).toEqual({
        terms: [{ integer: 12, multiplier: 1, pence: 12 }],
        totalPence: 12,
      })
    })
  })

  describe('single field — s', () => {
    it('one shilling (j = 1, 12d)', () => {
      expect(computeLsdExplanation({ l: '0', s: 'j', d: '0' }, 12, false)).toEqual({
        terms: [{ integer: 1, multiplier: 12, pence: 12 }],
        totalPence: 12,
      })
    })
    it('three shillings (iij = 3, 36d)', () => {
      expect(computeLsdExplanation({ l: '0', s: 'iij', d: '0' }, 36, false)).toEqual({
        terms: [{ integer: 3, multiplier: 12, pence: 36 }],
        totalPence: 36,
      })
    })
    it('twenty shillings (xx = 20, 240d)', () => {
      expect(computeLsdExplanation({ l: '0', s: 'xx', d: '0' }, 240, false)).toEqual({
        terms: [{ integer: 20, multiplier: 12, pence: 240 }],
        totalPence: 240,
      })
    })
  })

  describe('single field — l', () => {
    it('one pound (j = 1, 240d)', () => {
      expect(computeLsdExplanation({ l: 'j', s: '0', d: '0' }, 240, false)).toEqual({
        terms: [{ integer: 1, multiplier: 240, pence: 240 }],
        totalPence: 240,
      })
    })
    it('two pounds (ij = 2, 480d)', () => {
      expect(computeLsdExplanation({ l: 'ij', s: '0', d: '0' }, 480, false)).toEqual({
        terms: [{ integer: 2, multiplier: 240, pence: 480 }],
        totalPence: 480,
      })
    })
  })

  describe('multiple fields', () => {
    it('s and d (iij s vj d = 42d)', () => {
      expect(computeLsdExplanation({ l: '0', s: 'iij', d: 'vj' }, 42, false)).toEqual({
        terms: [
          { integer: 3, multiplier: 12, pence: 36 },
          { integer: 6, multiplier: 1, pence: 6 },
        ],
        totalPence: 42,
      })
    })
    it('l and s (j li v s = 300d)', () => {
      expect(computeLsdExplanation({ l: 'j', s: 'v', d: '0' }, 300, false)).toEqual({
        terms: [
          { integer: 1, multiplier: 240, pence: 240 },
          { integer: 5, multiplier: 12, pence: 60 },
        ],
        totalPence: 300,
      })
    })
    it('l, s, and d (j li v s iij d = 303d)', () => {
      expect(computeLsdExplanation({ l: 'j', s: 'v', d: 'iij' }, 303, false)).toEqual({
        terms: [
          { integer: 1, multiplier: 240, pence: 240 },
          { integer: 5, multiplier: 12, pence: 60 },
          { integer: 3, multiplier: 1, pence: 3 },
        ],
        totalPence: 303,
      })
    })
    it('returns terms in l → s → d order', () => {
      const result = computeLsdExplanation({ l: 'j', s: 'j', d: 'j' }, 253, false)
      expect(result?.terms.map(t => t.multiplier)).toEqual([240, 12, 1])
    })
  })

  describe('early modern input normalisation', () => {
    it('normalises j to i in d field (vj = 6)', () => {
      const result = computeLsdExplanation({ l: '0', s: '0', d: 'vj' }, 6, false)
      expect(result?.terms[0].integer).toBe(6)
    })
    it('normalises j to i in s field (ij = 2)', () => {
      const result = computeLsdExplanation({ l: '0', s: 'ij', d: '0' }, 24, false)
      expect(result?.terms[0]).toEqual({ integer: 2, multiplier: 12, pence: 24 })
    })
    it('handles uppercase input (III s)', () => {
      const result = computeLsdExplanation({ l: '0', s: 'III', d: '0' }, 36, false)
      expect(result?.terms[0].integer).toBe(3)
    })
    it('handles mixed case (IiJ s = 3)', () => {
      const result = computeLsdExplanation({ l: '0', s: 'IiJ', d: '0' }, 36, false)
      expect(result?.terms[0].integer).toBe(3)
    })
  })

  describe('invalid fields are skipped', () => {
    it('skips invalid l, returns s and d terms', () => {
      const result = computeLsdExplanation({ l: 'bad', s: 'ij', d: 'iij' }, 27, false)
      expect(result?.terms).toHaveLength(2)
      expect(result?.terms[0]).toEqual({ integer: 2, multiplier: 12, pence: 24 })
      expect(result?.terms[1]).toEqual({ integer: 3, multiplier: 1, pence: 3 })
    })
    it('skips invalid s, returns d term only', () => {
      const result = computeLsdExplanation({ l: '0', s: '???', d: 'v' }, 5, false)
      expect(result?.terms).toHaveLength(1)
      expect(result?.terms[0]).toEqual({ integer: 5, multiplier: 1, pence: 5 })
    })
    it('skips zero l, returns s term', () => {
      const result = computeLsdExplanation({ l: '0', s: 'ij', d: '0' }, 24, false)
      expect(result?.terms).toHaveLength(1)
      expect(result?.terms[0].multiplier).toBe(12)
    })
  })

  it('preserves totalPence exactly as passed (does not recompute)', () => {
    const result = computeLsdExplanation({ l: '0', s: 'ij', d: '0' }, 999, false)
    expect(result?.totalPence).toBe(999)
  })
})


describe('computeExtendedExplanation', () => {
  const unitLiterals = { l: '0', s: 'ij', d: 'j' }  // 2s 1d = 25d

  describe('returns null when', () => {
    it('error is true', () => {
      expect(computeExtendedExplanation(unitLiterals, 'ij', 25, 50, true)).toBeNull()
    })
    it('basePence is 0', () => {
      expect(computeExtendedExplanation({ l: '0', s: '0', d: '0' }, 'ij', 0, 0, false)).toBeNull()
    })
    it('quantity is invalid Roman', () => {
      expect(computeExtendedExplanation(unitLiterals, 'xyz', 25, 50, false)).toBeNull()
    })
    it('quantity is "0"', () => {
      expect(computeExtendedExplanation(unitLiterals, '0', 25, 0, false)).toBeNull()
    })
    it('quantity is empty string', () => {
      expect(computeExtendedExplanation(unitLiterals, '', 25, 0, false)).toBeNull()
    })
    it('unit cost literals produce no valid terms', () => {
      expect(computeExtendedExplanation({ l: '0', s: '0', d: '0' }, 'ij', 25, 50, false)).toBeNull()
    })
    it('error is true even when all other values are valid', () => {
      expect(computeExtendedExplanation({ l: '0', s: 'v', d: '0' }, 'x', 60, 600, true)).toBeNull()
    })
  })

  describe('quantity parsing', () => {
    it('parses j as 1', () => {
      const result = computeExtendedExplanation({ l: '0', s: 'v', d: '0' }, 'j', 60, 60, false)
      expect(result?.quantity).toBe(1)
    })
    it('parses ij as 2', () => {
      const result = computeExtendedExplanation({ l: '0', s: 'ij', d: '0' }, 'ij', 24, 48, false)
      expect(result?.quantity).toBe(2)
    })
    it('parses xij as 12 (early modern j normalisation)', () => {
      const result = computeExtendedExplanation({ l: '0', s: 'ij', d: '0' }, 'xij', 24, 288, false)
      expect(result?.quantity).toBe(12)
    })
    it('parses uppercase XII as 12', () => {
      const result = computeExtendedExplanation({ l: '0', s: 'ij', d: '0' }, 'XII', 24, 288, false)
      expect(result?.quantity).toBe(12)
    })
    it('parses xx as 20', () => {
      const result = computeExtendedExplanation({ l: '0', s: 'j', d: '0' }, 'xx', 12, 240, false)
      expect(result?.quantity).toBe(20)
    })
  })

  describe('single-field unit cost', () => {
    it('shillings only', () => {
      const result = computeExtendedExplanation({ l: '0', s: 'ij', d: '0' }, 'ij', 24, 48, false)
      expect(result).toEqual({
        unitCostTerms: [{ integer: 2, multiplier: 12, pence: 24 }],
        basePence: 24,
        quantity: 2,
        totalPence: 48,
      })
    })
    it('pence only', () => {
      const result = computeExtendedExplanation({ l: '0', s: '0', d: 'vj' }, 'iij', 6, 18, false)
      expect(result).toEqual({
        unitCostTerms: [{ integer: 6, multiplier: 1, pence: 6 }],
        basePence: 6,
        quantity: 3,
        totalPence: 18,
      })
    })
    it('pounds only', () => {
      const result = computeExtendedExplanation({ l: 'j', s: '0', d: '0' }, 'v', 240, 1200, false)
      expect(result).toEqual({
        unitCostTerms: [{ integer: 1, multiplier: 240, pence: 240 }],
        basePence: 240,
        quantity: 5,
        totalPence: 1200,
      })
    })
  })

  describe('multi-field unit cost', () => {
    it('s and d', () => {
      const result = computeExtendedExplanation({ l: '0', s: 'ij', d: 'j' }, 'ij', 25, 50, false)
      expect(result).toEqual({
        unitCostTerms: [
          { integer: 2, multiplier: 12, pence: 24 },
          { integer: 1, multiplier: 1, pence: 1 },
        ],
        basePence: 25,
        quantity: 2,
        totalPence: 50,
      })
    })
    it('l, s, and d', () => {
      const result = computeExtendedExplanation({ l: 'j', s: 'v', d: 'iij' }, 'ij', 303, 606, false)
      expect(result?.unitCostTerms).toHaveLength(3)
      expect(result?.unitCostTerms[0]).toEqual({ integer: 1, multiplier: 240, pence: 240 })
      expect(result?.unitCostTerms[1]).toEqual({ integer: 5, multiplier: 12, pence: 60 })
      expect(result?.unitCostTerms[2]).toEqual({ integer: 3, multiplier: 1, pence: 3 })
    })
  })

  it('preserves basePence and totalPence as passed', () => {
    const result = computeExtendedExplanation({ l: '0', s: 'ij', d: '0' }, 'ij', 999, 1998, false)
    expect(result?.basePence).toBe(999)
    expect(result?.totalPence).toBe(1998)
  })

  it('unitCostTerms are in l → s → d order', () => {
    const result = computeExtendedExplanation({ l: 'j', s: 'j', d: 'j' }, 'ij', 253, 506, false)
    expect(result?.unitCostTerms.map(t => t.multiplier)).toEqual([240, 12, 1])
  })
})
