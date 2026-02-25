import { css } from '../generated/css';
import { LsdStrings } from '../types/calculation';
import Field from './Field';
import LedgerRow from './LedgerRow';
import Logo from './Logo';

interface TotalProps {
	display: LsdStrings;
}

const totalRow = css({
	borderTopWidth: 'medium',
	borderTopStyle: 'solid',
	borderTopColor: 'ink',
	marginBottom: "6rem",
	marginTop: "0.5rem",
	paddingTop: "2rem"
});

const summaCol = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	fontFamily: 'joscelyn',
	fontSize: 'xl',
	padding: 'xs',
});

function fmt(v: string) { return v === '0' ? '—' : v; }

export default function Total({ display }: TotalProps) {
	return (
		<LedgerRow className={totalRow}>
			<span />
			<span className={summaCol}><Logo size="S" /></span>
			<Field value={fmt(display.l)} label="l" noBorder bold={display.l !== '0'} />
			<Field value={fmt(display.s)} label="s" noBorder bold={display.s !== '0'} />
			<Field value={fmt(display.d)} label="d" noBorder bold={display.d !== '0'} />
		</LedgerRow>
	);
}
