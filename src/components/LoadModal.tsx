import { useRef, useState } from 'react';
import { css } from '../generated/css';
import Modal from './Modal';
import Button from './Button';

interface LoadModalProps {
	isOpen: boolean;
	onClose: () => void;
	onLoad: (file: File) => Promise<void>;
}

const fileRow = css({
	marginBottom: 'md',
});

const fileInput = css({
	fontFamily: 'inherit',
	fontSize: 'm',
	color: 'inherit',
	display: 'block',
	width: '100%',
});

const errorMsg = css({
	color: 'red.500',
	fontSize: 's',
	marginTop: 'sm',
	marginBottom: 'sm',
});

const buttonRow = css({
	display: 'flex',
	justifyContent: 'flex-end',
	gap: 'xs',
	marginTop: 'md',
});

export default function LoadModal({ isOpen, onClose, onLoad }: LoadModalProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	async function handleLoad() {
		const file = inputRef.current?.files?.[0];
		if (!file) {
			setError('Please select a file.');
			return;
		}
		setError('');
		setLoading(true);
		try {
			await onLoad(file);
			if (inputRef.current) inputRef.current.value = '';
			setError('');
			onClose();
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Failed to load file.');
		} finally {
			setLoading(false);
		}
	}

	function handleClose() {
		setError('');
		onClose();
	}

	return (
		<Modal isOpen={isOpen} onClose={handleClose} title="Load calculation">
			<div className={fileRow}>
				<input
					ref={inputRef}
					className={fileInput}
					type="file"
					accept=".json"
					aria-label="Summa file"
					onChange={() => setError('')}
				/>
				{error && <div className={errorMsg}>{error}</div>}
			</div>
			<div className={buttonRow}>
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={handleLoad} disabled={loading}>
					Load
				</Button>
			</div>
		</Modal>
	);
}
