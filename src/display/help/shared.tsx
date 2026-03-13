import { styled } from '@/styled-system/jsx'

export const HelpSection = styled('section', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    paddingBottom: '2rem',
  },
})

export const HelpHeading = styled('h2', {
  base: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: 'bold',
    letterSpacing: '0.01em',
  },
})

export const HelpPara = styled('p', {
  base: {
    margin: 0,
    fontSize: '1rem',
    lineHeight: 1.6,
    color: '#333',
    maxWidth: '48ch',
  },
})

export const ScreenSample = styled('div', {
  base: {
    background: 'white',
    borderRadius: '6px',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    width: '100%',
    boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
  },
})

export const ToggleRow = styled('div', {
  base: {
    display: 'flex',
    justifyContent: 'flex-start',
    padding: '1rem 1.5rem',
  },
})

// Wrapper that reserves space beside/above a ScreenSample for an Arrow annotation
export const AnnotatedSample = styled('div', {
  base: { position: 'relative' },
})

// Absolutely-positioned slot for an Arrow, targeting a named feature
export const ArrowAnchor = styled('div', {
  base: {
    position: 'absolute',
    pointerEvents: 'none',
    lineHeight: 0,
    zIndex: 10,
  },
  variants: {
    target: {
      // Tip lands at right edge of drag handle (2rem), vertically centred on item
      dragHandle: { top: '1.4rem', left: '0.5rem' },
    },
  },
})
