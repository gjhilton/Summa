import { DragCtx } from '@/display/DragCtx'
import {
  Item,
  BlockRow,
  BlockTitle,
  BlockCurrency,
  AddItemBar,
} from '@/display/MainScreen'
import { Button } from '@/display/shared/Button'
import { HelpSection, HelpHeading, HelpPara, ScreenSample } from './shared'
import { ButtonRow } from './helpLayout'
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
              <BlockTitle title="Bookes" />
              <BlockCurrency values={{ l: '0', s: 'iij', d: 'vj' }} />
            </BlockRow>
          </Item>
        </DragCtx.Provider>
      </ScreenSample>

      <HelpPara>
        If you type anything that is not a valid Roman numeral into the currency fields, the field turns
        red and the line shows an error message. Remove the invalid characters
        to clear it.
      </HelpPara>

      <ScreenSample>
        <DragCtx.Provider value={MOCK_DRAG_CTX}>
          <Item error>
            <BlockRow>
              <BlockTitle title="Bookes" />
              <BlockCurrency
                values={{ l: '0', s: '3s', d: 'vj' }}
                fieldErrors={{ l: false, s: true, d: false }}
              />
            </BlockRow>
          </Item>
        </DragCtx.Provider>
      </ScreenSample>
      <HelpPara>
        To add a new line, tap the button at the bottom of the list.
      </HelpPara>

      <ScreenSample>
        <AddItemBar
          onAdd={() => {}}
          onAddUnit={() => {}}
          onAddExtended={() => {}}
          onAddSubtotal={() => {}}
        />
      </ScreenSample>

      <HelpPara>
        Made a mistake? The <strong>undo</strong> button appears in the header
        whenever there is something to undo. Each tap steps back one change.
      </HelpPara>

      <ScreenSample>
        <ButtonRow>
          <Button>undo</Button>
        </ButtonRow>
      </ScreenSample>

      <HelpPara>
        Your work is saved automatically in the browser's local storage as you type. If you
        close the tab and come back later, Summa will restore exactly where you
        left off. However, local storage can be unreliable, so you are strongly
        advised to use <strong>export</strong> to save important work between
        sessions. Exported files are plain JSON and can be loaded into any other
        software.
      </HelpPara>
    </HelpSection>
  )
}
