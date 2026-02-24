import { css } from '@generated/css';
import { LsdStrings } from '../types/calculation';
import Field from './Field';

interface TotalProps {
	display: LsdStrings;
}

const totalRow = css({
	display: 'flex',
	alignItems: 'center',
	gap: 'sm',
	padding: 'sm',
	borderTop: '2px solid {colors.ink}',
	fontWeight: 'bold',
});

export default function Total({ display }: TotalProps) {
	return (
		<div className={totalRow}>
			<Field value={display.l} label="l" />
			<Field value={display.s} label="s" />
			<Field value={display.d} label="d" />
		</div>
	);
}
