import { DragCtx } from '@/display/DragCtx'
import {
  Item,
  BlockRow,
  BlockTitle,
  BlockCurrency,
} from '@/display/MainScreen'
import { HelpSection, HelpHeading, HelpPara, ScreenSample, AnnotatedSample, ArrowAnchor } from './shared'
import { MOCK_DRAG_CTX } from './mockDragCtx'
import { Arrow } from './Arrow'

const canHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

export function HelpOrganising() {
  return (
    <HelpSection>
      <HelpHeading>Organising items</HelpHeading>

      <HelpPara>
        Drag any line to a new position using the handle on its left edge.
      </HelpPara>

      <AnnotatedSample>
        <ArrowAnchor target="dragHandle">
          <Arrow direction="downLeft" />
        </ArrowAnchor>
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
      </AnnotatedSample>

      {canHover ? (
        <HelpPara>
          Hover over a row to reveal the Delete, Duplicate and Clear buttons on
          the right-hand side.
        </HelpPara>
      ) : (
        <HelpPara>
          Swipe a row left to reveal the Delete, Duplicate and Clear buttons.
        </HelpPara>
      )}

      <ScreenSample>
        <DragCtx.Provider value={MOCK_DRAG_CTX}>
          <Item
            showActions
            isOpen={!canHover}
            desktopVisible
            onClose={() => {}}
            onRemove={() => {}}
            onDuplicate={() => {}}
            onClearItem={() => {}}
          >
            <BlockRow>
              <BlockTitle title="Porter" />
              <BlockCurrency values={{ l: '0', s: 'iij', d: 'vj' }} />
            </BlockRow>
          </Item>
        </DragCtx.Provider>
      </ScreenSample>
    </HelpSection>
  )
}
