import { Button } from './shared/Button'
import { ScreenHeader } from './shared/Header'
import { ScreenFooter } from './shared/Footer'
import { ScreenContainer } from './shared/ScreenContainer'
import { PageWidth } from './shared/PageWidth'
import { HelpIntro } from './help/HelpIntro'
import { HelpGettingStarted } from './help/HelpGettingStarted'
import { HelpOrganising } from './help/HelpOrganising'

interface Props {
  onBack?: () => void
}

export function HelpScreen({ onBack }: Props) {
  return (
    <ScreenContainer background="grey">
      <ScreenHeader>
        {onBack && <Button onClick={onBack}>← back</Button>}
      </ScreenHeader>
      <PageWidth>
        <HelpIntro />
        <HelpGettingStarted />
        <HelpOrganising />
      </PageWidth>
      <ScreenFooter />
    </ScreenContainer>
  )
}
