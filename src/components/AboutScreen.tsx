import { useState } from 'react';
import { css, cx } from '@/generated/css';
import Button from './Button';
import Footer from './Footer';
import PageLayout from './PageLayout';
import Logo from './Logo';
import LineItem from './LineItem';
import ExtendedItem from './ExtendedItem';
import SubtotalItem from './SubtotalItem';
import Toggle from './Toggle';
import noWorkingImg from '@/assets/screenshot.jpg';
import {
	emptyLine,
	emptyExtendedItem,
	emptySubtotalItem,
	processFieldUpdate,
	recomputeSubtotal,
	updateExtendedItemField,
	updateExtendedItemQuantity,
} from '@/utils/calculationLogic';
import { toLineView } from '@/utils/displayLogic';
import {
	AnyLineState,
	LineState,
	ExtendedItemState,
	SubtotalItemState,
} from '@/types/calculation';
import {
	LineItemView,
	ExtendedItemView,
	SubtotalItemView,
} from '@/types/lineView';
import cookiesHtml from '@/content/about/01-cookies.md';
import introBeforeHtml from '@/content/about/02-intro-before.md';
import introAfterHtml from '@/content/about/03-intro-after.md';
import calculationHtml from '@/content/about/04-calculation.md';
import itemsBeforeHtml from '@/content/about/05-items-before.md';
import itemsAfterHtml from '@/content/about/06-items-after.md';
import showWorkingHtml from '@/content/about/07-show-working.md';
import advancedIntroHtml from '@/content/about/08-advanced-intro.md';
import extendedItemsHtml from '@/content/about/09-extended-items.md';
import subtotalItemsHtml from '@/content/about/10-subtotal-items.md';
import comingSoonHtml from '@/content/about/11-coming-soon.md';

interface AboutScreenProps {
	onClose: () => void;
	isFirstVisit?: boolean;
	onGetStarted?: () => void;
}

const srOnly = css({
	position: 'absolute',
	width: '1px',
	height: '1px',
	padding: '0',
	margin: '-1px',
	overflow: 'hidden',
	clip: 'rect(0,0,0,0)',
	whiteSpace: 'nowrap',
	borderWidth: '0',
});

const pageHeading = css({
	fontSize: 'xl',
	fontWeight: 'bold',
	marginBottom: '3xl',
});

const body = css({
	display: 'flex',
	flexDirection: 'column',
	gap: '2xl',
	marginBottom: '3xl',
});

const backBar = css({ marginBottom: '3xl' });

const getStartedBar = css({
	display: 'flex',
	justifyContent: 'center',
	marginTop: '3xl',
	marginBottom: '3xl',
});

const getStartedButton = css({
	fontSize: 'xl',
	px: '4xl',
	py: 'lg',
});

const logoWrap = css({ textAlign: 'center', marginBottom: '3xl' });

const snapshot = css({ overflow: 'hidden' });

const exampleFrame = css({
	borderWidth: 'thin',
	borderStyle: 'solid',
	borderColor: 'ink',
	bg: 'muted',
	boxShadow: '0 2px 6px rgba(0,0,0,0.10)',
	padding: 'sm',
});

const sectionBlock = css({
	display: 'flex',
	flexDirection: 'column',
	gap: 'xl',
	marginTop: '4rem',
});

function Section({ children }: { children: React.ReactNode }) {
	return <section className={sectionBlock}>{children}</section>;
}

function Prose({ html }: { html: string }) {
	return <div data-about-prose dangerouslySetInnerHTML={{ __html: html }} />;
}

const noop = () => {};

export default function AboutScreen({
	onClose,
	isFirstVisit = false,
	onGetStarted,
}: AboutScreenProps) {
	const [example1, setExample1] = useState<LineState>(() => {
		let lines: AnyLineState[] = [emptyLine()];
		const id = lines[0].id;
		lines = processFieldUpdate(lines, id, 'l', 'xx');
		lines = processFieldUpdate(lines, id, 's', 'v');
		lines = processFieldUpdate(lines, id, 'd', 'iiij');
		return lines[0] as LineState;
	});

	const [demoShowWorking, setDemoShowWorking] = useState(true);
	const [demo, setDemo] = useState<LineState>(() => {
		let lines: AnyLineState[] = [emptyLine()];
		const id = lines[0].id;
		lines = processFieldUpdate(lines, id, 'l', 'xx');
		lines = processFieldUpdate(lines, id, 's', 'v');
		lines = processFieldUpdate(lines, id, 'd', 'iiij');
		return lines[0] as LineState;
	});

	const [subtotalItem] = useState<SubtotalItemState>(() => {
		const item = emptySubtotalItem();
		let lines = item.lines;
		const id0 = lines[0].id;
		const id1 = lines[1].id;
		lines = processFieldUpdate(lines, id0, 'l', 'i');
		lines = processFieldUpdate(lines, id0, 's', 'ii');
		lines = processFieldUpdate(lines, id0, 'd', 'iii');
		lines = processFieldUpdate(lines, id1, 'l', 'ii');
		lines = processFieldUpdate(lines, id1, 's', 'iii');
		lines = processFieldUpdate(lines, id1, 'd', 'iv');
		return recomputeSubtotal({ ...item, lines });
	});

	const [extendedItem, setExtendedItem] = useState<ExtendedItemState>(() => {
		let item = emptyExtendedItem();
		item = updateExtendedItemQuantity(item, 'iii');
		item = updateExtendedItemField(item, 's', 'v');
		item = updateExtendedItemField(item, 'd', 'iiij');
		return item;
	});

	const handleExtendedItemField = (f: 'l' | 's' | 'd', v: string) =>
		setExtendedItem(prev => updateExtendedItemField(prev, f, v));

	const handleExtendedItemQuantity = (v: string) =>
		setExtendedItem(prev => updateExtendedItemQuantity(prev, v));

	return (
		<PageLayout>
			{!isFirstVisit && (
				<div className={backBar}>
					<Button onClick={onClose}>← Back</Button>
				</div>
			)}
			<h1 className={srOnly}>Summa</h1>
			<div className={logoWrap}>
				<Logo size="M" />
			</div>

			{isFirstVisit && onGetStarted && (
				<>
					<Section>
						<Prose html={cookiesHtml} />
					</Section>
					<div className={getStartedBar}>
						<Button
							onClick={onGetStarted}
							variant="danger"
							className={getStartedButton}
						>
							Get started →
						</Button>
					</div>
				</>
			)}

			<h2 className={pageHeading}>Help</h2>
			<div className={body}>
				<Prose html={introBeforeHtml} />
				<div className={cx(exampleFrame, snapshot)}>
					<img
						src={noWorkingImg}
						alt="Summa calculation"
						style={{
							width: '90%',
							display: 'block',
							margin: '0 auto',
						}}
					/>
				</div>
				<Prose html={introAfterHtml} />

				<Section>
					<Prose html={calculationHtml} />
				</Section>

				<Section>
					<Prose html={itemsBeforeHtml} />
					<div className={exampleFrame}>
						<LineItem
							view={toLineView(example1) as LineItemView}
							canRemove={false}
							showWorking={false}
							onChangeField={(f, v) =>
								setExample1(
									prev =>
										processFieldUpdate(
											[prev],
											prev.id,
											f,
											v
										)[0] as LineState
								)
							}
							onRemove={noop}
							onChangeTitle={noop}
						/>
					</div>
					<Prose html={itemsAfterHtml} />
				</Section>

				<Section>
					<Prose html={showWorkingHtml} />
					<div className={exampleFrame}>
						<Toggle
							id="about-show-working"
							label="Show working"
							checked={demoShowWorking}
							onChange={setDemoShowWorking}
						/>
						<LineItem
							view={toLineView(demo) as LineItemView}
							canRemove={false}
							showWorking={demoShowWorking}
							onChangeField={(f, v) =>
								setDemo(
									prev =>
										processFieldUpdate(
											[prev],
											prev.id,
											f,
											v
										)[0] as LineState
								)
							}
							onRemove={noop}
							onChangeTitle={noop}
						/>
					</div>
				</Section>

				<Section>
					<Prose html={advancedIntroHtml} />
					<Prose html={extendedItemsHtml} />
					<div className={exampleFrame}>
						<ExtendedItem
							view={toLineView(extendedItem) as ExtendedItemView}
							canRemove={false}
							showWorking={false}
							onChangeField={handleExtendedItemField}
							onChangeQuantity={handleExtendedItemQuantity}
							onRemove={noop}
							onChangeTitle={noop}
						/>
					</div>
					<Prose html={subtotalItemsHtml} />
					<div className={exampleFrame}>
						<SubtotalItem
							view={toLineView(subtotalItem) as SubtotalItemView}
							canRemove={false}
							showWorking={false}
							onEdit={() =>
								window.alert(
									'In the real calculator, this opens the sub-calculation for editing.'
								)
							}
							onRemove={noop}
						/>
					</div>
				</Section>

				<Section>
					<Prose html={comingSoonHtml} />
				</Section>
			</div>

			{!isFirstVisit && (
				<div className={backBar}>
					<Button onClick={onClose}>← Back</Button>
				</div>
			)}

			<Footer />
		</PageLayout>
	);
}
