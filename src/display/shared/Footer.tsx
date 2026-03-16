import type { ReactNode } from 'react'
import { styled } from '@/styled-system/jsx'
import { PageWidth } from './PageWidth'


const FooterBar = styled('footer', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginTop: 'auto',
    marginBottom: '1.5rem',
    paddingTop: '3rem',
  },
})

const FooterControls = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
})

const FooterCredits = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: '1rem',
    marginTop: '1rem',
  },
})

const FooterText = styled('div', {
  base: { fontStyle: 'italic' },
})

const FooterLink = styled('a', {
  base: {
    color: 'inherit',
    textDecoration: 'underline',
  },
})

const HelpButton = styled('button', {
  base: {
    flexShrink: 0,
    fontFamily: 'inherit',
    fontWeight: 'bold',
    fontStyle: 'normal',
    cursor: 'pointer',
    textDecoration: 'none',
    color: 'blue',
    background: 'none',
    border: 'none',
    padding: '0',
    _hover: { opacity: 0.6 },
  },
})

const GITHUB_URL = 'https://github.com/gjhilton/Summa'
const FUNERAL_GAMES_URL = 'http://funeralgames.co.uk'

interface ScreenFooterProps {
  controls?: ReactNode
  onHelp?: () => void
}

export function ScreenFooter({ controls, onHelp }: ScreenFooterProps) {
  return (
    <FooterBar data-no-print>
      <PageWidth>
        {controls && <FooterControls>{controls}</FooterControls>}
        <FooterCredits>
          <FooterText>
            Summa v{__APP_VERSION__}. Concept, design and{' '}
            <FooterLink href={GITHUB_URL} title="Summa on GitHub" target="_blank" rel="noopener noreferrer">code</FooterLink>
            {' '}copyright ©2026 g.j.hilton /{' '}
            <FooterLink href={FUNERAL_GAMES_URL} title="Funeral Games" target="_blank" rel="noopener noreferrer">funeral games</FooterLink>.
          </FooterText>
          {onHelp && <HelpButton type="button" onClick={onHelp}>help</HelpButton>}
        </FooterCredits>
      </PageWidth>
    </FooterBar>
  )
}
