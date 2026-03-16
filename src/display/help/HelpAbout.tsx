import { styled } from '@/styled-system/jsx'
import { HelpSection, HelpHeading, HelpPara } from './shared'

const HelpLink = styled('a', {
  base: {
    color: 'inherit',
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
  },
})

export function HelpAbout() {
  return (
    <HelpSection>
      <HelpHeading>About Summa</HelpHeading>

      <HelpPara>
        If you find a bug or have a feature requestplease open an issue on the{' '}
        <HelpLink href="https://github.com/gjhilton/Summa/issues">
          GitHub issues page
        </HelpLink>
        Features currently under consideration are
        - better printed output
        - copy calculations to clipboard
        - allow ine items to include an obolus
        - (your request here)!
      </HelpPara>
    </HelpSection>
  )
}
