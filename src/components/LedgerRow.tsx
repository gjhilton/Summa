import { css, cx } from '../generated/css';

interface LedgerRowProps {
	children: React.ReactNode;
	className?: string;
}

const ledgerRow = css({
	display: 'grid',
	gridTemplateColumns: '1.5rem 1.5rem 1em 1fr auto 20% 20% 20% 1em',
	alignItems: 'stretch',
	width: '100%',
	padding: 'sm',
});

export default function LedgerRow({ children, className }: LedgerRowProps) {
	return <div className={cx(ledgerRow, className)}>{children}</div>;
}
