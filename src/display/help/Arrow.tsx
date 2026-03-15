import { styled } from '@/styled-system/jsx'

const ArrowSvg = styled('svg', {
  base: { display: 'block', fill: '#f00' },
  variants: {
    direction: {
      down:     { transform: 'rotate(0deg)' },
      up:       { transform: 'rotate(180deg)' },
      right:    { transform: 'rotate(-90deg)' },
      left:     { transform: 'rotate(90deg)' },
      downLeft: { transform: 'rotate(45deg)' },
      downRight:{ transform: 'rotate(-45deg)' },
      upLeft:   { transform: 'rotate(135deg)' },
      upRight:  { transform: 'rotate(-135deg)' },
    },
  },
  defaultVariants: { direction: 'down' },
})

interface ArrowProps {
  direction?: 'down' | 'up' | 'right' | 'left' | 'downLeft' | 'downRight' | 'upLeft' | 'upRight'
}

// Fat arrow drawn pointing down; rotated via variant for other directions.
// ViewBox 24×40: shaft 10px wide centred, arrowhead full width.
export function Arrow({ direction = 'down' }: ArrowProps) {
  return (
    <ArrowSvg
      direction={direction}
      width="14"
      height="22"
      viewBox="0 0 24 40"
      aria-hidden="true"
    >
      <path d="M 7,0 L 17,0 L 17,22 L 24,22 L 12,40 L 0,22 L 7,22 Z" />
    </ArrowSvg>
  )
}
