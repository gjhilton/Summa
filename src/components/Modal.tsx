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
	// Tracks closes we initiate programmatically so we can suppress the
	// resulting native 'close' event — otherwise onClose fires twice.
	const programmaticClose = useRef(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		if (isOpen) {
			if (!el.open) el.showModal();
		} else {
			if (el.open) {
				programmaticClose.current = true;
				el.close();
			}
		}
	}, [isOpen]);

	function handleNativeClose() {
		if (programmaticClose.current) {
			programmaticClose.current = false;
			return;
		}
		// Escape key: browser closed the dialog; propagate to parent.
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
