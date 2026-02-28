import { css } from '../generated/css';

const supDStyle = css({ marginLeft: '2px' });

export default function SupD() {
	return <sup className={supDStyle}>d</sup>;
}
