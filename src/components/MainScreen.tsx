import CalculationData from '../state/CalculationData';
import Footer from './Footer';
import PageLayout from './PageLayout';
import PrintColophon from './PrintColophon';

interface MainScreenProps {
	onAbout: () => void;
	useExtendedItem: boolean;
	onUseExtendedItemChange: (v: boolean) => void;
}

export default function MainScreen({
	onAbout,
	useExtendedItem,
	onUseExtendedItemChange,
}: MainScreenProps) {
	return (
		<PageLayout>
			<CalculationData
				useExtendedItem={useExtendedItem}
				onUseExtendedItemChange={onUseExtendedItemChange}
			/>
			<Footer onHelp={onAbout} />
			<PrintColophon />
		</PageLayout>
	);
}
