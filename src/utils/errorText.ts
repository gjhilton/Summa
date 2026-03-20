import type { LsdBooleans } from '@/types/calculation';

const LSD_FIELDS = ['l', 's', 'd'] as const;

/** Map field key to display label ('l' → 'li', others unchanged). */
function fieldLabel(f: 'l' | 's' | 'd'): string {
	return f === 'l' ? 'li' : f;
}

/** Return display labels for all fields that have errors. */
export function fieldErrorLabels(fieldErrors: LsdBooleans): string[] {
	return LSD_FIELDS.filter(f => fieldErrors[f]).map(fieldLabel);
}

/** Format a list of labels as a human-readable phrase, e.g. "li and s fields". */
export function formatFieldList(labels: string[]): string {
	if (labels.length === 0) return '';
	if (labels.length === 1) return `${labels[0]} field`;
	return `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]} fields`;
}
