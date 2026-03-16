import { DragCtx } from '@/display/DragCtx'
import {
  Item,
  BlockRow,
  BlockTitle,
  BlockCurrency,
  ExplanationRow,
  Toggle,
} from '@/display/MainScreen'
import { HelpSection, HelpHeading, HelpPara, ScreenSample, ToggleRow } from './shared'
import { MOCK_DRAG_CTX } from './mockDragCtx'

interface Props {
  showExplanation: boolean
  onShowExplanationChange: (v: boolean) => void
}

export function HelpExplanations({ showExplanation, onShowExplanationChange }: Props) {
  return (
    <HelpSection>
      <HelpHeading>Explanations</HelpHeading>

      <HelpPara>
        Use the <strong>show explanations</strong> toggle in the footer to show or
        hide a step-by-step breakdown of each calculation. Each line displays
        how its value was converted to pence — useful for checking your figures
        against the source document.
      </HelpPara>

      <ScreenSample>
        <DragCtx.Provider value={MOCK_DRAG_CTX}>
          <Item>
            <BlockRow>
              <BlockTitle title="Porter" />
              <BlockCurrency values={{ l: '0', s: 'iij', d: 'vj' }} />
            </BlockRow>
            <ExplanationRow>
              (3 × 12<sup>d</sup> = 36<sup>d</sup>) + 6<sup>d</sup> = 42<sup>d</sup>
            </ExplanationRow>
          </Item>
        </DragCtx.Provider>
      </ScreenSample>

      <HelpPara>
        <strong>
          Explanations are currently{' '}
          {showExplanation ? 'enabled' : 'disabled'}.
        </strong>{' '}
        You can change this as you work using the toggle switch at the foot of
        the page, or change it now:
      </HelpPara>

      <ScreenSample>
        <ToggleRow>
          <Toggle
            id="help-explanation-toggle"
            label="show working"
            checked={showExplanation}
            onChange={onShowExplanationChange}
          />
        </ToggleRow>
      </ScreenSample>
    </HelpSection>
  )
}
