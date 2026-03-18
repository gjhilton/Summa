import { HelpSection, HelpHeading, HelpPara, Roman } from './shared'

export function HelpHistoricalNote() {
  return (
    <HelpSection>
      <HelpHeading>Historical note</HelpHeading>

      <HelpPara>
        Early modern usage tended not to distinguish between u and v, nor between i
        and j. They are interchangeable in Summa. The letter j is the
        characteristically period form: it appears as the final character in a
        run of i's, so 2 is <Roman>ij</Roman>, 3 is <Roman>iij</Roman>, 4 is <Roman>iiij</Roman>, and 6 is <Roman>vj</Roman>. Note that
        4 is very often <Roman>iiij</Roman> in early modern usage rather than the classical subtractive
        <Roman> iv</Roman> — Summa accepts both forms.
      </HelpPara>

      <HelpPara>
        If you prefer conventional Roman numerals they work equally well. You
        can mix both styles freely within the same calculation.
      </HelpPara>

      <HelpPara>
        Other period exotica — for example <Roman>iijx</Roman> and <Roman>vjx</Roman> with the values
        of 13 and 16 respectively (by analogy to <em>tertio decimo</em> and <em>sexto decimo</em>) — are <em>not</em> supported,
        nor are multiplying superscripts, long hundreds, etc.
      </HelpPara>

      <HelpPara>
        Scribes tended to write <Roman>x</Roman>, <Roman>u</Roman>/<Roman>v</Roman> and <Roman>i</Roman>/<Roman>j</Roman> as minuscules (i.e. lower case) and <Roman>L</Roman>, <Roman>C</Roman>, <Roman>M</Roman> as majuscules (upper case), but Summa accepts any casing for input.
      </HelpPara>

      <HelpPara>
        Under the hood, Summa converts every field to an integer number of
        pence (£1 = 240d; 1s = 12d), sums the column, then converts the total
        back to pounds, shillings and pence and formats it as Roman numerals
        for display.
      </HelpPara>
    </HelpSection>
  )
}
