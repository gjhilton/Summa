import { describe, it, expect } from 'vitest';
import {
	serializeLine,
	serializeLines,
	deserializeLine,
	deserializeLines,
	createSummaFile,
	parseSummaFile,
} from '../state/serialization';
import {
	emptyLine,
	emptyExtendedItem,
	emptySubtotalItem,
	processFieldUpdate,
	processQuantityUpdate,
	computeGrandTotal,
	recomputeSubtotal,
	initialState,
} from '../state/calculationLogic';
import {
	ItemType,
	AnyLineState,
	isExtendedItem,
	isSubtotalItem,
} from '../types/calculation';

// ─── serializeLine ────────────────────────────────────────────────────────────

describe('serializeLine — LINE_ITEM', () => {
	it('strips computed fields', () => {
		let line = emptyLine();
		line = processFieldUpdate(
			[line, emptyLine()],
			line.id,
			'd',
			'v'
		)[0] as typeof line;
		const saved = serializeLine(line);
		expect('error' in saved).toBe(false);
		expect('fieldErrors' in saved).toBe(false);
		expect('totalPence' in saved).toBe(false);
	});

	it('preserves user-authored fields exactly', () => {
		let line = emptyLine();
		const lines = processFieldUpdate(
			[line, emptyLine()],
			line.id,
			'd',
			'v'
		);
		line = lines[0] as typeof line;
		const saved = serializeLine(line);
		expect(saved.id).toBe(line.id);
		expect(saved.itemType).toBe(ItemType.LINE_ITEM);
		expect(saved.title).toBe(line.title);
		if (saved.itemType === ItemType.LINE_ITEM) {
			expect(saved.literals).toEqual(line.literals);
		}
	});
});

describe('serializeLine — EXTENDED_ITEM', () => {
	it('strips computed fields', () => {
		let item = emptyExtendedItem();
		let lines: AnyLineState[] = [item, emptyLine()];
		lines = processFieldUpdate(lines, item.id, 'd', 'v');
		lines = processQuantityUpdate(lines, item.id, 'iii');
		item = lines[0] as typeof item;
		const saved = serializeLine(item);
		expect('error' in saved).toBe(false);
		expect('fieldErrors' in saved).toBe(false);
		expect('basePence' in saved).toBe(false);
		expect('totalPence' in saved).toBe(false);
		expect('quantityError' in saved).toBe(false);
	});

	it('preserves user-authored fields', () => {
		let item = emptyExtendedItem();
		let lines: AnyLineState[] = [item, emptyLine()];
		lines = processQuantityUpdate(lines, item.id, 'iii');
		item = lines[0] as typeof item;
		const saved = serializeLine(item);
		expect(saved.itemType).toBe(ItemType.EXTENDED_ITEM);
		if (saved.itemType === ItemType.EXTENDED_ITEM) {
			expect(saved.quantity).toBe('iii');
			expect(saved.literals).toEqual(item.literals);
		}
	});
});

describe('serializeLine — SUBTOTAL_ITEM', () => {
	it('strips computed fields from subtotal', () => {
		const item = emptySubtotalItem();
		const saved = serializeLine(item);
		expect('totalPence' in saved).toBe(false);
		expect('totalDisplay' in saved).toBe(false);
		expect('error' in saved).toBe(false);
	});

	it('recursively serializes child lines', () => {
		const item = emptySubtotalItem();
		const saved = serializeLine(item);
		expect(saved.itemType).toBe(ItemType.SUBTOTAL_ITEM);
		if (saved.itemType === ItemType.SUBTOTAL_ITEM) {
			expect(Array.isArray(saved.lines)).toBe(true);
			expect(saved.lines).toHaveLength(2);
			expect('error' in saved.lines[0]).toBe(false);
		}
	});
});

// ─── deserializeLine ──────────────────────────────────────────────────────────

describe('deserializeLine — LINE_ITEM', () => {
	it('recomputes error/fieldErrors/totalPence', () => {
		const saved = {
			id: 'test-id',
			itemType: ItemType.LINE_ITEM,
			title: 'Test',
			literals: { l: '', s: '', d: 'v' },
		};
		const line = deserializeLine(saved);
		expect(line.itemType).toBe(ItemType.LINE_ITEM);
		if (line.itemType === ItemType.LINE_ITEM) {
			expect(line.totalPence).toBe(5);
			expect(line.error).toBe(false);
			expect(line.fieldErrors).toEqual({ l: false, s: false, d: false });
		}
	});

	it('marks error for invalid roman', () => {
		const saved = {
			id: 'test-id',
			itemType: ItemType.LINE_ITEM,
			title: '',
			literals: { l: '', s: '', d: 'zz' },
		};
		const line = deserializeLine(saved);
		expect(line.itemType).toBe(ItemType.LINE_ITEM);
		if (line.itemType === ItemType.LINE_ITEM) {
			expect(line.error).toBe(true);
			expect(line.fieldErrors.d).toBe(true);
			expect(line.totalPence).toBe(0);
		}
	});
});

describe('deserializeLine — EXTENDED_ITEM', () => {
	it('recomputes extended item fields', () => {
		const saved = {
			id: 'test-id',
			itemType: ItemType.EXTENDED_ITEM,
			title: 'Widget',
			literals: { l: '', s: '', d: 'v' },
			quantity: 'iii',
		};
		const line = deserializeLine(saved);
		expect(isExtendedItem(line)).toBe(true);
		if (isExtendedItem(line)) {
			expect(line.basePence).toBe(5);
			expect(line.totalPence).toBe(15);
			expect(line.error).toBe(false);
			expect(line.quantityError).toBe(false);
		}
	});
});

describe('deserializeLine — SUBTOTAL_ITEM', () => {
	it('recurses and recomputes subtotal', () => {
		const saved = {
			id: 'sub-id',
			itemType: ItemType.SUBTOTAL_ITEM,
			title: 'Sub',
			lines: [
				{
					id: 'child-1',
					itemType: ItemType.LINE_ITEM,
					title: '',
					literals: { l: '', s: '', d: 'v' },
				},
				{
					id: 'child-2',
					itemType: ItemType.LINE_ITEM,
					title: '',
					literals: { l: '', s: '', d: 'iii' },
				},
			],
		};
		const line = deserializeLine(saved);
		expect(isSubtotalItem(line)).toBe(true);
		if (isSubtotalItem(line)) {
			expect(line.totalPence).toBe(8);
			expect(line.error).toBe(false);
		}
	});
});

// ─── round-trips ─────────────────────────────────────────────────────────────

describe('round-trip: LINE_ITEM', () => {
	it('deserialize(serialize(line)) equals original runtime state', () => {
		let line = emptyLine();
		line = processFieldUpdate(
			[line, emptyLine()],
			line.id,
			's',
			'x'
		)[0] as typeof line;
		const saved = serializeLine(line);
		const restored = deserializeLine(saved);
		expect(restored).toEqual(line);
	});
});

describe('round-trip: EXTENDED_ITEM', () => {
	it('survives round-trip', () => {
		let item = emptyExtendedItem();
		let lines: AnyLineState[] = [item, emptyLine()];
		lines = processFieldUpdate(lines, item.id, 'd', 'vi');
		lines = processQuantityUpdate(lines, item.id, 'ii');
		item = lines[0] as typeof item;
		const saved = serializeLine(item);
		const restored = deserializeLine(saved);
		expect(restored).toEqual(item);
	});
});

describe('round-trip: SUBTOTAL_ITEM with nested extended', () => {
	it('nested round-trip preserves all fields', () => {
		const ext = emptyExtendedItem();
		let lines: AnyLineState[] = [ext, emptyLine()];
		lines = processFieldUpdate(lines, ext.id, 's', 'v');
		lines = processQuantityUpdate(lines, ext.id, 'ii');

		// Build a subtotal with those children and recompute derived fields
		const subtotal = emptySubtotalItem();
		const finalSubtotal = recomputeSubtotal({ ...subtotal, lines });

		const saved = serializeLine(finalSubtotal);
		const restored = deserializeLine(saved);
		expect(restored).toEqual(finalSubtotal);
	});
});

// ─── serializeLines preserves order ──────────────────────────────────────────

describe('serializeLines preserves order', () => {
	it('first in, first out', () => {
		const line1 = emptyLine();
		const line2 = emptyLine();
		const line3 = emptyLine();
		const saved = serializeLines([line1, line2, line3]);
		expect(saved[0].id).toBe(line1.id);
		expect(saved[1].id).toBe(line2.id);
		expect(saved[2].id).toBe(line3.id);
	});

	it('nested subtotal lines preserve order after round-trip', () => {
		const child1 = emptyLine();
		const child2 = emptyLine();
		const child3 = emptyLine();
		const sub = emptySubtotalItem();
		const subWithLines = recomputeSubtotal({
			...sub,
			lines: [child1, child2, child3],
		});

		const saved = serializeLine(subWithLines);
		const restored = deserializeLine(saved);
		expect(isSubtotalItem(restored)).toBe(true);
		if (isSubtotalItem(restored)) {
			expect(restored.lines[0].id).toBe(child1.id);
			expect(restored.lines[1].id).toBe(child2.id);
			expect(restored.lines[2].id).toBe(child3.id);
		}
	});
});

// ─── createSummaFile ─────────────────────────────────────────────────────────

describe('createSummaFile', () => {
	it('includes correct metadata fields', () => {
		const state = initialState();
		const file = createSummaFile(state);
		expect(file.metadata.appName).toBe('summa');
		expect(typeof file.metadata.version).toBe('string');
		expect(file.metadata.version.length).toBeGreaterThan(0);
		// savedAt should be an ISO 8601 string
		expect(() => new Date(file.metadata.savedAt)).not.toThrow();
		expect(new Date(file.metadata.savedAt).toISOString()).toBe(
			file.metadata.savedAt
		);
	});

	it('contains serialized lines', () => {
		const state = initialState();
		const file = createSummaFile(state);
		expect(Array.isArray(file.lines)).toBe(true);
		expect(file.lines).toHaveLength(state.lines.length);
	});
});

// ─── parseSummaFile ───────────────────────────────────────────────────────────

describe('parseSummaFile', () => {
	it('parses a valid JSON string back to CalculationState', () => {
		const state = initialState();
		const file = createSummaFile(state);
		const json = JSON.stringify(file);
		const result = parseSummaFile(json);
		expect(result.lines).toHaveLength(state.lines.length);
		expect(typeof result.totalPence).toBe('number');
		expect(result.hasError).toBe(false);
	});

	it('throws "Not a valid JSON file" on garbage input', () => {
		expect(() => parseSummaFile('not json {{{')).toThrow(
			'Not a valid JSON file'
		);
	});

	it('throws "Not a Summa file" if appName wrong', () => {
		const json = JSON.stringify({
			metadata: { appName: 'other', version: '1.0.0', savedAt: '' },
			lines: [],
		});
		expect(() => parseSummaFile(json)).toThrow('Not a Summa file');
	});

	it('throws on missing lines', () => {
		const json = JSON.stringify({
			metadata: { appName: 'summa', version: '1.0.0', savedAt: '' },
		});
		expect(() => parseSummaFile(json)).toThrow(
			'Invalid file format: missing lines'
		);
	});

	it('throws on unknown itemType', () => {
		const json = JSON.stringify({
			metadata: { appName: 'summa', version: '1.0.0', savedAt: '' },
			lines: [
				{
					id: 'x',
					itemType: 'BOGUS_ITEM',
					title: '',
					literals: { l: '', s: '', d: '' },
				},
			],
		});
		expect(() => parseSummaFile(json)).toThrow(
			'Unknown item type: BOGUS_ITEM'
		);
	});

	it('preserves empty lines (title empty, literals empty)', () => {
		const json = JSON.stringify({
			metadata: { appName: 'summa', version: '1.0.0', savedAt: '' },
			lines: [
				{
					id: 'line-1',
					itemType: ItemType.LINE_ITEM,
					title: '',
					literals: { l: '', s: '', d: '' },
				},
			],
		});
		const result = parseSummaFile(json);
		expect(result.lines).toHaveLength(1);
		expect(result.lines[0].itemType).toBe(ItemType.LINE_ITEM);
		if (result.lines[0].itemType === ItemType.LINE_ITEM) {
			expect(result.lines[0].title).toBe('');
			expect(result.lines[0].literals).toEqual({ l: '', s: '', d: '' });
		}
	});

	it('nested subtotals survive round-trip at depth 3', () => {
		// Build depth-3 subtotals via JSON
		const deepFile = {
			metadata: {
				appName: 'summa' as const,
				version: '0.5.0',
				savedAt: '',
			},
			lines: [
				{
					id: 'sub1',
					itemType: ItemType.SUBTOTAL_ITEM,
					title: 'Level 1',
					lines: [
						{
							id: 'sub2',
							itemType: ItemType.SUBTOTAL_ITEM,
							title: 'Level 2',
							lines: [
								{
									id: 'sub3',
									itemType: ItemType.SUBTOTAL_ITEM,
									title: 'Level 3',
									lines: [
										{
											id: 'leaf',
											itemType: ItemType.LINE_ITEM,
											title: 'Leaf',
											literals: { l: '', s: 'v', d: '' },
										},
									],
								},
							],
						},
					],
				},
			],
		};
		const result = parseSummaFile(JSON.stringify(deepFile));
		expect(result.lines).toHaveLength(1);
		expect(isSubtotalItem(result.lines[0])).toBe(true);
		if (isSubtotalItem(result.lines[0])) {
			expect(isSubtotalItem(result.lines[0].lines[0])).toBe(true);
			if (isSubtotalItem(result.lines[0].lines[0])) {
				expect(isSubtotalItem(result.lines[0].lines[0].lines[0])).toBe(
					true
				);
			}
		}
		// 5s = 60 pence
		expect(result.totalPence).toBe(60);
	});

	it('round-trip full state is equivalent', () => {
		// Create a state with some values
		const state = initialState();
		let lines = processFieldUpdate(
			state.lines,
			state.lines[0].id,
			's',
			'v'
		);
		lines = processFieldUpdate(lines, state.lines[1].id, 'd', 'iii');
		const { totalPence, totalDisplay, hasError } = computeGrandTotal(lines);
		const modifiedState = { lines, totalPence, totalDisplay, hasError };

		const file = createSummaFile(modifiedState);
		const json = JSON.stringify(file);
		const result = parseSummaFile(json);

		expect(result.totalPence).toBe(modifiedState.totalPence);
		expect(result.totalDisplay).toEqual(modifiedState.totalDisplay);
		expect(result.lines).toHaveLength(2);
	});
});

// ─── deserializeLines ─────────────────────────────────────────────────────────

describe('deserializeLines', () => {
	it('maps over all lines', () => {
		const lines = [emptyLine(), emptyLine(), emptyExtendedItem()];
		const saved = serializeLines(lines);
		const restored = deserializeLines(saved);
		expect(restored).toHaveLength(3);
		expect(restored[2].itemType).toBe(ItemType.EXTENDED_ITEM);
	});
});
