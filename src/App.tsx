import { css } from '@generated/css';
import CalculationData from './state/CalculationData';

const page = css({
	maxWidth: '90%',
	marginLeft: 'auto',
	marginRight: 'auto',
	paddingTop: '3xl',
	paddingBottom: '3xl',
	desktop: { maxWidth: '800px' },
});

const heading = css({
	fontFamily: 'joscelyn',
	fontSize: 'xl',
	fontWeight: 'bold',
	marginBottom: '3xl',
});

export default function App() {
	return (
		<div className={page}>
			<h1 className={heading}>Summa</h1>
			<CalculationData />
		</div>
	);
}
