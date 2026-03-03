import { useRef, useEffect } from 'react';
import { css } from '../generated/css';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
}

const dialog = css({
	borderWidth: 'thin',
	borderStyle: 'solid',
	borderColor: 'ink',
	bg: 'paper',
	color: 'ink',
	fontFamily: 'inherit',
	p: 'lg',
	minWidth: '320px',
	maxWidth: '480px',
	width: '90vw',
	_backdrop: {
		bg: 'rgba(0,0,0,0.5)',
	},
});

const modalTitle = css({
	fontSize: 'l',
	fontWeight: 'bold',
	marginBottom: 'md',
});

export default function Modal({
	isOpen,
	onClose,
	title,
	children,
}: ModalProps) {
	const ref = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		if (isOpen) {
			if (!el.open) el.showModal();
		} else {
			if (el.open) el.close();
		}
	}, [isOpen]);

	// Called for both Escape key and programmatic close. When we call
	// el.close() above, the browser fires this event, but isOpen is already
	// false so calling onClose() is a React no-op. When Escape closes the
	// dialog, onClose() propagates the state change to the parent.
	function handleNativeClose() {
		onClose();
	}

	function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
		const rect = ref.current?.getBoundingClientRect();
		if (!rect) return;
		const { clientX, clientY } = e;
		if (
			clientX < rect.left ||
			clientX > rect.right ||
			clientY < rect.top ||
			clientY > rect.bottom
		) {
			onClose();
		}
	}

	return (
		<dialog
			ref={ref}
			className={dialog}
			onClose={handleNativeClose}
			onClick={handleBackdropClick}
		>
			<div>
				<div className={modalTitle}>{title}</div>
				{children}
			</div>
		</dialog>
	);
}
