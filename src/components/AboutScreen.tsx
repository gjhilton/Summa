import { useState } from 'react';
import { css, cx } from '../generated/css';
import Button from './Button';
import Footer from './Footer';
import PageLayout from './PageLayout';
import Logo from './Logo';
import Line from './Line';
import Toggle from './Toggle';
import noWorkingImg from '../assets/no-working.png';
import { computeLinePence } from '../state/calculationLogic';

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

const snapshot = css({
	overflow: 'hidden',
});

const exampleFrame = css({
	borderWidth: 'thin',
	borderStyle: 'solid',
	borderColor: 'ink',
	bg: 'muted',
	boxShadow: '0 2px 6px rgba(0,0,0,0.10)',
});

const noop = () => {};

export default function AboutScreen({ onClose, isFirstVisit = false, onGetStarted }: AboutScreenProps) {
	const [example1Literals, setExample1Literals] = useState({ l: 'xx', s: 'v', d: 'iiij' });
	const { totalPence: example1Pence, error: example1Error, fieldErrors: example1FieldErrors } = computeLinePence(example1Literals);
	const [demoShowWorking, setDemoShowWorking] = useState(true);
	const [demoLiterals, setDemoLiterals] = useState({ l: 'xx', s: 'v', d: 'iiij' });
	const { totalPence: demoTotalPence_, error: demoError, fieldErrors: demoFieldErrors } = computeLinePence(demoLiterals);
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
							<div className={cx(exampleFrame, snapshot)}>
					<img src={noWorkingImg} alt="Summa calculation" style={{ width: '90%', display: 'block', margin: '0 auto' }} />
				</div>
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
					Roman numerals. The total updates automatically. NB the example below is editable so you can experiment - try inputting and invalid value - like 'dog' - and seee what happens.
				</p>
				<div className={exampleFrame}>
					<Line
						literals={example1Literals}
						error={example1Error}
						fieldErrors={example1FieldErrors}
						canRemove={false}
						showOp={false}
						showWorking={false}
						totalPence={example1Pence}
						onChangeField={(f, v) => setExample1Literals(prev => ({ ...prev, [f]: v }))}
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
						fieldErrors={demoFieldErrors}
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
