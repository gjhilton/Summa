import { cx } from '../generated/css';
import { titleInput } from '../styles/shared';

interface TitleInputProps {
	value: string;
	onChange: (v: string) => void;
	ariaLabel?: string;
	className?: string;
	style?: React.CSSProperties;
}

export default function TitleInput({
	value,
	onChange,
	ariaLabel = 'title (optional)',
	className,
	style,
}: TitleInputProps) {
	return (
		<input
			className={cx(titleInput, className)}
			style={style}
			value={value}
			placeholder="Item"
			aria-label={ariaLabel}
			onChange={e => onChange(e.target.value)}
		/>
	);
}
