import { styled } from '@/styled-system/jsx'
import { HelpSection, HelpHeading, HelpPara } from './shared'

const HelpLink = styled('a', {
  base: {
    color: 'inherit',
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
  },
})

const HelpList = styled('ul', {
  base: {
    margin: 0,
    paddingLeft: '1.25rem',
    fontSize: '1rem',
    lineHeight: 1.8,
    color: '#333',
  },
})

export function HelpAbout() {
  return (
    <HelpSection>
      <HelpHeading>About Summa</HelpHeading>

      <HelpPara>
        If you find a bug or have a feature request, please open an issue on the{' '}
        <HelpLink href="https://github.com/gjhilton/Summa/issues">
          GitHub issues page
        </HelpLink>
        . Your ideas help other users too. Features currently under consideration include:
      </HelpPara>
      <HelpList>
        <li>support marks as input and output</li>
        <li>improved printed output</li>
        <li>export as LaTeX list</li>
        <li>copy calculations to clipboard</li>
        <li>allow items to include an obolus</li>
        <li>(your request here!)</li>
      </HelpList>
	  
	   <HelpPara>
	  If you've found Summa useful, you might also enjoy <a href="https://gjhilton.github.io/Sharpie/">our palaeography learning game, Sharpie</a>.
	  </HelpPara>
    </HelpSection>
  )
}
