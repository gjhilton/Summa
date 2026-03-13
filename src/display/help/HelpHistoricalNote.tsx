import { HelpSection, HelpHeading, HelpPara } from './shared'

export function HelpHistoricalNote() {
  return (
    <HelpSection>
      <HelpHeading>Historical note</HelpHeading>

      <HelpPara>
        Early modern clerks did not distinguish between u and v, nor between i
        and j — they are interchangeable in Summa. The letter j is the
        characteristically period form: it appears as the final character in a
        run of i's, so 2 is ij, 3 is iij, 4 is iiij, and 6 is vj. Note that
        4 is iiij in early modern usage rather than the classical subtractive
        iv — Summa accepts both forms.
      </HelpPara>

      <HelpPara>
        If you prefer conventional Roman numerals they work equally well. You
        can mix both styles freely within the same calculation.
      </HelpPara>
    </HelpSection>
  )
}
