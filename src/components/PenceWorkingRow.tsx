import SupD from './SupD';
import WorkingRow from './WorkingRow';

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
		<WorkingRow>
			{!error && pence > 0 && (
				<>
					{pence}
					<SupD /> =
				</>
			)}
		</WorkingRow>
	);
}
