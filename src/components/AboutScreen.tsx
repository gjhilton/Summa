import { css } from '@generated/css';
import Button from './Button';
import Footer from './Footer';

interface AboutScreenProps {
	onClose: () => void;
}

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

const body = css({
	display: 'flex',
	flexDirection: 'column',
	gap: '2xl',
	marginBottom: '3xl',
	lineHeight: '1.7',
});

const backBar = css({ marginBottom: '3xl' });

export default function AboutScreen({ onClose }: AboutScreenProps) {
	return (
		<div className={page}>
			<div className={backBar}>
				<Button onClick={onClose}>← Back</Button>
			</div>
			<h1 className={heading}>About</h1>
			<div className={body}>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
					incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
					exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
				</p>
				<p>
					Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
					fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
					culpa qui officia deserunt mollit anim id est laborum.
				</p>
				<p>
					Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
					doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
					veritatis et quasi architecto beatae vitae dicta sunt explicabo.
				</p>
			</div>
			<Footer />
		</div>
	);
}
