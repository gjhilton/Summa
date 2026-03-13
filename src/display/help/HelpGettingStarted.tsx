import { DragCtx } from '@/display/DragCtx'
import {
  Item,
  BlockRow,
  BlockTitle,
  BlockCurrency,
} from '@/display/MainScreen'
import { HelpSection, HelpHeading, HelpPara, ScreenSample } from './shared'
import { MOCK_DRAG_CTX } from './mockDragCtx'

export function HelpGettingStarted() {
  return (
    <HelpSection>
      <HelpHeading>Getting started</HelpHeading>

      <HelpPara>
        Each line has three fields: <strong>li</strong> for pounds (librae),{' '}
        <strong>s</strong> for shillings (solidi) and <strong>d</strong> for
        pence (denarii). Enter amounts as Roman numerals, exactly as they appear
        in the source document. Lines can also have an optional title.
      </HelpPara>

      <ScreenSample>
        <DragCtx.Provider value={MOCK_DRAG_CTX}>
          <Item>
            <BlockRow>
              <BlockTitle title="Porter" />
              <BlockCurrency values={{ l: '0', s: 'iij', d: 'vj' }} />
            </BlockRow>
          </Item>
        </DragCtx.Provider>
      </ScreenSample>

      <HelpPara>
        If you type anything that is not a valid Roman numeral the field turns
        red and the line shows an error message. Remove the invalid characters
        to clear it.
      </HelpPara>

      <ScreenSample>
        <DragCtx.Provider value={MOCK_DRAG_CTX}>
          <Item error>
            <BlockRow>
              <BlockTitle title="Porter" />
              <BlockCurrency
                values={{ l: '0', s: '3s', d: 'vj' }}
                fieldErrors={{ l: false, s: true, d: false }}
              />
            </BlockRow>
          </Item>
        </DragCtx.Provider>
      </ScreenSample>
    </HelpSection>
  )
}
