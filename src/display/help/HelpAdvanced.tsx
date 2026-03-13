import { Toggle, AddItemBar } from '@/display/MainScreen'
import { HelpSection, HelpHeading, HelpPara, ScreenSample, CentredRow } from './shared'

interface Props {
  advancedMode: boolean
  onAdvancedModeChange: (v: boolean) => void
}

export function HelpAdvanced({ advancedMode, onAdvancedModeChange }: Props) {
  return (
    <HelpSection>
      <HelpHeading>Advanced features</HelpHeading>

      <HelpPara>
        In the same way, you can toggle advanced features on and off.{' '}
        <strong>
          Advanced features are currently{' '}
          {advancedMode ? 'enabled' : 'disabled'}.
        </strong>{' '}
        You can change this using the toggle at the foot of the page, or change
        it now:
      </HelpPara>

      <ScreenSample>
        <CentredRow>
          <Toggle
            id="help-advanced-toggle"
            label="advanced"
            checked={advancedMode}
            onChange={onAdvancedModeChange}
          />
        </CentredRow>
      </ScreenSample>

      <HelpPara>
        When enabled, this allows you to create two new kinds of item: extended
        items and subtotal items.
      </HelpPara>

      <ScreenSample>
        <AddItemBar
          advanced
          onAdd={() => {}}
          onAddUnit={() => {}}
          onAddExtended={() => {}}
          onAddSubtotal={() => {}}
        />
      </ScreenSample>
    </HelpSection>
  )
}
