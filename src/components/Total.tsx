import { css } from '../generated/css';
import { LsdStrings } from '../types/calculation';
import Field from './Field';
import Button from './Button';
import Icon from './Icon';
import LedgerRow from './LedgerRow';

interface TotalProps {
	display: LsdStrings;
	onReset: () => void;
}

const totalRow = css({
	borderTopWidth: 'medium',
	borderTopStyle: 'solid',
	borderTopColor: 'ink',
	fontWeight: 'bold',
});

const summaCol = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	fontFamily: 'joscelyn',
	padding: 'xs',
});

export default function Total({ display, onReset }: TotalProps) {
	return (
		<LedgerRow className={totalRow}>
			<Button variant="icon" aria-label="Reset" onClick={() => window.confirm('Reset all lines?') && onReset()}>
				<Icon icon="reset" />
			</Button>
			<span className={summaCol}>Summa</span>
			<Field value={display.l} label="l" />
			<Field value={display.s} label="s" />
			<Field value={display.d} label="d" />
		</LedgerRow>
	);
}
