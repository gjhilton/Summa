import { css } from '../generated/css';
import { LineState, LsdStrings } from '../types/calculation';
import Line from './Line';
import Total from './Total';
import Button from './Button';

interface CalculationProps {
	lines: LineState[];
	totalDisplay: LsdStrings;
	showWorking: boolean;
	onUpdateField: (lineId: string, f: 'l' | 's' | 'd', v: string) => void;
	onAddLine: () => void;
	onRemoveLine: (id: string) => void;
	onReset: () => void;
}

const layout = css({ display: 'flex', flexDirection: 'column', gap: 'xs' });
const toolbar = css({ display: 'flex', gap: 'sm', marginTop: 'lg' });

export default function Calculation({
	lines,
	totalDisplay,
	showWorking,
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
					canRemove={lines.length > 2}
					showWorking={showWorking}
					totalPence={line.totalPence}
					onChangeField={(f, v) => onUpdateField(line.id, f, v)}
					onRemove={() => onRemoveLine(line.id)}
				/>
			))}
			<Total display={totalDisplay} onReset={onReset} />
			<div className={toolbar}>
				<Button onClick={onAddLine}>Add line</Button>
			</div>
		</div>
	);
}
