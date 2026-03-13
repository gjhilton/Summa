import { Button } from './Button'
import { ScreenHeader } from './Header'
import { ScreenFooter } from './Footer'
import { ScreenContainer } from './ScreenContainer'

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
