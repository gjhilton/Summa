import { Button } from './shared/Button'
import { ScreenHeader } from './shared/Header'
import { ScreenFooter } from './shared/Footer'
import { ScreenContainer } from './shared/ScreenContainer'
import { PageWidth } from './shared/PageWidth'
import { Logo } from './MainScreen'
import { styled } from '@/styled-system/jsx'
import { HelpGettingStarted } from './help/HelpGettingStarted'
import { HelpHistoricalNote } from './help/HelpHistoricalNote'
import { HelpOrganising } from './help/HelpOrganising'
import { HelpExplanations } from './help/HelpExplanations'
import { HelpAdvanced } from './help/HelpAdvanced'
import { HelpExtendedItems } from './help/HelpExtendedItems'
import { HelpSubtotalItems } from './help/HelpSubtotalItems'
import { HelpSaveLoad } from './help/HelpSaveLoad'
import { HelpAbout } from './help/HelpAbout'

const HelpLogoWrapper = styled('div', {
  base: { width: '100%', maxWidth: '320px', marginBottom: '1rem' },
})

const HelpIntro = styled('p', {
  base: {
    margin: 0,
    fontSize: '1rem',
    lineHeight: 1.6,
    color: '#333',
    maxWidth: '48ch',
    marginBottom: '2rem',
  },
})

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
        <HelpLogoWrapper>
          <Logo size="l" />
        </HelpLogoWrapper>
        <HelpIntro>
          <strong>Summa is a calculator for historians working with Early Modern British accounts.</strong>{' '}
          Enter pounds, shillings and pence in Roman
          numerals — exactly as they appear in period documents — and Summa
          totals the column for you.
        </HelpIntro>
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
