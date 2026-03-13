import { ItemType } from '@/types/calculation'
import type { CalculationState } from '@/types/calculation'

export const DUMMY_DATA: CalculationState = {
  lines: [
    {
      id: '1', itemType: ItemType.LINE_ITEM,
      title: 'Candles, tallow',
      literals: { l: '0', s: 'iij', d: 'vj' },
      error: false, fieldErrors: { l: false, s: false, d: false }, totalPence: 42,
    },
    {
      id: '2', itemType: ItemType.EXTENDED_ITEM,
      title: 'Beeswax candles',
      literals: { l: '0', s: 'ij', d: '0' },
      quantity: 'xij',
      error: false, fieldErrors: { l: false, s: false, d: false },
      quantityError: false, basePence: 24, totalPence: 288,
    },
    {
      id: '3', itemType: ItemType.SUBTOTAL_ITEM,
      title: 'sundries',
      lines: [
        {
          id: '3a', itemType: ItemType.LINE_ITEM, title: 'Rushes',
          literals: { l: '0', s: 'j', d: '0' },
          error: false, fieldErrors: { l: false, s: false, d: false }, totalPence: 12,
        },
      ],
      totalPence: 12, totalDisplay: { l: '0', s: 'j', d: '0' }, error: false,
    },
  ],
  totalDisplay: { l: 'j', s: 'viij', d: 'vj' },
  totalPence: 342,
  hasError: false,
}
