import { css } from '../generated/css';
import { LineState, LsdStrings } from '../types/calculation';
import Line from './Line';
import Total from './Total';
import Button from './Button';
import Toggle from './Toggle';

interface CalculationProps {
	lines: LineState[];
	totalDisplay: LsdStrings;
	totalPence: number;
	showWorking: boolean;
	onShowWorkingChange: (v: boolean) => void;
	onUpdateField: (lineId: string, f: 'l' | 's' | 'd', v: string) => void;
	onAddLine: () => void;
	onRemoveLine: (id: string) => void;
	onReset: () => void;
}

const layout = css({ display: 'flex', flexDirection: 'column', gap: 'xs' });
const addBar = css({ marginTop: 'lg' });
const bottomBar = css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'lg' });

export default function Calculation({
	lines,
	totalDisplay,
	totalPence,
	showWorking,
	onShowWorkingChange,
	onUpdateField,
	onAddLine,
	onRemoveLine,
	onReset,
}: CalculationProps) {
	return (
		<div className={layout}>
			{lines.map((line, i) => (
				<Line
					key={line.id}
					literals={line.literals}
					error={line.error}
					canRemove={lines.length > 2}
					showOp={i > 0}
					showWorking={showWorking}
					totalPence={line.totalPence}
					onChangeField={(f, v) => onUpdateField(line.id, f, v)}
					onRemove={() => onRemoveLine(line.id)}
				/>
			))}
			<div className={addBar}>
				<Button onClick={onAddLine}>Add item</Button>
			</div>
			<Total display={totalDisplay} totalPence={totalPence} showWorking={showWorking} />
			<div className={bottomBar}>
				<Toggle
					id="show-working"
					label="Show working"
					checked={showWorking}
					onChange={onShowWorkingChange}
				/>
				<Button onClick={() => window.confirm('Reset all lines?') && onReset()}>Clear</Button>
			</div>
		</div>
	);
}
