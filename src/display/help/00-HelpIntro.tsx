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
        <strong>Summa is a calculator for historians working with Early Modern British accounts.</strong>{' '}
        Enter pounds, shillings and pence in Roman
        numerals — exactly as they appear in period documents — and Summa
        totals the column for you.
      </HelpIntroPara>
    </>
  )
}
