import { css } from '@generated/css';
import { LineState, LsdStrings } from '../types/calculation';
import Line from './Line';
import Total from './Total';
import Button from './Button';

interface CalculationProps {
	lines: LineState[];
	totalDisplay: LsdStrings;
	onUpdateField: (lineId: string, f: 'l' | 's' | 'd', v: string) => void;
	onAddLine: () => void;
	onRemoveLine: (id: string) => void;
	onReset: () => void;
}

const layout = css({ display: 'flex', flexDirection: 'column', gap: 'sm' });
const toolbar = css({ display: 'flex', gap: 'sm', marginTop: 'sm' });

export default function Calculation({
	lines,
	totalDisplay,
	onUpdateField,
	onAddLine,
	onRemoveLine,
	onReset,
}: CalculationProps) {
	return (
		<div className={layout}>
			{lines.map(line => (
				<Line
					key={line.id}
					literals={line.literals}
					error={line.error}
					onChangeField={(f, v) => onUpdateField(line.id, f, v)}
					onRemove={() => onRemoveLine(line.id)}
				/>
			))}
			<Total display={totalDisplay} />
			<div className={toolbar}>
				<Button label="Add line" onClick={onAddLine} variant="primary" />
				<Button label="Reset" onClick={onReset} variant="danger" />
			</div>
		</div>
	);
}
