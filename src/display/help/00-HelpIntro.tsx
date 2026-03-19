import { Logo } from '@/display/MainScreen'
import { styled } from '@/styled-system/jsx'

const HelpLogoWrapper = styled('div', {
  base: { width: '100%', maxWidth: '320px', marginBottom: '1rem' },
})

const HelpIntroPara = styled('p', {
  base: {
    margin: 0,
    fontSize: '1rem',
    lineHeight: 1.6,
    color: '#333',
    maxWidth: '48ch',
    marginBottom: '2rem',
  },
})

export function HelpIntro() {
  return (
    <>
      <HelpLogoWrapper>
        <Logo size="l" />
      </HelpLogoWrapper>
      <HelpIntroPara>
        <strong>Summa is a simple calculator for historians working with Early Modern English and Scottish accounts.</strong>{' '}
        Enter amounts as sterling pounds, shillings and pence in Roman
        numerals and Summa will add them up for you.
      </HelpIntroPara>
    </>
  )
}
