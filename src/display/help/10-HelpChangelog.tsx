import { styled } from '@/styled-system/jsx'
import { HelpSection, HelpHeading } from './shared'

const ChangelogList = styled('ul', {
  base: {
    margin: 0,
    paddingLeft: '1.25rem',
    fontSize: '1rem',
    lineHeight: 1.6,
    color: '#333',
  },
})

const ChangelogItem = styled('li', {
  base: {},
})

export function HelpChangelog() {
  return (
    <HelpSection>
      <HelpHeading>Changelog</HelpHeading>
      <ChangelogList>
        <ChangelogItem>v0.9 — first public release</ChangelogItem>
      </ChangelogList>
    </HelpSection>
  )
}
