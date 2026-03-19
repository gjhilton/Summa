import { DragCtx } from '@/display/DragCtx'
import { ItemExtended } from '@/display/MainScreen'
import { HelpSection, HelpHeading, HelpPara, ScreenSample } from './shared'
import { MOCK_DRAG_CTX } from './mockDragCtx'

export function HelpExtendedItems() {
  return (
    <HelpSection>
      <HelpHeading>Extended items</HelpHeading>

      <HelpPara>
        An extended item calculates a quantity multiplied by a unit price —
        useful for entries such as "four bookes at ij s
        each". Enter the quantity and unit price; Summa calculates the
        total automatically.
      </HelpPara>

      <ScreenSample>
        <DragCtx.Provider value={MOCK_DRAG_CTX}>
          <ItemExtended
            title="Bookes"
            quantity="iiij"
            literals={{ l: '0', s: 'ij', d: '0' }}
            resultDisplay={{ l: '0', s: 'viij', d: '0' }}
          />
        </DragCtx.Provider>
      </ScreenSample>
    </HelpSection>
  )
}
