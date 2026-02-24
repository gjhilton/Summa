import { LineState, TotalDisplay } from '../types/calculation';
import Line from './Line';
import Total from './Total';
import Button from './Button';

interface CalculationProps {
	lines: LineState[];
	totalDisplay: TotalDisplay;
	onUpdateField: (lineId: string, f: 'l' | 's' | 'd', v: string) => void;
	onAddLine: () => void;
	onRemoveLine: (id: string) => void;
	onReset: () => void;
}

export default function Calculation({
	lines,
	totalDisplay,
	onUpdateField,
	onAddLine,
	onRemoveLine,
	onReset,
}: CalculationProps) {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
			{lines.map(line => (
				<Line
					key={line.id}
					id={line.id}
					literals={line.literals}
					error={line.error}
					onChangeField={(f, v) => onUpdateField(line.id, f, v)}
					onRemove={() => onRemoveLine(line.id)}
				/>
			))}
			<Total display={totalDisplay} />
			<div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
				<Button label="Add line" onClick={onAddLine} variant="primary" />
				<Button label="Reset" onClick={onReset} variant="danger" />
			</div>
		</div>
	);
}
