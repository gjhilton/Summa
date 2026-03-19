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
 Summa is a list of <strong>item</strong>s, each woth a value.
 </HelpPara>
      <HelpPara>
        Each item has three fields: 
		<ol>
		<li><strong>li</strong> - pounds (librae), equivalent to 20s or 240d</li>
        <li><strong>s</strong> - shillings (solidi), equivalent to 12d</li>
		<li><strong>d</strong> - pence (denarii)</li>
		</ol>
		
		Items can also have an optional title to help you keep track of what's what.
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
        If you type anything that is not a valid Roman numeral into the currency fields, of an item, the field turns
        red and the line shows an error message. Just remove the invalid characters
        to clear the warning.
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
        To add a new item, tap the '+ item' button at the bottom of the list.
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
        An <strong>undo</strong> button appears at the top of the page
        whenever there is something you can undo. Each tap steps back in time one change.
      </HelpPara>

      <ScreenSample>
        <ButtonRow>
          <Button>undo</Button>
        </ButtonRow>
      </ScreenSample>

      <HelpPara>
        Your work is saved automatically in the browser's local storage as you type. If you
        close the tab and come back later, Summa will try to restore exactly where you
        left off for a seamless experience. However, local storage can be unreliable (for instance if you clear your cookies), so you are strongly
        advised to use <strong>export</strong> to save important work between
        sessions. Exported files are plain JSON and perhaps with a bit of maipulation, can be loaded into any other
        software.
      </HelpPara>
    </HelpSection>
  )
}
