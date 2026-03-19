import { Button } from '@/display/shared/Button'
import { HelpSection, HelpHeading, HelpPara, ScreenSample, ButtonRow } from './shared'

export function HelpSaveLoad() {
  return (
    <HelpSection>
      <HelpHeading>Export and load</HelpHeading>

      <HelpPara>
        Use <strong>export</strong> to save your current calculation as a{' '}
        <code>.summa.json</code> file. Use <strong>load</strong> to open a
        previously exported file and restore it as your current calculation.
        Both buttons appear at the top left of the screen and are only
        available at the top level — not while inside a sub-calculation.
      </HelpPara>

      <ScreenSample>
        <ButtonRow>
          <Button variant="primary">export</Button>
          <Button>load</Button>
        </ButtonRow>
      </ScreenSample>
    </HelpSection>
  )
}
