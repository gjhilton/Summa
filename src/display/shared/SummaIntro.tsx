import { styled } from '@/styled-system/jsx'

const IntroParagraph = styled('p', {
  base: {
    margin: 0,
    fontSize: '1rem',
    lineHeight: 1.6,
    color: 'black',
    maxWidth: '48ch',
  },
})

export function SummaIntro() {
  return (
    <IntroParagraph>
      <strong>Summa is a simple calculator for historians working with Early Modern English and Scottish accounts.</strong>{' '}
      Enter amounts as sterling pounds, shillings and pence in Roman
      numerals and Summa will add them up for you.
    </IntroParagraph>
  )
}
