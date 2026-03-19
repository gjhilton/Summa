import { styled } from '@/styled-system/jsx'
import { Logo } from './MainScreen'
import { Button } from './shared/Button'
import { ScreenContainer } from './shared/ScreenContainer'
import { ScreenFooter } from './shared/Footer'
import { PageWidth } from './shared/PageWidth'
import { SummaIntro } from './shared/SummaIntro'
import { HelpPara } from './help/shared'

const Content = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '2rem',
    paddingTop: '4rem',
    paddingBottom: '4rem',
  },
})

const LogoWrapper = styled('div', {
  base: { width: '100%', maxWidth: '320px' },
})

const ButtonRow = styled('div', {
  base: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
})

interface Props {
  onGetStarted: () => void
  onReadManual: () => void
}

export function SplashScreen({ onGetStarted, onReadManual }: Props) {
  return (
    <ScreenContainer background="grey">
      <PageWidth>
        <Content>
          <LogoWrapper>
            <Logo size="l" />
          </LogoWrapper>
          <SummaIntro />
          <HelpPara>
            Summa is beta software provided without warranty of correctness. It
            almost certainly contains defects — you are strongly advised to
            check any results against the source documents.
          </HelpPara>
          <HelpPara>
            Your work is stored only in your browser&rsquo;s local storage and
            never leaves your device. Summa does not collect analytics or user
            data, but it does use Google Fonts, which may do so independently.
            By continuing you agree to these terms.
          </HelpPara>
          <ButtonRow>
            <Button variant="primary" onClick={onGetStarted}>get started</Button>
            <Button onClick={onReadManual}>read manual</Button>
          </ButtonRow>
        </Content>
      </PageWidth>
      <ScreenFooter />
    </ScreenContainer>
  )
}
