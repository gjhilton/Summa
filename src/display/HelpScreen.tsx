import { Button } from './shared/Button'
import { ScreenHeader } from './shared/Header'
import { ScreenFooter } from './shared/Footer'
import { ScreenContainer } from './shared/ScreenContainer'

interface Props {
  onBack?: () => void
}

export function HelpScreen({ onBack }: Props) {
  return (
    <ScreenContainer>
      <ScreenHeader>
        {onBack && <Button onClick={onBack}>← back</Button>}
      </ScreenHeader>
      <p>todo</p>
      <ScreenFooter />
    </ScreenContainer>
  )
}
