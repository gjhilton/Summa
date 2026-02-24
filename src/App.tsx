import { css } from '@generated/css';
import CalculationData from './state/CalculationData';
import Logo from './components/Logo';
import Footer from './components/Footer';

const page = css({
	maxWidth: '90%',
	marginLeft: 'auto',
	marginRight: 'auto',
	paddingTop: '3xl',
	paddingBottom: '3xl',
	desktop: { maxWidth: '800px' },
});

const logoWrap = css({ marginBottom: '3xl' });

export default function App() {
	return (
		<div className={page}>
			<div className={logoWrap}>
				<Logo size="S" />
			</div>
			<CalculationData />
			<Footer />
		</div>
	);
}
