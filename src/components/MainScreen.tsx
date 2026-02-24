import { useState } from 'react';
import { css } from '../generated/css';
import CalculationData from '../state/CalculationData';
import Logo from './Logo';
import Footer from './Footer';
import Toggle from './Toggle';
import PageLayout from './PageLayout';

interface MainScreenProps {
	onAbout: () => void;
}

const header = css({
	display: 'flex',
	alignItems: 'flex-end',
	justifyContent: 'space-between',
	marginBottom: '3xl',
});

const aboutLink = css({
	fontSize: 's',
	cursor: 'pointer',
	textDecoration: 'underline',
	color: 'ink',
	background: 'none',
	border: 'none',
	fontFamily: 'inherit',
	padding: 0,
	_hover: { opacity: 0.6 },
});

const toolbar = css({ marginTop: 'lg' });

export default function MainScreen({ onAbout }: MainScreenProps) {
	const [showWorking, setShowWorking] = useState(false);

	return (
		<PageLayout>
			<header className={header}>
				<Logo size="S" />
				<button
					type="button"
					className={aboutLink}
					aria-label="About"
					onClick={onAbout}
				>
					About
				</button>
			</header>
			<CalculationData showWorking={showWorking} />
			<div className={toolbar}>
				<Toggle
					id="show-working"
					label="Show working"
					checked={showWorking}
					onChange={setShowWorking}
				/>
			</div>
			<Footer />
		</PageLayout>
	);
}
