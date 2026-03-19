import { styled } from '@/styled-system/jsx'
import { Logo } from '@/display/MainScreen'
import { HelpSection, HelpPara } from './shared'

const HelpLogoWrapper = styled('div', {
  base: { width: '100%', maxWidth: '320px' },
})

export function HelpIntro() {
  return (
    <HelpSection>
      <HelpLogoWrapper>
        <Logo size="l" />
      </HelpLogoWrapper>
      <HelpPara>
        <strong>Summa is a simple calculator for historians working with Early Modern English and Scottish accounts.</strong>{' '}
        Enter amounts as sterling pounds, shillings and pence in Roman
        numerals and Summa will add them up for you.
      </HelpPara>
    </HelpSection>
  )
}
