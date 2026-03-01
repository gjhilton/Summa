import { css } from '../generated/css';

const workingRowNowrap = css({
	display: 'block',
	width: '100%',
	minHeight: '1.5em',
	fontSize: 's',
	color: 'ink',
	textAlign: 'right',
	whiteSpace: 'nowrap',
});

export default function WorkingRow({
	children,
}: {
	children: React.ReactNode;
}) {
	return <span className={workingRowNowrap} data-working>{children}</span>;
}
