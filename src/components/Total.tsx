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
	/*fontWeight: 'bold',*/
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

export default function Total({ display }: TotalProps) {
	return (
		<LedgerRow className={totalRow}>
			<span />
			<span className={summaCol}><Logo size="S" /></span>
			<Field value={display.l} label="l" />
			<Field value={display.s} label="s" />
			<Field value={display.d} label="d" />
		</LedgerRow>
	);
}
