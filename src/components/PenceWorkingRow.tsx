import { supD } from './CurrencyFields.styles';
import { workingRowNowrap } from './PenceWorkingRow.styles';

interface PenceWorkingRowProps {
	showWorking: boolean;
	pence: number;
	error?: boolean;
}

export default function PenceWorkingRow({
	showWorking,
	pence,
	error = false,
}: PenceWorkingRowProps) {
	if (!showWorking) return null;
	return (
		<span className={workingRowNowrap}>
			{!error && pence > 0 && (
				<>
					{pence}
					<sup className={supD}>d</sup> =
				</>
			)}
		</span>
	);
}
