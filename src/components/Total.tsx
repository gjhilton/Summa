import { TotalDisplay } from '../types/calculation';
import Field from './Field';

interface TotalProps {
	display: TotalDisplay;
}

export default function Total({ display }: TotalProps) {
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: '0.5rem',
				padding: '0.5rem',
				borderTop: '2px solid black',
				fontWeight: 'bold',
			}}
		>
			<Field value={display.l} label="l" />
			<Field value={display.s} label="s" />
			<Field value={display.d} label="d" />
		</div>
	);
}
