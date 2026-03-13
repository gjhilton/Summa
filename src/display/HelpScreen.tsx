import { Button } from './shared/Button'
import { ScreenHeader } from './shared/Header'
import { ScreenFooter } from './shared/Footer'
import { ScreenContainer } from './shared/ScreenContainer'
import { PageWidth } from './shared/PageWidth'
import { HelpGettingStarted } from './help/HelpGettingStarted'
import { HelpHistoricalNote } from './help/HelpHistoricalNote'
import { HelpOrganising } from './help/HelpOrganising'
import { HelpExplanations } from './help/HelpExplanations'
import { HelpAdvanced } from './help/HelpAdvanced'
import { HelpExtendedItems } from './help/HelpExtendedItems'
import { HelpSubtotalItems } from './help/HelpSubtotalItems'
import { HelpSaveLoad } from './help/HelpSaveLoad'
import { HelpAbout } from './help/HelpAbout'

interface Props {
  onBack?: () => void
  showExplanation: boolean
  onShowExplanationChange: (v: boolean) => void
  advancedMode: boolean
  onAdvancedModeChange: (v: boolean) => void
}

export function HelpScreen({ onBack, showExplanation, onShowExplanationChange, advancedMode, onAdvancedModeChange }: Props) {
  return (
    <ScreenContainer background="grey">
      <ScreenHeader>
        {onBack && <Button onClick={onBack}>← back</Button>}
      </ScreenHeader>
      <PageWidth>
        <HelpGettingStarted />
        <HelpHistoricalNote />
        <HelpOrganising />
        <HelpExplanations
          showExplanation={showExplanation}
          onShowExplanationChange={onShowExplanationChange}
        />
        <HelpAdvanced
          advancedMode={advancedMode}
          onAdvancedModeChange={onAdvancedModeChange}
        />
        <HelpExtendedItems />
        <HelpSubtotalItems />
        <HelpSaveLoad />
        <HelpAbout />
      </PageWidth>
      <ScreenFooter />
    </ScreenContainer>
  )
}
