import { css } from '../../dist/styled-system/css';

const page = css({
	maxWidth: '90%',
	marginLeft: 'auto',
	marginRight: 'auto',
	paddingTop: '3xl',
	paddingBottom: '3xl',
	desktop: { maxWidth: '800px' },
});

export default function PageLayout({ children }: { children: React.ReactNode }) {
	return <div className={page}>{children}</div>;
}
