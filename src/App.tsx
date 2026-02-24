import { css } from '@generated/css';
import CalculationData from './state/CalculationData';

const main = css({ padding: 'lg', maxWidth: '480px', margin: '0 auto' });
const heading = css({ fontSize: 'xl', fontWeight: 'bold', marginBottom: 'lg' });

export default function App() {
	return (
		<main className={main}>
			<h1 className={heading}>Summa</h1>
			<CalculationData />
		</main>
	);
}
