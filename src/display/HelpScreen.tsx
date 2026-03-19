import { Button } from './shared/Button'
import { ScreenHeader } from './shared/Header'
import { ScreenFooter } from './shared/Footer'
import { ScreenContainer } from './shared/ScreenContainer'
import { PageWidth } from './shared/PageWidth'
import { HelpIntro } from './help/00-HelpIntro'
import { HelpGettingStarted } from './help/01-HelpGettingStarted'
import { HelpHistoricalNote } from './help/02-HelpHistoricalNote'
import { HelpOrganising } from './help/03-HelpOrganising'
import { HelpExplanations } from './help/04-HelpExplanations'
import { HelpAdvanced } from './help/05-HelpAdvanced'
import { HelpExtendedItems } from './help/06-HelpExtendedItems'
import { HelpSubtotalItems } from './help/07-HelpSubtotalItems'
import { HelpSaveLoad } from './help/08-HelpSaveLoad'
import { HelpAbout } from './help/09-HelpAbout'
import { HelpChangelog } from './help/10-HelpChangelog'

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
        {onBack && <Button variant="primary" onClick={onBack}>← back</Button>}
      </ScreenHeader>
      <PageWidth>
        <HelpIntro />
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
        <HelpChangelog />
      </PageWidth>
      <ScreenFooter />
    </ScreenContainer>
  )
}
