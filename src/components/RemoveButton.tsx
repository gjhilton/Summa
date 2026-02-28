import { cx } from '../generated/css';
import { removeIcon, hidden } from '../styles/shared';
import Button from './Button';
import Icon from './Icon';

interface RemoveButtonProps {
	canRemove: boolean;
	label: string;
	onClick: () => void;
}

export default function RemoveButton({
	canRemove,
	label,
	onClick,
}: RemoveButtonProps) {
	return (
		<Button
			variant="icon"
			aria-label={label}
			className={cx(removeIcon, canRemove ? undefined : hidden)}
			onClick={onClick}
		>
			<Icon icon="trash" size={16} />
		</Button>
	);
}
