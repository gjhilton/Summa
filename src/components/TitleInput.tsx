import { css, cx } from '../generated/css';
import { focusRing } from './Button.styles';

const titleInput = css({
	width: '100%',
	paddingLeft: 'xs',
	paddingRight: 'xs',
	paddingTop: 'md',
	paddingBottom: 'md',
	fontSize: 'm',
	borderBottomWidth: '1px',
	borderBottomStyle: 'solid',
	borderBottomColor: 'rgba(0,0,0,0.1)',
	bg: 'transparent',
	fontFamily: 'inherit',
	textAlign: 'left',
	outlineWidth: '0',
	outlineStyle: 'none',
	transition: 'all 200ms ease-in-out',
	_hover: { borderBottomColor: 'ink' },
	_focus: { borderBottomColor: 'ink' },
	_focusVisible: focusRing,
	_placeholder: { opacity: '0.4' },
});

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
