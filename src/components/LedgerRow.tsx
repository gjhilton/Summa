import { css, cx } from '../generated/css';

interface LedgerRowProps {
	children: React.ReactNode;
	className?: string;
	columns?: string;
}

const ledgerRow = css({
	display: 'grid',
	gridTemplateColumns: 'auto 1fr 20% 20% 20%',
	alignItems: 'stretch',
	width: '100%',
	padding: 'sm',
});

export default function LedgerRow({ children, className, columns }: LedgerRowProps) {
	return (
		<div
			className={cx(ledgerRow, className)}
			style={columns ? { gridTemplateColumns: columns } : undefined}
		>
			{children}
		</div>
	);
}
