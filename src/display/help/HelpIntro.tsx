import { styled } from '@/styled-system/jsx'
import { Logo } from '@/display/MainScreen'

const Wrapper = styled('section', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '2rem',
    paddingTop: '2rem',
    paddingBottom: '2rem',
  },
})

const LogoCentre = styled('div', {
  base: { width: '100%', maxWidth: '320px' },
})

const Intro = styled('p', {
  base: {
    margin: 0,
    fontSize: '1rem',
    lineHeight: 1.6,
    textAlign: 'left',
    maxWidth: '48ch',
    color: '#333',
  },
})

export function HelpIntro() {
  return (
    <Wrapper>
      <LogoCentre>
        <Logo size="l" />
      </LogoCentre>
      <Intro>
        Summa is a calculator for historians working with Early Modern British
        accounts. Enter pounds, shillings and pence in Roman numerals — exactly
        as they appear in period documents — and Summa totals the column for you.
      </Intro>
    </Wrapper>
  )
}
