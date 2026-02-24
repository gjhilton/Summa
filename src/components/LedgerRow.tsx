import { css, cx } from '../generated/css';

interface LedgerRowProps {
	children: React.ReactNode;
	className?: string;
}

export const ledgerRow = css({
	display: 'grid',
	gridTemplateColumns: 'auto 1fr 20% 20% 20%',
	alignItems: 'center',
	width: '100%',
	padding: 'sm',
});

export default function LedgerRow({ children, className }: LedgerRowProps) {
	return <div className={cx(ledgerRow, className)}>{children}</div>;
}
