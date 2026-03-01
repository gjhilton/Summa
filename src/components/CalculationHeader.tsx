import { useEffect, useState } from 'react';
import { css } from '../generated/css';
import { IdPath } from '../state/calculationLogic';
import Button from './Button';

interface CalculationHeaderProps {
	breadcrumbs: Array<{ id: string; title: string; path: IdPath }>;
	onNavigate: (path: IdPath) => void;
	onClear: () => void;
	onDone?: () => void;
	title?: string;
	onTitleChange?: (v: string) => void;
	onLoad?: () => void;
	onSave?: () => void;
	canSave?: boolean;
}

const header = css({
	display: 'flex',
	flexDirection: 'column',
	gap: 'sm',
	marginBottom: 'lg',
	paddingBottom: 'lg',
	borderBottomWidth: 'thin',
	borderBottomStyle: 'solid',
	borderBottomColor: 'ink',
});

const breadcrumbRow = css({
	display: 'flex',
	alignItems: 'center',
	gap: 'xs',
	fontSize: 's',
	flexWrap: 'wrap',
});

const breadcrumbBtn = css({
	background: 'transparent',
	borderWidth: '0',
	cursor: 'pointer',
	fontFamily: 'inherit',
	fontSize: 'inherit',
	color: 'inherit',
	opacity: '0.6',
	padding: '0',
	textDecoration: 'underline',
	textUnderlineOffset: '2px',
	_hover: { opacity: '1' },
});

const breadcrumbSep = css({
	opacity: '0.4',
	userSelect: 'none',
});

const breadcrumbCurrent = css({
	opacity: '0.8',
});

const actionRow = css({
	display: 'flex',
	alignItems: 'center',
	gap: 'sm',
});

const titleInput = css({
	flex: '1',
	background: 'transparent',
	borderWidth: '0',
	outlineWidth: '0',
	fontSize: 'xl',
	fontFamily: 'inherit',
	color: 'inherit',
	_placeholder: { opacity: '0.3' },
});

const buttonGroup = css({
	display: 'flex',
	gap: 'xs',
	flexShrink: '0',
	marginLeft: 'auto',
});

const fileButtonGroup = css({
	display: 'flex',
	gap: 'xs',
	flexShrink: '0',
});

export default function CalculationHeader({
	breadcrumbs,
	onNavigate,
	onClear,
	onDone,
	title,
	onTitleChange,
	onLoad,
	onSave,
	canSave = true,
}: CalculationHeaderProps) {
	const showBreadcrumbs = breadcrumbs.length > 0;
	const showTitle = title !== undefined && onTitleChange !== undefined;

	// Local draft so typing (including deleting to empty) doesn't round-trip
	// through global state and trigger an immediate restore.
	const [draft, setDraft] = useState(title ?? '');

	// Sync draft when navigating to a different sub-calculation.
	useEffect(() => {
		setDraft(title ?? '');
	}, [title]);

	function handleBlur() {
		if (draft === '') {
			// Restore the last saved title; leave state unchanged.
			setDraft(title ?? '');
		} else {
			onTitleChange?.(draft);
		}
	}

	return (
		<div className={header}>
			{showBreadcrumbs && (
				<nav className={breadcrumbRow} aria-label="Breadcrumb">
					{breadcrumbs.slice(0, -1).map(crumb => (
						<span
							key={crumb.id || 'root'}
							style={{ display: 'contents' }}
						>
							<button
								type="button"
								className={breadcrumbBtn}
								onClick={() => onNavigate(crumb.path)}
							>
								{crumb.title}
							</button>
							<span className={breadcrumbSep} aria-hidden="true">
								/
							</span>
						</span>
					))}
					{breadcrumbs.length > 0 && (
						<span className={breadcrumbCurrent}>
							{breadcrumbs[breadcrumbs.length - 1].title}
						</span>
					)}
				</nav>
			)}
			<div className={actionRow}>
				{showTitle && (
					<input
						className={titleInput}
						value={draft}
						placeholder="Untitled sub-calculation"
						onChange={e => setDraft(e.target.value)}
						onBlur={handleBlur}
						aria-label="Sub-calculation title"
						autoCapitalize="off"
						autoCorrect="off"
						autoComplete="off"
						spellCheck={false}
					/>
				)}
				{(onLoad || onSave) && (
					<div className={fileButtonGroup}>
						{onLoad && <Button onClick={onLoad}>Load</Button>}
						{onSave && (
							<Button onClick={onSave} disabled={!canSave}>
								Save
							</Button>
						)}
					</div>
				)}
				<div className={buttonGroup}>
					<Button onClick={onClear}>
						{onDone ? 'Clear page' : 'Clear'}
					</Button>
					{onDone && <Button onClick={onDone}>← Done</Button>}
				</div>
			</div>
		</div>
	);
}
