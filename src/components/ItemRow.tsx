import LedgerRow from "./LedgerRow";

/**
 * Slot-based row for all ledger item types.
 * Provides named slots that correspond to the 8 universal grid columns:
 *   col 1 auto  = remove button
 *   col 2 1em   = left bracket / spacer
 *   col 3 1fr   = title / qty  (all titles and ExtendedItem qty share this column)
 *   col 4 auto  = operator symbol (×, =) or spacer
 *   col 5–7     = l / s / d  (rendered by CurrencyFields fragment — 3 grid children)
 *   col 8 1em   = right bracket / trailing spacer
 */
interface ItemRowProps {
  className?: string;
  remove?: React.ReactNode;
  leftBracket?: React.ReactNode;
  title?: React.ReactNode;
  operator?: React.ReactNode;
  currency: React.ReactNode;
  rightBracket?: React.ReactNode;
}

export default function ItemRow({
  className,
  remove,
  leftBracket,
  title,
  operator,
  currency,
  rightBracket,
}: ItemRowProps) {
  return (
    <LedgerRow className={className}>
      {remove ?? <span />}
      {leftBracket ?? <span />}
      {title ?? <span />}
      {operator ?? <span />}
      {currency}
      {rightBracket ?? <span />}
    </LedgerRow>
  );
}
