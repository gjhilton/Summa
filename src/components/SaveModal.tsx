import { useState, useEffect } from 'react';
import { css } from '../generated/css';
import Modal from './Modal';
import Button from './Button';

interface SaveModalProps {
	isOpen: boolean;
	onClose: () => void;
	defaultFilename: string;
	onSave: (filename: string) => void;
}

const row = css({
	display: 'flex',
	alignItems: 'center',
	gap: 'xs',
	marginBottom: 'md',
});

const filenameInput = css({
	flex: '1',
	borderWidth: 'thin',
	borderStyle: 'solid',
	borderColor: 'ink',
	bg: 'paper',
	color: 'ink',
	fontFamily: 'inherit',
	fontSize: 'm',
	px: 'sm',
	py: 'xs',
	outlineWidth: '0',
	_focusVisible: { boxShadow: '0 2px 0 0 lemonchiffon' },
});

const suffix = css({
	opacity: '0.6',
	fontSize: 's',
	flexShrink: '0',
});

const buttonRow = css({
	display: 'flex',
	justifyContent: 'flex-end',
	gap: 'xs',
});

export default function SaveModal({
	isOpen,
	onClose,
	defaultFilename,
	onSave,
}: SaveModalProps) {
	const [filename, setFilename] = useState(defaultFilename);

	useEffect(() => {
		if (isOpen) setFilename(defaultFilename);
	}, [isOpen, defaultFilename]);

	function handleSave() {
		const name = filename.trim() || 'summa';
		onSave(name);
		onClose();
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === 'Enter') handleSave();
	}

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Save calculation">
			<div className={row}>
				<input
					className={filenameInput}
					type="text"
					value={filename}
					onChange={e => setFilename(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="summa"
					aria-label="Filename"
					autoFocus
					autoCapitalize="off"
					autoCorrect="off"
					autoComplete="off"
					spellCheck={false}
				/>
				<span className={suffix}>.summa.json</span>
			</div>
			<div className={buttonRow}>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={handleSave}>Save</Button>
			</div>
		</Modal>
	);
}
