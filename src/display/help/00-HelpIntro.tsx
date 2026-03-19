import { styled } from '@/styled-system/jsx'
import { Logo } from '@/display/MainScreen'
import { SummaIntro } from '@/display/shared/SummaIntro'
import { HelpSection } from './shared'

const HelpLogoWrapper = styled('div', {
  base: { width: '100%', maxWidth: '320px' },
})

export function HelpIntro() {
  return (
    <HelpSection>
      <HelpLogoWrapper>
        <Logo size="l" />
      </HelpLogoWrapper>
      <SummaIntro />
    </HelpSection>
  )
}
