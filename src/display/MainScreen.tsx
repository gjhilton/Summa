import React from 'react'
import { styled } from '@/styled-system/jsx'
import { cva } from '@/styled-system/css'
import { Button } from './shared/Button'
import { ScreenHeader, HeaderSpacer } from './shared/Header'
import { PageWidth } from './shared/PageWidth'
import type { IdPath } from '@/utils/calculationLogic'
import { ScreenFooter } from './shared/Footer'
import { ScreenContainer } from './shared/ScreenContainer'
import { ItemType } from '@/types/calculation'
import type { AnyLineState, LsdStrings, LsdBooleans } from '@/types/calculation'
import { formatLsdDisplay } from '@/utils/calculationLogic'
import { explain, explainTotal } from '@/utils/explanation'
import type { ExplanationTerm } from '@/utils/explanation'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DragCtx } from './DragCtx'

// ─── Swipe context ────────────────────────────────────────────────────────────

interface SwipeContextValue {
  openId: string | null
  setOpenId: (id: string | null) => void
}

const SwipeContext = React.createContext<SwipeContextValue>({ openId: null, setOpenId: () => {} })
function useSwipeContext() { return React.useContext(SwipeContext) }

export function SwipeProvider({ children }: { children: React.ReactNode }) {
  const [openId, setOpenId] = React.useState<string | null>(null)
  return (
    <SwipeContext.Provider value={{ openId, setOpenId }}>
      {children}
    </SwipeContext.Provider>
  )
}

// ─── Hover capability (evaluated once at module load) ─────────────────────────

const canHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

// ─── Action strip ─────────────────────────────────────────────────────────────

// visible: true  = opaque and interactive
// visible: false = faded and non-interactive (desktop hover devices only)
const ActionStripWrapper = styled('div', {
  base: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '240px',
    display: 'flex',
    zIndex: 1,
    overflow: 'hidden',
    background: '#e8e8e8',
    boxShadow: 'inset 8px 0 16px -4px rgba(0,0,0,0.25)',
    transition: 'opacity 0.2s ease, transform 0.2s ease',
  },
  variants: {
    visible: {
      true:  { opacity: 1, transform: 'translateX(0)',    pointerEvents: 'auto' },
      false: { opacity: 0, transform: 'translateX(12px)', pointerEvents: 'none' },
    },
  },
})

const ActionButton = styled('button', {
  base: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.65rem',
    fontFamily: 'inherit',
    color: '#333',
    padding: '0 4px',
    lineHeight: 1.2,
    background: 'transparent',
  },
})

const ActionButtonIcon = styled('span', {
  base: { fontSize: '1rem' },
})

interface ActionStripProps {
  onClose: () => void
  desktopVisible: boolean
  onRemove?: () => void
  onDuplicate?: () => void
  onClearItem?: () => void
}

function ActionStrip({ onClose, desktopVisible, onRemove, onDuplicate, onClearItem }: ActionStripProps) {
  // Touch: always visible. Desktop: fades in/out on row hover.
  const visible = !canHover || desktopVisible
  return (
    <ActionStripWrapper visible={visible}>
      <ActionButton onClick={onRemove ?? onClose} aria-label="Delete row">
        <ActionButtonIcon>🗑</ActionButtonIcon>
        Delete
      </ActionButton>
      <ActionButton onClick={() => { onDuplicate?.(); onClose() }} aria-label="Duplicate row">
        <ActionButtonIcon>⧉</ActionButtonIcon>
        Duplicate
      </ActionButton>
      <ActionButton onClick={() => { onClearItem?.(); onClose() }} aria-label="Clear item">
        <ActionButtonIcon>✕</ActionButtonIcon>
        Clear
      </ActionButton>
    </ActionStripWrapper>
  )
}

// ─── Item layout ──────────────────────────────────────────────────────────────

const StyledItem = styled('div', {
  base: {
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'stretch',
    marginBottom: '0.25rem',
  },
  variants: {
    sideMargins: {
      true: {
        marginLeft: '1.5rem',
        marginRight: '1.5rem',
      },
    },
  },
})

const ContentWrapper = styled('div', {
  base: {
    flex: 1,
    minWidth: 0,
    position: 'relative',
    zIndex: 2,
    borderTopWidth: '1px',
    borderBottomWidth: '1px',
    borderTopStyle: 'solid',
    borderBottomStyle: 'solid',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    paddingTop: '0',
    paddingBottom: '1rem',
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
    transition: 'transform 0.25s ease, background 0.25s ease, box-shadow 0.25s ease',
  },
  variants: {
    open: {
      true: {
        transform: 'translateX(-240px)',
        boxShadow: '6px 0 16px rgba(0,0,0,0.3)',
      },
      false: {
        transform: 'translateX(0)',
        boxShadow: 'none',
      },
    },
    bg: {
      default: { background: 'white' },
      error:   { background: '#fee2e2' },
      open:    { background: '#fef9e0' },
    },
    swipeable: {
      true: { touchAction: 'pan-y' },
    },
    sideMargins: {
      true: {
        paddingLeft: '0',
        paddingRight: '0',
      },
    },
    borders: {
      total: {
        borderTopWidth: '3px',
        borderBottomWidth: '3px',
        borderTopStyle: 'double',
        borderBottomStyle: 'double',
        borderTopColor: 'black',
        borderBottomColor: 'black',
        paddingTop: { base: '0.25rem', md: '1rem' },
        paddingBottom: '1rem',
      },
    },
  },
  defaultVariants: { open: false },
})

// ─── Drag handle ──────────────────────────────────────────────────────────────

const DragHandleButton = styled('button', {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: '2rem',
    border: 'none',
    background: 'transparent',
    cursor: 'grab',
    color: 'rgba(0,0,0,0.2)',
    touchAction: 'none',
    userSelect: 'none',
    padding: 0,
    zIndex: 3,
    _hover: { color: 'rgba(0,0,0,0.5)' },
    _active: { cursor: 'grabbing' },
  },
})

export const GripIcon = () => (
  <svg viewBox="0 0 10 16" width="10" height="16" fill="currentColor" aria-hidden="true">
    <circle cx="3" cy="3"  r="1.5" />
    <circle cx="7" cy="3"  r="1.5" />
    <circle cx="3" cy="8"  r="1.5" />
    <circle cx="7" cy="8"  r="1.5" />
    <circle cx="3" cy="13" r="1.5" />
    <circle cx="7" cy="13" r="1.5" />
  </svg>
)

export function DragHandle() {
  const ctx = React.useContext(DragCtx)
  if (!ctx) return null
  return (
    <DragHandleButton type="button" aria-label="Drag to reorder" {...ctx.listeners} {...ctx.attributes}>
      <GripIcon />
    </DragHandleButton>
  )
}

// ─── Item — pure display component ───────────────────────────────────────────

interface ItemProps {
  borders?: 'total'
  sideMargins?: boolean
  showActions?: boolean
  isOpen?: boolean
  error?: boolean
  desktopVisible?: boolean
  onClose?: () => void
  onRemove?: () => void
  onDuplicate?: () => void
  onClearItem?: () => void
  onTouchStart?: React.TouchEventHandler
  onTouchMove?: React.TouchEventHandler
  onTouchEnd?: React.TouchEventHandler
  onMouseEnter?: React.MouseEventHandler
  onMouseLeave?: React.MouseEventHandler
  children: React.ReactNode
}

export function Item({
  borders,
  sideMargins = false,
  showActions = false,
  isOpen = false,
  error = false,
  desktopVisible = false,
  onClose,
  onRemove,
  onDuplicate,
  onClearItem,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onMouseEnter,
  onMouseLeave,
  children,
}: ItemProps) {
  const bg = error ? 'error' : isOpen ? 'open' : 'default'
  return (
    <StyledItem sideMargins={sideMargins || undefined} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {showActions && <ActionStrip onClose={onClose!} desktopVisible={desktopVisible} onRemove={onRemove} onDuplicate={onDuplicate} onClearItem={onClearItem} />}
      <DragHandle />
      <ContentWrapper
        borders={borders}
        open={isOpen}
        bg={bg}
        swipeable={showActions || undefined}
        sideMargins={sideMargins || undefined}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {children}
      </ContentWrapper>
    </StyledItem>
  )
}

// ─── SwipeableItem — stateful container ──────────────────────────────────────

export function SwipeableItem({ children, onRemove, onDuplicate, onClearItem, error }: { children: React.ReactNode, onRemove?: () => void, onDuplicate?: () => void, onClearItem?: () => void, error?: boolean }) {
  const id = React.useId()
  const { openId, setOpenId } = useSwipeContext()
  const isOpen = openId === id
  const [hovered, setHovered] = React.useState(false)
  const startX = React.useRef<number | null>(null)
  const startY = React.useRef<number | null>(null)
  const isVertical = React.useRef(false)

  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX
    startY.current = e.touches[0].clientY
    isVertical.current = false
  }

  function onTouchMove(e: React.TouchEvent) {
    if (isVertical.current) return
    const dx = e.touches[0].clientX - startX.current!
    const dy = e.touches[0].clientY - startY.current!
    if (Math.abs(dy) > Math.abs(dx)) isVertical.current = true
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (isVertical.current) return
    const dx = e.changedTouches[0].clientX - startX.current!
    if (dx < -40) setOpenId(id)
    else if (dx > 20) setOpenId(null)
  }

  function onClose() {
    setOpenId(null)
    setHovered(false)
  }

  return (
    <Item
      showActions
      isOpen={isOpen}
      error={error}
      desktopVisible={canHover && hovered}
      onClose={onClose}
      onRemove={onRemove}
      onDuplicate={onDuplicate}
      onClearItem={onClearItem}
      onMouseEnter={canHover ? () => setHovered(true) : undefined}
      onMouseLeave={canHover ? () => setHovered(false) : undefined}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {children}
    </Item>
  )
}

// ─── Explanation helpers ──────────────────────────────────────────────────────

const SupD = () => <sup>d</sup>

function renderExplanationTerms(terms: ExplanationTerm[]): React.ReactNode[] {
  return terms.flatMap((t, i) => {
    const term = t.multiplier === 1
      ? <React.Fragment key={i}>{t.pence}<SupD /></React.Fragment>
      : <React.Fragment key={i}>({t.integer} × {t.multiplier}<SupD /> = {t.pence}<SupD />)</React.Fragment>
    return i === 0 ? [term] : [' + ', term]
  })
}

function renderExplanation(line: AnyLineState): React.ReactNode {
  const result = explain(line)
  if (!result) return null
  switch (result.type) {
    case 'lsd':
      return <>{renderExplanationTerms(result.terms)} = {result.totalPence}<SupD /></>
    case 'extended':
      return <>{renderExplanationTerms(result.unitCostTerms)} = {result.basePence}<SupD /> unit cost × {result.quantity} = {result.totalPence}<SupD /></>
    case 'total':
      return null
  }
}

function formatFieldList(labels: string[]): string {
  if (labels.length === 1) return `${labels[0]} field`
  return `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]} fields`
}

function renderErrorExplanation(line: AnyLineState): React.ReactNode | null {
  switch (line.itemType) {
    case ItemType.LINE_ITEM: {
      const labels = (['l', 's', 'd'] as const).filter(f => line.fieldErrors[f]).map(f => f === 'l' ? 'li' : f)
      if (labels.length === 0) return null
      return <>this item has an error: only Roman numerals allowed in {formatFieldList(labels)}</>
    }
    case ItemType.EXTENDED_ITEM: {
      const invalidFields = [
        ...(['l', 's', 'd'] as const).filter(f => line.fieldErrors[f]).map(f => f === 'l' ? 'li' : f),
        ...(line.quantityError && line.quantity.trim() ? ['quantity'] : []),
      ]
      const quantityMissing = line.quantityError && !line.quantity.trim()
      if (invalidFields.length === 0 && !quantityMissing) return null
      const parts: string[] = []
      if (invalidFields.length > 0) parts.push(`only Roman numerals allowed in ${formatFieldList(invalidFields)}`)
      if (quantityMissing) parts.push('quantity is required')
      return <>this item has an error: {parts.join('; ')}</>
    }
    case ItemType.SUBTOTAL_ITEM:
      if (!line.error) return null
      return <>this item has an error: a sub-item contains invalid input</>
  }
}

function renderTotalExplanation(totalDisplay: LsdStrings, totalPence: number): React.ReactNode {
  const result = explainTotal(totalDisplay, totalPence)
  if (!result) return null
  return <>{result.totalPence}<SupD /> = {renderExplanationTerms(result.terms)}</>
}

// ─── Field primitives ─────────────────────────────────────────────────────────

const Equally = styled('div', {
  base: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(0, 1fr))',
  },
})

const TextFieldBox = styled('div', {
  base: { paddingRight: '1.5rem' },
})

const Block = styled('div', {
  base: { marginTop: '1rem' },
  variants: {
    indented: {
      true: { paddingLeft: '2rem' },
    },
  },
})

const BlockRow = styled('div', {
  base: {
    display: { base: 'block', md: 'flex' },
    '& > *': { flex: '1' },
    '& > *:last-child': { flex: '0 0 33.333%' },
  },
  variants: {
    centerItems: {
      true: { alignItems: { md: 'center' } },
    },
  },
})

const ExplanationRow = styled('div', {
  base: {
    textAlign: 'right',
    fontSize: '0.8em',
    opacity: 0.65,
    fontStyle: 'italic',
    paddingTop: '0.25rem',
  },
  variants: {
    isError: {
      true: { color: '#ff0000', opacity: 1, fontStyle: 'normal' },
    },
  },
})

const Label = styled('label', {
  base: {
    display: 'flex',
    alignItems: 'center',
  },
})

// Shared base for inline label annotations (currency symbols, operators)
const FieldAnnotation = styled('span', {
  base: {
    flexShrink: 0,
    paddingLeft: '0.25rem',
    paddingRight: '0.65rem',
  },
  variants: {
    large: {
      true: { fontSize: '1.1em' },
    },
    sup: {
      true: { verticalAlign: 'super', fontSize: '0.75em' },
    },
    dim: {
      true: { opacity: 0.2 },
    },
  },
})

const inputRecipe = cva({
  base: {
    border: '0',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
    flex: '1',
    width: '100%',
    minWidth: '0',
    outline: 'none',
    transition: 'all 0.2s',
  },
  variants: {
    align: {
      l: { textAlign: 'left' },
      r: { textAlign: 'right' },
    },
    editable: {
      true: {
        bg: 'transparent',
        borderBottomColor: 'rgba(0,0,0,0.1)',
        _focus: { borderBottomColor: 'black' },
      },
    },
    error: {
      true: { color: '#ff0000' },
    },
    bold: {
      true: { fontWeight: 'bold' },
    },
    numeric: {
      true: {
        fontSize: '1.4em',
        paddingTop: '0',
        paddingBottom: '0',
        lineHeight: '1',
      },
    },
  },
  defaultVariants: {
    align: 'l',
  },
})

const StyledInput = styled('input', inputRecipe)

// ─── Exported field components ────────────────────────────────────────────────

interface TextInputProps {
  value: string
  editable?: boolean
  numeric?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  align?: 'l' | 'r'
  bold?: boolean
  error?: boolean
}

export function TextInput({ editable, numeric, value, onChange, align, bold, error }: TextInputProps) {
  return (
    <StyledInput
      editable={editable || undefined}
      numeric={numeric || undefined}
      value={value}
      onChange={editable ? onChange : undefined}
      readOnly={!editable}
      align={align}
      bold={bold || undefined}
      error={error || undefined}
      autoCapitalize="off"
      autoCorrect="off"
      spellCheck={false}
    />
  )
}

interface TextFieldProps {
  value: string
  label?: string
  editable?: boolean
  align?: 'l' | 'r'
  onChange?: (v: string) => void
}

export const TextField = ({ value, label, editable, align, onChange }: TextFieldProps) =>
  <TextFieldBox>
    <Label>
      {label}
      <TextInput value={value} editable={editable} align={align} bold onChange={e => onChange?.(e.target.value)} />
    </Label>
  </TextFieldBox>

interface QuantityFieldProps {
  value: string
  editable?: boolean
  onChange?: (v: string) => void
  error?: boolean
}

export const QuantityField = ({ value, editable, onChange, error }: QuantityFieldProps) =>
  <Label>
    <FieldAnnotation large>✕</FieldAnnotation>
    <TextInput align="r" numeric value={value} editable={editable} onChange={e => onChange?.(e.target.value)} error={error || undefined} />
    <FieldAnnotation>@</FieldAnnotation>
  </Label>

interface CurrencyFieldProps {
  value: string
  label: string
  editable?: boolean
  onChange?: (v: string) => void
  error?: boolean
}

export const CurrencyField = ({ value, label, editable, onChange, error }: CurrencyFieldProps) =>
  <Label>
    <TextInput align="r" numeric value={value === '0' ? '' : value} editable={editable} onChange={e => onChange?.(e.target.value)} error={error || undefined} />
    <FieldAnnotation sup dim={value === '0' || undefined}>{label}</FieldAnnotation>
  </Label>

interface CurrencyProps {
  editable?: boolean
  values?: LsdStrings
  onFieldChange?: (field: 'l' | 's' | 'd', value: string) => void
  fieldErrors?: LsdBooleans
}

export const Currency = ({ editable, values = { l: 'x', s: 'vj', d: 'iij' }, onFieldChange, fieldErrors }: CurrencyProps) =>
  <Equally>
    <CurrencyField label="li" editable={editable} value={values.l} onChange={v => onFieldChange?.('l', v)} error={fieldErrors?.l || undefined} />
    <CurrencyField label="s"  editable={editable} value={values.s} onChange={v => onFieldChange?.('s', v)} error={fieldErrors?.s || undefined} />
    <CurrencyField label="d"  editable={editable} value={values.d} onChange={v => onFieldChange?.('d', v)} error={fieldErrors?.d || undefined} />
  </Equally>

interface BlockTitleProps {
  title: string
  editable?: boolean
  children?: React.ReactNode
  onChange?: (v: string) => void
}

export const BlockTitle = ({ title, children, editable, onChange }: BlockTitleProps) =>
  <Block>
    <Equally>
      <TextField value={title} editable={editable} onChange={onChange} />
      {children}
    </Equally>
  </Block>

interface BlockCurrencyProps {
  editable?: boolean
  values?: LsdStrings
  onFieldChange?: (field: 'l' | 's' | 'd', value: string) => void
  fieldErrors?: LsdBooleans
}

export const BlockCurrency = ({ editable, values, onFieldChange, fieldErrors }: BlockCurrencyProps) =>
  <Block>
    <Currency editable={editable} values={values} onFieldChange={onFieldChange} fieldErrors={fieldErrors} />
  </Block>

// ─── Logo ─────────────────────────────────────────────────────────────────────

const LogoWrapper = styled('div', {
  base: { display: 'inline-block' },
})

const FadedGroup = styled('g', {
  base: { opacity: 0.85 },
})

const LogoSvg = styled('svg', {
  base: {
    width: '100%',
    height: 'auto',
    '& .ink': { fill: 'black' },
    '& .red': { fill: '#b91c1c' },
  },
  variants: {
    size: {
      s: { maxWidth: '150px' },
      m: { maxWidth: '300px' },
      l: { maxWidth: '500px' },
    },
  },
  defaultVariants: { size: 'm' },
})

interface LogoProps {
  size?: 's' | 'm' | 'l'
}

export function Logo({ size = 'm' }: LogoProps) {
  return (
    <LogoWrapper>
      <LogoSvg
        size={size}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 158.59 52.42"
        aria-label="Summa"
        role="img"
      >
        <line className="ink" x1="53.13" y1="46.22" x2="46.12" y2="52.42" />
        <FadedGroup>
          <path className="red" d="M111.67,44.43c.17,0,.34-.02.51-.02-.09-.03-.18-.07-.27-.15-.12-.04-.16.07-.24.17Z" />
          <path className="red" d="M112.66,44.39s.06,0,.09,0c.03-.02.05-.03.07-.05-.05.02-.11.04-.16.05Z" />
          <path className="red" d="M113.53,44.19c-.16-.01-.31.02-.45.06.13.02.28.01.45-.06Z" />
          <path className="red" d="M112.81,44.14c.06.07.1.14.01.2,0,0,0,0,0,0,.09-.03.17-.06.26-.09-.1-.02-.19-.06-.27-.11Z" />
          <path className="red" d="M112.81,44.14c-.06-.06-.15-.12-.18-.16.05.06.11.11.18.16Z" />
          <path className="red" d="M112.88,42.43c.08-.06.11.42.28.29.4-.17.74-.42,1.13-.46.17-.12.5.38.66.26.4-.17,1.41-.92.78-.83-.94.16-1.54.35-2.38.52-.67.26-1.31.55-2,.79-.2.04-.38.02-.57,0,.25.05.5.1.79.15.37.1.75-.56,1.31-.72Z" />
          <path className="red" d="M107.88,44.5c.08-.06.25-.19.25-.19.43.31.83.13,1.24-.04-.07-.07-.14-.15-.21-.22-.24.05-.25.19-.03.27-.51-.24-.97-.25-1.44-.15.04.13.05.28.19.33Z" />
          <path className="red" d="M107.42,44.24c.09-.02.18-.05.27-.07,0-.01,0-.03-.01-.04-.09.03-.18.06-.27.1,0,0,0,0,.01.01Z" />
          <path className="red" d="M115.38,43.57c1.18-.13,2.29-.21,3.39-.27.07-.1.12-.21.24-.17.09.08.18.12.27.15.16,0,.32-.01.48-.02.05-.02.11-.03.16-.05,0,0,0,0,0,0,.08-.06.05-.13-.01-.2-.07-.04-.13-.1-.18-.16.03.04.12.09.18.16.08.05.17.09.27.11.14-.04.29-.07.45-.06-.17.07-.32.09-.45.06-.09.03-.18.06-.26.09-.02.02-.05.03-.07.05.36-.01.73-.02,1.09-.03.08-.02.16-.04.22-.06.26-.09.51-.18.69.04.06,0,.13,0,.19,0-.01-.01-.03-.02-.04-.04.03.01.06.03.08.04.27,0,1.17-.25,1.34-.34,0,0,.33-.18.49-.05.25-.11.59-.06.88.15-.32.23-.62.06-.88-.15-.12.05-.22.14-.28.27-.07-.07-.21-.22-.21-.22-.18.09-.35.22-.52.32.54,0,1.08-.02,1.64-.03,3.58-.03,6.85-.4,10.56-.52,2.01-.05,3.95-.03,5.85.07,3.8.2,7.17-.76,11.07.08,1.49.29,4.17-.2,5.57-.38,1.8-.97.64-2.93.54-3.04-1.32-1.64-2.13-.58-4.58-1.39,1.66.43-1.08,1.24-2.7.18-2.36-1.62-5.35.14-8.09-.07-.69-.05-1.4.1-2.21.14-4.25-.22-8.06.92-12.48,1.19-1.17.12-2.15.66-3.11.99-.71.15-1.5-.01-2.08.04-.92.09-1.69.33-2.43.61.84-.17,1.44-.35,2.38-.52.63-.09-.38.65-.78.83-.17.12-.5-.38-.67-.26-.39.04-.72.29-1.13.46-.17.12-.19-.36-.28-.3-.56.16-.94.82-1.31.72-.28-.04-.54-.1-.79-.15-.16-.01-.31-.02-.47.02-.1.05-.2.1-.3.15q.1.14,0,0c-.72.35-1.56.69-2.34.97,0,.01.01.03.01.04.46-.09.92-.09,1.44.15-.22-.09-.21-.22.03-.27.07.07.14.15.21.22-.4.17-.81.35-1.24.04,0,0-.17.12-.25.19-.14-.05-.15-.2-.19-.33-.09.02-.18.04-.27.06.22.22.86.47.86.47Z" />
          <path className="red" d="M120.19,43.13c-.06.02-.14.04-.22.06.3,0,.61-.01.92-.02-.18-.22-.44-.13-.69-.04Z" />
        </FadedGroup>
        <g>
          <path className="ink" d="M13.2,29.6c-.12-.24-.3-.34-.51-.31-.84.1-1.56.17-2.42.17-5.33,0-10.26-2.54-10.26-8.75,0-5.83,5.89-11.43,11.91-14.71C18.28,2.51,26.09,0,34.95,0c9.4,0,16.82,2.51,22.02,7.49.96.92.57,1.46-.45.61-5.15-4.37-11.97-6.71-20.59-6.71-9.87,0-19.15,3.56-25.22,6.95-1.71.95-2.69,1.53-3.59,2.31-1.41,1.22-3.02,4.14-3.02,7.49,0,4.85,3.23,7.39,7,8.07.3.03.42-.17.3-.47-.6-1.66-1.14-3.49-1.14-5.66,0-2.71,1.08-5.22,4.01-7.73,3.35-2.85,7.39-5.05,12.18-5.05,1.97,0,3.98.34,5.92.68,5.87,1.02,11.88,2.07,16.67,4.75,1.14.64,2.21,1.53,2.78,2.81.27.61-3.68,3.59-4.04,2.81-.57-1.22-1.5-2.03-2.6-2.64-4.7-2.58-10.74-3.73-16.61-4.75-1.95-.34-3.86-.61-5.75-.61-5,0-8.47,1.7-8.47,7.02,0,3.36,1.17,6.24,2.39,8.58.12.24.3.34.51.31,3.86-.41,7.39-1.12,11.16-1.93l9.1-2c3.56-.78,7.18-1.36,11.4-1.36,5.12,0,12.9,1.42,12.9,7.12,0,5.09-6.82,8.92-10.92,10.51-3.98,1.56-8.2,2.41-13.14,2.41-11.1,0-20.05-3.53-24.57-11.39ZM53.38,35.74c2.84-1.15,4.37-2.1,4.37-4.98,0-2.41-1.44-3.87-2.9-4.75-2.66-1.63-5.83-2.07-9.49-2.07-4.19,0-7.36.75-11.01,1.66-5.18,1.29-10.29,2.07-15.47,2.81-.3.03-.42.24-.27.44,4.7,6.31,12.87,9.19,22.71,9.19,4.46,0,8.65-.92,12.06-2.31Z" />
          <path className="ink" d="M75.72,32.52c-.12-.92-.33-2.03-.42-2.48-.27-1.46-.39-2.03-.72-2.98-.09-.27-.3-.27-.42-.27-.45,0-.72.78-.93,1.46-.57,1.76-1.68,3.42-2.45,4.41-.3.41-.9,1.12-1.5,1.12-1.11,0-1.56-.98-2-2.44-.36-1.22-.48-2.47-.57-3.93-.06-1.15-.24-2.78-.84-2.78-.42,0-1.17.92-1.53,1.83-.24.64-.51.95-.75.95-.12,0-.24-.14-.24-.47,0-.51.3-1.36.51-1.76.99-1.93,2.57-3.29,4.1-4.44.33-.24.57-.37.87-.37,1.32,0,1.35,2.98,1.35,4.92,0,.78,0,.95.06,2.07.03.51.18.85.42.85.12,0,.42-.2.69-.51,1.35-1.56,2.03-2.75,2.72-3.97.54-.95,1.41-2.41,2.42-2.41.84,0,1.35,1.05,1.5,2.27.18,1.39.42,2.78.6,3.63.15.68.48,1.97.78,1.97.27,0,.51,0,1.14-.64v2.24c-.96,1.02-1.14,1.83-2.06,2.64-.78.68-1.14.78-1.83.78-.57,0-.78-.75-.9-1.66Z" />
          <path className="ink" d="M106.03,33.09c0-.27.06-.44.06-.71,0-.92-.42-3.83-.6-4.95-.12-.78-.39-1.76-1.08-1.76-.33,0-.78.54-.93.75-.81,1.08-2.54,3.83-4.28,6.44-.27.41-.66.71-1.23.71-.63,0-.75-.58-.84-1.25-.18-1.39.21-5.15-.6-6.37-.18-.27-.78-.61-1.26-.61-.15,0-.33.03-.6.2-.45.27-1.59,1.42-1.85,1.73-.42.47-.81.98-1.08,1.76l-1.23,3.53c-.33.95-.9,1.49-1.41,1.49-.27,0-.48-.07-.78-.61-.6-1.08-.51-4.17-.63-5.53-.15-1.93-.45-2.85-1.17-2.85s-3.47,2.92-6.04,5.7v-2.24c1.83-1.86,4.46-4.81,5.3-5.76.48-.54,1.83-1.53,2.78-1.53,1.17,0,1.83.85,2.03,1.83.21.95.21,2.44.39,3.63.06.37.33.41.54.1,1.44-2.1,4.88-5.02,5.54-5.56.6-.51.81-.61,1.02-.61,1.14,0,1.65,1.53,1.85,3.09.06.44.09,1.63.09,2.75,0,.51,0,1.02-.03,1.46-.03.37.15.47.39.17,1.08-1.39,2.81-3.32,4.01-3.9l.36-.17c.06-.03.15-.14.15-.2.18-.85.57-1.63,1.11-2.1.39-.34,1.47-.88,1.98-.88.33,0,.45.34.54.81.03.2.03.61.03,1.97v3.66c0,.95.21,2.41,1.02,2.41.75,0,1.5-.51,2.09-1.15v2.24c-1.17,1.22-3.29,3.46-4.79,3.46-.45,0-.87-.44-.87-1.12Z" />
          <path className="ink" d="M135.75,33.09c0-.27.18-.88.36-1.46.3-.92.51-4.07.51-4.2,0-.78-.48-1.76-1.05-1.76-.33,0-.75.54-.9.75-.81,1.08-2.6,3.83-4.28,6.44-.27.41-.66.71-1.23.71-.63,0-.75-.58-.84-1.25-.18-1.39.21-5.15-.6-6.37-.18-.27-.78-.61-1.26-.61-.15,0-.33.03-.6.2-.45.27-1.59,1.42-1.86,1.73-.42.47-.81.98-1.08,1.76l-1.23,3.53c-.33.95-.9,1.49-1.41,1.49-.27,0-.48-.07-.78-.61-.57-1.05-.48-3.93-.63-5.53-.15-1.93-.45-2.85-1.17-2.85s-3.47,2.92-6.04,5.7v-2.24c1.83-1.86,4.46-4.81,5.3-5.76.48-.54,1.83-1.53,2.78-1.53,1.17,0,1.83.85,2.04,1.83.21.95.21,2.44.39,3.63.06.37.33.41.54.1,1.44-2.1,4.88-5.02,5.54-5.56.6-.51.81-.61,1.02-.61,1.14,0,1.65,1.53,1.85,3.09.06.44.09,1.63.09,2.75,0,.51,0,1.02-.03,1.46-.03.37.15.47.39.17,1.08-1.39,2.81-3.32,4.01-3.9l.36-.17c.06-.03.15-.14.15-.2.18-.85.57-1.63,1.11-2.1.39-.34,1.47-.88,1.98-.88.27,0,.39.37.48.81.12.64.18,1.29.18,1.97s-.12,2.17-.45,3.8c-.39,1.97-.57,2.51-1.65,5.73-.21.64-.81,1.08-1.14,1.08-.45,0-.87-.44-.87-1.12Z" />
          <path className="ink" d="M149.43,32.92c-.12-.14-.33-.17-.45-.03-1.05.88-2.06.88-3.47.88-2.9,0-4.31-1.63-4.31-4.92,0-5.49,5.98-8.85,10.95-8.85.9,0,2.39.37,2.93,1.02.09.1.15.27.15.44,0,.14-.06.27-.12.37-1.35,1.97-1.83,3.25-1.83,4.54,0,3.93,1.35,5.42,4.43,6.07.18.03.27.17.27.34s-.09.34-.21.51c-1.17,1.56-2.36,2.61-3.8,2.61s-3.44-1.59-4.55-2.98ZM149.31,30.48c.15-1.59.9-3.83,1.92-6.51.12-.27-.06-.44-.42-.41-3.05.2-6.19,1.7-6.19,4.14,0,1.83,1.53,3.02,4.34,3.15.21,0,.33-.14.36-.37Z" />
        </g>
      </LogoSvg>
    </LogoWrapper>
  )
}

// ─── Composite item components ────────────────────────────────────────────────

const EditLink = styled('button', {
  base: {
    flexShrink: 0,
    fontFamily: 'inherit',
    fontStyle: 'italic',
    fontSize: '0.85em',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: '0 0.5rem',
    textDecoration: 'underline',
    opacity: 0.45,
    _hover: { opacity: 1 },
  },
})

interface ItemUnitProps {
  title: string
  literals: LsdStrings
  explanation?: React.ReactNode
  explanationIsError?: boolean
  onTitleChange?: (v: string) => void
  onFieldChange?: (field: 'l' | 's' | 'd', value: string) => void
  onRemove?: () => void
  onDuplicate?: () => void
  onClearItem?: () => void
  fieldErrors?: LsdBooleans
  error?: boolean
}

export const ItemUnit = ({ title, literals, explanation, explanationIsError, onTitleChange, onFieldChange, onRemove, onDuplicate, onClearItem, fieldErrors, error }: ItemUnitProps) =>
  <SwipeableItem onRemove={onRemove} onDuplicate={onDuplicate} onClearItem={onClearItem} error={error}>
    <BlockRow>
      <BlockTitle title={title} editable onChange={onTitleChange} />
      <BlockCurrency editable values={literals} onFieldChange={onFieldChange} fieldErrors={fieldErrors} />
    </BlockRow>
    {explanation && <ExplanationRow isError={explanationIsError || undefined}>{explanation}</ExplanationRow>}
  </SwipeableItem>

interface ItemExtendedProps {
  title: string
  literals: LsdStrings
  quantity: string
  explanation?: React.ReactNode
  explanationIsError?: boolean
  onTitleChange?: (v: string) => void
  onFieldChange?: (field: 'l' | 's' | 'd', value: string) => void
  onQuantityChange?: (v: string) => void
  onRemove?: () => void
  onDuplicate?: () => void
  onClearItem?: () => void
  fieldErrors?: LsdBooleans
  quantityError?: boolean
  resultDisplay?: LsdStrings
  error?: boolean
}

export const ItemExtended = ({ title, literals, quantity, explanation, explanationIsError, onTitleChange, onFieldChange, onQuantityChange, onRemove, onDuplicate, onClearItem, fieldErrors, quantityError, resultDisplay, error }: ItemExtendedProps) =>
  <SwipeableItem onRemove={onRemove} onDuplicate={onDuplicate} onClearItem={onClearItem} error={error}>
    <BlockRow>
      <BlockTitle title={title} editable onChange={onTitleChange}>
        <QuantityField editable value={quantity} onChange={onQuantityChange} error={quantityError || undefined} />
      </BlockTitle>
      <BlockCurrency editable values={literals} onFieldChange={onFieldChange} fieldErrors={fieldErrors} />
      <BlockCurrency values={resultDisplay} />
    </BlockRow>
    {explanation && <ExplanationRow isError={explanationIsError || undefined}>{explanation}</ExplanationRow>}
  </SwipeableItem>

interface ItemSubTotalProps {
  title: string
  count?: number
  totalDisplay: LsdStrings
  onEdit: () => void
  onRemove?: () => void
  onDuplicate?: () => void
  onClearItem?: () => void
  explanation?: React.ReactNode
  explanationIsError?: boolean
  error?: boolean
}

export const ItemSubTotal = ({ title, count = 0, totalDisplay, onEdit, onRemove, onDuplicate, onClearItem, explanation, explanationIsError, error }: ItemSubTotalProps) =>
  <SwipeableItem onRemove={onRemove} onDuplicate={onDuplicate} onClearItem={onClearItem} error={error}>
    <BlockRow>
      <Block>
        <Label>
          <TextInput value={`${title} (${count} items)`} editable={false} bold />
          <EditLink type="button" onClick={onEdit}>edit</EditLink>
        </Label>
      </Block>
      <BlockCurrency values={totalDisplay} />
    </BlockRow>
    {explanation && <ExplanationRow isError={explanationIsError || undefined}>{explanation}</ExplanationRow>}
  </SwipeableItem>

interface ItemTotalProps {
  totalDisplay: LsdStrings
  explanation?: React.ReactNode
}

export const ItemTotal = ({ totalDisplay, explanation }: ItemTotalProps) =>
  <Item borders="total" sideMargins>
    <BlockRow centerItems>
      <Block indented><Logo size="s" /></Block>
      <BlockCurrency values={totalDisplay} />
    </BlockRow>
    {explanation && <ExplanationRow>{explanation}</ExplanationRow>}
  </Item>

// ─── Add item bar ─────────────────────────────────────────────────────────────

const AddBar = styled('div', {
  base: {
    display: 'flex',
    gap: '0.5rem',
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
    paddingTop: { base: '0.25rem', md: '0.75rem' },
    paddingBottom: { base: '1rem', md: '0.75rem' },
    justifyContent: { md: 'flex-end' },
  },
})

const PlusIcon = () => <strong>+</strong>

interface AddItemBarProps {
  advanced?: boolean
  onAdd: () => void
  onAddUnit: () => void
  onAddExtended: () => void
  onAddSubtotal: () => void
}

export const AddItemBar = ({ advanced, onAdd, onAddUnit, onAddExtended, onAddSubtotal }: AddItemBarProps) =>
  <AddBar>
    {advanced ? <>
      <Button icon={PlusIcon} onClick={onAddUnit}>item</Button>
      <Button icon={PlusIcon} onClick={onAddExtended}>extended</Button>
      <Button icon={PlusIcon} onClick={onAddSubtotal}>subtotal</Button>
    </> : (
      <Button icon={PlusIcon} onClick={onAdd}>item</Button>
    )}
  </AddBar>

// ─── Toggle switch ────────────────────────────────────────────────────────────

const ToggleRow = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
})

const ToggleTrack = styled('button', {
  base: {
    position: 'relative',
    width: '44px',
    height: '26px',
    borderRadius: '999px',
    borderWidth: 0,
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'background-color 0.25s ease-in-out',
    _focusVisible: {
      outlineWidth: '2px',
      outlineStyle: 'solid',
      outlineColor: 'black',
      outlineOffset: '2px',
    },
    _active: { transform: 'scale(0.96)' },
    _disabled: { opacity: 0.4, cursor: 'not-allowed' },
  },
  variants: {
    checked: {
      true:  { background: '#34c759' },
      false: { background: '#c7c7cc' },
    },
  },
  defaultVariants: { checked: false },
})

const ToggleKnob = styled('span', {
  base: {
    position: 'absolute',
    top: '2px',
    width: '22px',
    height: '22px',
    borderRadius: '999px',
    background: 'white',
    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
    transition: 'left 0.25s ease-in-out',
  },
  variants: {
    checked: {
      true:  { left: '20px' },
      false: { left: '2px' },
    },
  },
  defaultVariants: { checked: false },
})

const ToggleLabel = styled('label', {
  base: {
    fontStyle: 'italic',
    cursor: 'pointer',
  },
  variants: {
    disabled: {
      true: { opacity: 0.4, cursor: 'not-allowed' },
    },
  },
})

interface ToggleProps {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export function Toggle({ id, label, checked, onChange, disabled = false }: ToggleProps) {
  return (
    <ToggleRow>
      <ToggleTrack
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        checked={checked}
        onClick={() => onChange(!checked)}
      >
        <ToggleKnob checked={checked} />
      </ToggleTrack>
      <ToggleLabel htmlFor={id} disabled={disabled || undefined}>
        {label}
      </ToggleLabel>
    </ToggleRow>
  )
}

// ─── Screen components ────────────────────────────────────────────────────────

interface FooterEditProps {
  onHelp?: () => void
  showExplanation: boolean
  onShowExplanationChange: (value: boolean) => void
  advancedMode: boolean
  onAdvancedModeChange: (value: boolean) => void
}

export const FooterEdit = ({ onHelp, showExplanation, onShowExplanationChange, advancedMode, onAdvancedModeChange }: FooterEditProps) =>
  <ScreenFooter onHelp={onHelp} controls={<>
    <Toggle id="explain-calculations" label="explain calculations" checked={showExplanation} onChange={onShowExplanationChange} />
    <Toggle id="advanced-mode" label="advanced mode" checked={advancedMode} onChange={onAdvancedModeChange} />
  </>} />

// ─── Sub-level header ─────────────────────────────────────────────────────────

const SubHeaderEl = styled('header', {
  base: { margin: '1rem 0 3rem' },
})

const SubHeaderNavRow = styled('nav', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.8em',
    opacity: 0.55,
    marginBottom: '0.65rem',
    flexWrap: 'wrap',
  },
})

const BreadcrumbBtn = styled('button', {
  base: {
    background: 'none',
    border: 'none',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: 0,
    _hover: { opacity: 0.7 },
  },
})

const BreadcrumbSep = styled('span', {
  base: { userSelect: 'none', paddingLeft: '0.1rem', paddingRight: '0.1rem' },
})

const SubHeaderActionRow = styled('div', {
  base: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
})

const SubTitleInput = styled('input', {
  base: {
    flex: 1,
    background: 'transparent',
    borderWidth: '0',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'rgba(0,0,0,0.15)',
    outline: 'none',
    fontFamily: 'inherit',
    fontSize: '1.1em',
    paddingBottom: '0.2rem',
    _focus: { borderBottomColor: 'black' },
    _placeholder: { opacity: 0.3 },
  },
})

export interface BreadcrumbItem {
  id: string
  title: string
  path: IdPath
}

interface BreadcrumbNavProps {
  breadcrumbs: BreadcrumbItem[]
  onNavigate: (path: IdPath) => void
}

export function BreadcrumbNav({ breadcrumbs, onNavigate }: BreadcrumbNavProps) {
  if (!breadcrumbs.length) return null
  return (
    <SubHeaderNavRow aria-label="Breadcrumb">
      {breadcrumbs.slice(0, -1).map((crumb, i) => (
        <React.Fragment key={crumb.id || 'root'}>
          {i > 0 && <BreadcrumbSep aria-hidden="true">/</BreadcrumbSep>}
          <BreadcrumbBtn type="button" onClick={() => onNavigate(crumb.path)}>
            {crumb.title}
          </BreadcrumbBtn>
        </React.Fragment>
      ))}
      {breadcrumbs.length > 1 && <BreadcrumbSep aria-hidden="true">/</BreadcrumbSep>}
      <span>{breadcrumbs[breadcrumbs.length - 1].title}</span>
    </SubHeaderNavRow>
  )
}

interface SubHeaderEditProps {
  breadcrumbs: BreadcrumbItem[]
  onNavigate: (path: IdPath) => void
  subTitle: string
  onSubTitleChange: (v: string) => void
  onDone: () => void
}

export function SubHeaderEdit({ breadcrumbs, onNavigate, subTitle, onSubTitleChange, onDone }: SubHeaderEditProps) {
  const [draft, setDraft] = React.useState(subTitle)

  React.useEffect(() => { setDraft(subTitle) }, [subTitle])

  function handleBlur() {
    onSubTitleChange(draft.trim())
  }

  return (
    <SubHeaderEl>
      <PageWidth>
        <BreadcrumbNav breadcrumbs={breadcrumbs} onNavigate={onNavigate} />
        <SubHeaderActionRow>
          <SubTitleInput
            value={draft}
            placeholder="Untitled sub-calculation"
            onChange={e => setDraft(e.target.value)}
            onBlur={handleBlur}
            aria-label="Sub-calculation title"
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
          />
          <Button onClick={onDone}>done</Button>
        </SubHeaderActionRow>
      </PageWidth>
    </SubHeaderEl>
  )
}

export const HeaderEdit = ({ onClear, onSaveClick, onLoadClick, hasError }: { onClear?: () => void, onSaveClick?: () => void, onLoadClick?: () => void, hasError?: boolean }) =>
  <ScreenHeader>
    <Button variant="primary" onClick={onSaveClick} disabled={hasError}>export</Button>
    <Button onClick={onLoadClick}>load</Button>
    <HeaderSpacer />
    <Button variant="danger" onClick={onClear}>clear</Button>
  </ScreenHeader>

// ─── Sortable line wrapper ────────────────────────────────────────────────────

const SortableWrapper = styled('div', {
  base: { position: 'relative' },
  variants: {
    dragging: { true: { opacity: 0.4, zIndex: 1 } },
  },
})

interface SortableLineProps {
  id: string
  children: React.ReactNode
}

function SortableLine({ id, children }: SortableLineProps) {
  const { listeners, attributes, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  return (
    <DragCtx.Provider value={{ listeners, attributes }}>
      <SortableWrapper
        ref={setNodeRef}
        dragging={isDragging || undefined}
        style={{ transform: CSS.Transform.toString(transform), transition: transition ?? undefined }}
      >
        {children}
      </SortableWrapper>
    </DragCtx.Provider>
  )
}

// ─── List of items ────────────────────────────────────────────────────────────

interface ListOfItemsProps {
  lines: AnyLineState[]
  totalDisplay: LsdStrings
  totalPence: number
  advanced?: boolean
  showExplanation: boolean
  onFieldChange: (id: string, field: 'l' | 's' | 'd', value: string) => void
  onQuantityChange: (id: string, value: string) => void
  onTitleChange: (id: string, value: string) => void
  onRemoveLine: (id: string) => void
  onAddLine: () => void
  onAddExtended: () => void
  onAddSubtotal: () => void
  onDuplicateLine: (id: string) => void
  onClearItem: (id: string) => void
  onEditSubtotal: (id: string) => void
}

export function ListOfItems({ lines, totalDisplay, totalPence, advanced, showExplanation, onFieldChange, onQuantityChange, onTitleChange, onRemoveLine, onAddLine, onAddExtended, onAddSubtotal, onDuplicateLine, onClearItem, onEditSubtotal }: ListOfItemsProps) {
  return (
    <SwipeProvider>
      <section>
        <SortableContext items={lines.map(l => l.id)} strategy={verticalListSortingStrategy}>
          {lines.map(line => {
            const errorExplanation = showExplanation ? renderErrorExplanation(line) : null
            const explanation = errorExplanation ?? (showExplanation ? renderExplanation(line) : null)
            const explanationIsError = !!errorExplanation
            switch (line.itemType) {
              case ItemType.LINE_ITEM:
                return <SortableLine key={line.id} id={line.id}>
                  <ItemUnit
                    title={line.title} literals={line.literals} explanation={explanation} explanationIsError={explanationIsError || undefined}
                    onTitleChange={v => onTitleChange(line.id, v)}
                    onFieldChange={(f, v) => onFieldChange(line.id, f, v)}
                    onRemove={() => onRemoveLine(line.id)}
                    onDuplicate={() => onDuplicateLine(line.id)}
                    onClearItem={() => onClearItem(line.id)}
                    fieldErrors={line.fieldErrors}
                    error={line.error || undefined}
                  />
                </SortableLine>
              case ItemType.EXTENDED_ITEM:
                return <SortableLine key={line.id} id={line.id}>
                  <ItemExtended
                    title={line.title} literals={line.literals} quantity={line.quantity} explanation={explanation} explanationIsError={explanationIsError || undefined}
                    onTitleChange={v => onTitleChange(line.id, v)}
                    onFieldChange={(f, v) => onFieldChange(line.id, f, v)}
                    onQuantityChange={v => onQuantityChange(line.id, v)}
                    onRemove={() => onRemoveLine(line.id)}
                    onDuplicate={() => onDuplicateLine(line.id)}
                    onClearItem={() => onClearItem(line.id)}
                    fieldErrors={line.fieldErrors}
                    quantityError={line.quantityError || undefined}
                    resultDisplay={formatLsdDisplay(line.totalPence)}
                    error={line.error || undefined}
                  />
                </SortableLine>
              case ItemType.SUBTOTAL_ITEM:
                return <SortableLine key={line.id} id={line.id}>
                  <ItemSubTotal
                    title={line.title} count={line.lines.length} totalDisplay={line.totalDisplay} explanation={explanation} explanationIsError={explanationIsError || undefined}
                    onEdit={() => onEditSubtotal(line.id)}
                    onRemove={() => onRemoveLine(line.id)}
                    onDuplicate={() => onDuplicateLine(line.id)}
                    onClearItem={() => onClearItem(line.id)}
                    error={line.error || undefined}
                  />
                </SortableLine>
            }
          })}
        </SortableContext>
        <AddItemBar
          advanced={advanced}
          onAdd={onAddLine}
          onAddUnit={onAddLine}
          onAddExtended={onAddExtended}
          onAddSubtotal={onAddSubtotal}
        />
        <ItemTotal totalDisplay={totalDisplay} explanation={showExplanation ? renderTotalExplanation(totalDisplay, totalPence) : null} />
      </section>
    </SwipeProvider>
  )
}


// ─── Modals ───────────────────────────────────────────────────────────────────

const DialogEl = styled('dialog', {
  base: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(0,0,0,0.25)',
    background: 'white',
    padding: '1.5rem',
    minWidth: '280px',
    maxWidth: '400px',
    width: '90vw',
    fontFamily: 'inherit',
    _backdrop: { background: 'rgba(0,0,0,0.4)' },
  },
})

const DialogTitle = styled('div', {
  base: { fontWeight: 'bold', marginBottom: '1rem', fontSize: '1.05em' },
})

const DialogButtonRow = styled('div', {
  base: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
    marginTop: '1rem',
  },
})

const FilenameRow = styled('div', {
  base: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
})

const FilenameInput = styled('input', {
  base: {
    flex: 1,
    borderWidth: '0',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'rgba(0,0,0,0.2)',
    outline: 'none',
    fontFamily: 'inherit',
    fontSize: '1em',
    paddingBottom: '0.2rem',
    background: 'transparent',
    _focus: { borderBottomColor: 'black' },
  },
})

const FilenameSuffix = styled('span', {
  base: { opacity: 0.45, fontSize: '0.85em', flexShrink: 0 },
})

const ModalErrorText = styled('div', {
  base: { color: '#ff0000', fontSize: '0.85em', marginTop: '0.5rem' },
})

function SummaDialog({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) {
  const ref = React.useRef<HTMLDialogElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    if (isOpen) { if (!el.open) el.showModal() }
    else { if (el.open) el.close() }
  }, [isOpen])

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const { clientX, clientY } = e
    if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) onClose()
  }

  return (
    <DialogEl ref={ref} onClose={onClose} onClick={handleBackdropClick}>
      <div>
        <DialogTitle>{title}</DialogTitle>
        {children}
      </div>
    </DialogEl>
  )
}

function SaveModalUI({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: (filename: string) => void }) {
  const [filename, setFilename] = React.useState('')

  React.useEffect(() => { if (isOpen) setFilename('') }, [isOpen])

  function handleSave() {
    onSave(filename.trim() || 'summa')
    onClose()
  }

  return (
    <SummaDialog isOpen={isOpen} onClose={onClose} title="Save calculation">
      <FilenameRow>
        <FilenameInput
          type="text"
          value={filename}
          onChange={e => setFilename(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          placeholder="summa"
          autoFocus
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
        />
        <FilenameSuffix>.summa.json</FilenameSuffix>
      </FilenameRow>
      <DialogButtonRow>
        <Button onClick={onClose}>cancel</Button>
        <Button variant="primary" onClick={handleSave}>save</Button>
      </DialogButtonRow>
    </SummaDialog>
  )
}

function LoadModalUI({ isOpen, onClose, onLoad }: { isOpen: boolean, onClose: () => void, onLoad: (file: File) => Promise<void> }) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.value = ''
    if (isOpen) setError('')
  }, [isOpen])

  async function handleLoad() {
    const file = inputRef.current?.files?.[0]
    if (!file) { setError('Please select a file.'); return }
    setError('')
    setLoading(true)
    try {
      await onLoad(file)
      if (inputRef.current) inputRef.current.value = ''
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load file.')
    } finally {
      setLoading(false)
    }
  }

  function handleClose() { setError(''); onClose() }

  return (
    <SummaDialog isOpen={isOpen} onClose={handleClose} title="Load calculation">
      <div>
        <input ref={inputRef} type="file" accept=".json" onChange={() => setError('')} />
        {error && <ModalErrorText>{error}</ModalErrorText>}
      </div>
      <DialogButtonRow>
        <Button onClick={handleClose}>cancel</Button>
        <Button variant="primary" onClick={handleLoad} disabled={loading}>load</Button>
      </DialogButtonRow>
    </SummaDialog>
  )
}

interface MainScreenProps {
  lines: AnyLineState[]
  totalDisplay: LsdStrings
  totalPence: number
  showExplanation: boolean
  onShowExplanationChange: (value: boolean) => void
  advancedMode: boolean
  onAdvancedModeChange: (value: boolean) => void
  onHelp: () => void
  onFieldChange: (id: string, field: 'l' | 's' | 'd', value: string) => void
  onQuantityChange: (id: string, value: string) => void
  onTitleChange: (id: string, value: string) => void
  onRemoveLine: (id: string) => void
  onAddLine: () => void
  onAddExtended: () => void
  onAddSubtotal: () => void
  onClear: () => void
  onDuplicateLine: (id: string) => void
  onClearItem: (id: string) => void
  onSave: (filename: string) => void
  onLoad: (file: File) => Promise<void>
  breadcrumbs: Array<{ id: string; title: string; path: IdPath }>
  navigationPath: IdPath
  subTitle?: string
  onSubTitleChange: (v: string) => void
  onNavigate: (path: IdPath) => void
  onDone?: () => void
  onEditSubtotal: (id: string) => void
  hasError?: boolean
}

export function MainScreen({ lines, totalDisplay, totalPence, showExplanation, onShowExplanationChange, advancedMode, onAdvancedModeChange, onHelp, onFieldChange, onQuantityChange, onTitleChange, onRemoveLine, onAddLine, onAddExtended, onAddSubtotal, onClear, onDuplicateLine, onClearItem, onSave, onLoad, breadcrumbs, navigationPath, subTitle, onSubTitleChange, onNavigate, onDone, onEditSubtotal, hasError }: MainScreenProps) {
  const [saveOpen, setSaveOpen] = React.useState(false)
  const [loadOpen, setLoadOpen] = React.useState(false)
  const isSubLevel = navigationPath.length > 0

  return (
    <ScreenContainer>
      {isSubLevel
        ? <SubHeaderEdit
            breadcrumbs={breadcrumbs}
            onNavigate={onNavigate}
            subTitle={subTitle ?? ''}
            onSubTitleChange={onSubTitleChange}
            onDone={onDone!}
          />
        : <HeaderEdit onClear={onClear} onSaveClick={() => setSaveOpen(true)} onLoadClick={() => setLoadOpen(true)} hasError={hasError} />
      }
      <ListOfItems
        lines={lines} totalDisplay={totalDisplay} totalPence={totalPence} advanced={advancedMode} showExplanation={showExplanation}
        onFieldChange={onFieldChange}
        onQuantityChange={onQuantityChange}
        onTitleChange={onTitleChange}
        onRemoveLine={onRemoveLine}
        onAddLine={onAddLine}
        onAddExtended={onAddExtended}
        onAddSubtotal={onAddSubtotal}
        onDuplicateLine={onDuplicateLine}
        onClearItem={onClearItem}
        onEditSubtotal={onEditSubtotal}
      />
      <FooterEdit
        onHelp={onHelp}
        showExplanation={showExplanation}
        onShowExplanationChange={onShowExplanationChange}
        advancedMode={advancedMode}
        onAdvancedModeChange={onAdvancedModeChange}
      />
      {!isSubLevel && <>
        <SaveModalUI isOpen={saveOpen} onClose={() => setSaveOpen(false)} onSave={onSave} />
        <LoadModalUI isOpen={loadOpen} onClose={() => setLoadOpen(false)} onLoad={onLoad} />
      </>}
    </ScreenContainer>
  )
}
