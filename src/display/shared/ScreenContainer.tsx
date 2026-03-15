import { styled } from '@/styled-system/jsx'

export const ScreenContainer = styled('main', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100dvh',
  },
  variants: {
    background: {
      grey: { background: '#f5f5f5' },
    },
  },
})
