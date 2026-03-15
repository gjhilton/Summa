import type { ReactNode } from 'react'
import { styled } from '@/styled-system/jsx'
import { PageWidth } from './PageWidth'

const Header = styled('header', {
  base: { margin: '1rem 0 3rem' },
})

const HeaderBar = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
})

export const HeaderSpacer = styled('div', {
  base: { flex: 1 },
})

export function ScreenHeader({ children }: { children?: ReactNode }) {
  return (
    <Header data-no-print>
      <PageWidth>
        <HeaderBar>
          {children}
        </HeaderBar>
      </PageWidth>
    </Header>
  )
}
