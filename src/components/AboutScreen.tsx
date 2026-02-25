import { useState } from 'react';
import { css } from '../generated/css';
import Button from './Button';
import Footer from './Footer';
import PageLayout from './PageLayout';
import Logo from './Logo';
import Line from './Line';
import Toggle from './Toggle';
import { computeFieldWorking } from '../state/calculationLogic';

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

const heading = css({
	fontFamily: 'joscelyn',
	fontSize: 'xl',
	fontWeight: 'bold',
	marginBottom: '3xl',
});

const subheading = css({
	fontFamily: 'joscelyn',
	fontSize: 'xl',
	fontWeight: 'bold',
});

const body = css({
	display: 'flex',
	flexDirection: 'column',
	gap: '2xl',
	marginBottom: '3xl',
	lineHeight: '1.7',
	fontSize: '18px',
});

const listOrdered = css({
	listStyleType: 'decimal',
	paddingLeft: '1.5em',
});

const listUnordered = css({
	listStyleType: 'disc',
	paddingLeft: '1.5em',
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

const exampleFrame = css({
	borderWidth: 'thin',
	borderStyle: 'solid',
	borderColor: 'ink',
	bg: 'muted',
	boxShadow: '0 2px 6px rgba(0,0,0,0.10)',
});

const noop = () => {};

function demoTotalPence(l: string, s: string, d: string): { totalPence: number; error: boolean } {
	let totalPence = 0;
	for (const [v, f] of [[l, 'l'], [s, 's'], [d, 'd']] as [string, 'l' | 's' | 'd'][]) {
		if (!v) continue;
		const result = computeFieldWorking(v, f);
		if (!result) return { totalPence: 0, error: true };
		totalPence += result.pence;
	}
	return { totalPence, error: false };
}

export default function AboutScreen({ onClose, isFirstVisit = false, onGetStarted }: AboutScreenProps) {
	const [demoShowWorking, setDemoShowWorking] = useState(true);
	const [demoLiterals, setDemoLiterals] = useState({ l: 'xx', s: 'v', d: 'iiij' });
	const { totalPence: demoTotalPence_, error: demoError } = demoTotalPence(demoLiterals.l, demoLiterals.s, demoLiterals.d);
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
			<h2 className={heading}>About</h2>
			<div className={body}>
				<p>
					Summa is a simple spreadsheet for historians working with Early Modern
					British ledgers, accounts and similar documents.
				</p>
				<p>
					For clerks of the era, summing columns of figures expressed as pounds,
					shillings and pence in Roman numerals was second nature. For modern
					users the calculations can be error-prone, and in large quantities
					quickly become tedious. Summa automates the calculation.
				</p>

				<h2 className={subheading}>The Calculation</h2>
				<p>Summa uses the following algorithm:</p>
				<ol className={listOrdered}>
					<li>Convert Roman numerals to regular Arabic integers.</li>
					<li>Canonicalise pounds and shillings to amounts of pence (£1 = 240d; 1/&#x2212; = 12d).</li>
					<li>Sum the amounts denominated in pence.</li>
					<li>Convert the sum back into its £, s, d denominations.</li>
					<li>Convert each amount to Roman numerals.</li>
				</ol>

				<h2 className={subheading}>How to use</h2>
				<p>
					Input each line of your calculation as pounds, shillings and pence in
					Roman numerals. The total updates automatically.
				</p>
				<div className={exampleFrame}>
					<Line
						literals={{ l: 'xx', s: 'v', d: 'iiij' }}
						error={false}
						canRemove={false}
						showOp={false}
						showWorking={false}
						totalPence={4864}
						onChangeField={noop}
						onRemove={noop}
					/>
				</div>

				<p>
					To add another line item, click the <em>Add item</em> button.
				</p>

				<p>
					The <em>Show working</em> switch toggles display of the intermediate
					calculations, which can be useful for tracking down clerical errors in
					the source material.
				</p>
				<div className={exampleFrame}>
					<Toggle
						id="about-show-working"
						label="Show working"
						checked={demoShowWorking}
						onChange={setDemoShowWorking}
					/>
					<Line
						literals={demoLiterals}
						error={demoError}
						canRemove={false}
						showOp={false}
						showWorking={demoShowWorking}
						totalPence={demoTotalPence_}
						onChangeField={(f, v) => setDemoLiterals(prev => ({ ...prev, [f]: v }))}
						onRemove={noop}
					/>
				</div>

				<h2 className={subheading}>Coming soon</h2>
				<ul className={listUnordered}>
					<li>Mobile device compatibility.</li>
					<li>Support for ½d and ¼d.</li>
					<li>Improved printing.</li>
					<li>Rows which calculate a quantity — e.g. xv feet @ iijd per foot.</li>
				</ul>
				<p>
					Please suggest features which would make Summa more useful on the{' '}
					<a href="https://github.com/gjhilton/Summa/issues">GitHub issues page</a>.
				</p>

				<h2>No warranty / Cookies</h2>
				<p>This software is provided free of charge and with <strong>no warranty of correctness</strong>. It's beta software written in a few hours and almost certainly contains  defects and errors. You are strongly advised to check any results you obtain from Summa.</p>
				<p>We use cookies and local storage to persist your preferences and work between sessions. We dont collect user data or analytics of any kind to our knowledge, but we DO use Google fonts and they might.</p>
				<p>By continuing you agree to the above.</p>
			</div>
			{isFirstVisit && onGetStarted && (
				<div className={getStartedBar}>
					<Button onClick={onGetStarted} variant="danger" className={getStartedButton}>
						Get started →
					</Button>
				</div>
			)}
			<Footer />
		</PageLayout>
	);
}
