import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import {
	goto,
	enterValue,
	getField,
	enableShowWorking,
	getItemsCount,
	openSaveModal,
	openLoadModal,
	saveAs,
	toggleAdvancedOptions,
	addSubtotalItem,
	addExtendedItem,
	navigateIntoSubtotal,
	clickUndo,
} from '../config/playwright/helpers/test-helpers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SIMPLE_FIXTURE = path.resolve(__dirname, 'fixtures/simple.summa.json');

// ─── Undo coalescing: blur without change ─────────────────────────────────────

test.describe('blur without change does not create extra undo entry', () => {
	test('line title: after fill + re-blur without change, one undo restores empty', async ({
		page,
	}) => {
		await goto(page);
		// Fill line title (all keystrokes coalesce into 1 undo entry)
		await page.getByLabel('Line title').first().fill('My title');
		// Click away to blur (no new undo push)
		await page.getByLabel('li', { exact: true }).first().click();
		// Focus title again then blur again without changing (no new undo push)
		await page.getByLabel('Line title').first().click();
		await page.getByLabel('li', { exact: true }).first().click();

		// Only 1 undo entry exists; clicking undo once should revert to ''
		const undoBtn = page.getByRole('button', { name: 'undo', exact: true });
		await expect(undoBtn).toBeVisible();
		await undoBtn.click();
		await expect(page.getByLabel('Line title').first()).toHaveValue('');
		// Stack is now empty → undo button gone
		await expect(undoBtn).not.toBeVisible();
	});

	test('sub-level title: blur without change does not push extra undo entry', async ({
		page,
	}) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);

		// Type in sub-calc title then blur → 1 undo push
		await page.getByLabel('Sub-calculation title').click();
		await page.keyboard.type('Test sub');
		// Blur by focusing the done button
		await page.getByRole('button', { name: 'done', exact: true }).focus();

		// Focus title again then blur without changing → guard prevents push
		await page.getByLabel('Sub-calculation title').click();
		await page.getByRole('button', { name: 'done', exact: true }).focus();

		// Only 1 entry — undo once empties the stack
		const undoBtn = page.getByRole('button', { name: 'undo', exact: true });
		await expect(undoBtn).toBeVisible();
		await undoBtn.click();
		await expect(undoBtn).not.toBeVisible();
	});
});

// ─── Extended item: result display is read-only ───────────────────────────────

test.describe('extended item result display', () => {
	test('result fields have pointer-events: none (not clickable)', async ({
		page,
	}) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 'd', 2).fill('v'); // 5d unit cost

		// The d inputs in order: row0_d(0), row1_d(1), extended_unit_d(2),
		// extended_result_d(3), total_d(last).
		const resultD = page.getByLabel('d', { exact: true }).nth(3);
		// The result display container has pointerEvents:'none' via displayOnly variant
		const pointerEvents = await resultD.evaluate(
			el => getComputedStyle(el).pointerEvents
		);
		expect(pointerEvents).toBe('none');
	});

	test('result fields have the readonly attribute', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 'd', 2).fill('v');
		// Index 3 = result d of extended item
		const resultD = page.getByLabel('d', { exact: true }).nth(3);
		await expect(resultD).toHaveJSProperty('readOnly', true);
	});
});

// ─── Load: invalid / wrong-format files ──────────────────────────────────────

test.describe('loading files with invalid or mismatched formats', () => {
	test('loading valid JSON without Summa metadata shows "Not a Summa file"', async ({
		page,
	}) => {
		await goto(page);
		await openLoadModal(page);
		await page.getByLabel('Summa file').setInputFiles({
			name: 'no-metadata.json',
			mimeType: 'application/json',
			buffer: Buffer.from(JSON.stringify({ foo: 'bar' })),
		});
		await page.getByRole('button', { name: 'load', exact: true }).last().click();
		await expect(page.getByText('Not a Summa file')).toBeVisible();
	});

	test('loading valid JSON with wrong appName shows "Not a Summa file"', async ({
		page,
	}) => {
		await goto(page);
		await openLoadModal(page);
		await page.getByLabel('Summa file').setInputFiles({
			name: 'wrong-app.json',
			mimeType: 'application/json',
			buffer: Buffer.from(
				JSON.stringify({ metadata: { appName: 'something-else' }, lines: [] })
			),
		});
		await page.getByRole('button', { name: 'load', exact: true }).last().click();
		await expect(page.getByText('Not a Summa file')).toBeVisible();
	});

	test('loading JSON missing the lines array shows an error', async ({ page }) => {
		await goto(page);
		await openLoadModal(page);
		await page.getByLabel('Summa file').setInputFiles({
			name: 'no-lines.json',
			mimeType: 'application/json',
			buffer: Buffer.from(
				JSON.stringify({ metadata: { appName: 'summa' } })
			),
		});
		await page.getByRole('button', { name: 'load', exact: true }).last().click();
		await expect(
			page.getByText(/Invalid file format: missing lines/i)
		).toBeVisible();
	});

	test('modal stays open after a format error', async ({ page }) => {
		await goto(page);
		await openLoadModal(page);
		await page.getByLabel('Summa file').setInputFiles({
			name: 'wrong.json',
			mimeType: 'application/json',
			buffer: Buffer.from(JSON.stringify({ foo: 'bar' })),
		});
		await page.getByRole('button', { name: 'load', exact: true }).last().click();
		await expect(page.getByText('Load calculation')).toBeVisible();
	});
});

// ─── localStorage edge cases ──────────────────────────────────────────────────

test.describe('localStorage edge cases', () => {
	test('old storage format (object with .lines) loads correctly', async ({
		page,
	}) => {
		await page.goto('/');
		await page.evaluate(() => {
			localStorage.clear();
			localStorage.setItem('summa_welcomed', '1');
			// Old format: object with a "lines" property (not a plain array)
			localStorage.setItem(
				'summa_calculation',
				JSON.stringify({
					lines: [
						{
							id: 'legacy-1',
							itemType: 'LINE_ITEM',
							title: 'Old format item',
							literals: { l: '', s: 'v', d: '' },
						},
					],
				})
			);
		});
		await page.reload();
		// Disable show working so we can inspect values cleanly
		const toggle = page.getByRole('switch', { name: /explain calculations/i });
		if ((await toggle.getAttribute('aria-checked')) === 'true') {
			await toggle.click();
		}
		await expect(page.getByLabel('Line title').first()).toHaveValue(
			'Old format item'
		);
		await expect(page.getByLabel('s', { exact: true }).first()).toHaveValue('v');
	});

	test('corrupted localStorage JSON falls back to the initial 2-line state', async ({
		page,
	}) => {
		await page.goto('/');
		await page.evaluate(() => {
			localStorage.clear();
			localStorage.setItem('summa_welcomed', '1');
			localStorage.setItem('summa_calculation', 'this is not json {{{');
		});
		await page.reload();
		const toggle = page.getByRole('switch', { name: /explain calculations/i });
		if ((await toggle.getAttribute('aria-checked')) === 'true') {
			await toggle.click();
		}
		await toggle.click(); // enable show working to see item count
		await expect(getItemsCount(page)).toHaveText('Items: 2');
	});

	test('no summa_calculation key in storage starts with 2 empty lines', async ({
		page,
	}) => {
		await page.goto('/');
		await page.evaluate(() => {
			localStorage.clear();
			localStorage.setItem('summa_welcomed', '1');
			// summa_calculation intentionally not set
		});
		await page.reload();
		const toggle = page.getByRole('switch', { name: /explain calculations/i });
		if ((await toggle.getAttribute('aria-checked')) === 'true') {
			await toggle.click();
		}
		await toggle.click(); // enable to see item count
		await expect(getItemsCount(page)).toHaveText('Items: 2');
	});
});

// ─── Loading clears undo stack ────────────────────────────────────────────────

test.describe('load clears undo stack', () => {
	test('undo button disappears after loading a file', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'v');
		await expect(
			page.getByRole('button', { name: 'undo', exact: true })
		).toBeVisible();
		await openLoadModal(page);
		const { loadFile } = await import(
			'../config/playwright/helpers/test-helpers.js'
		);
		await loadFile(page, SIMPLE_FIXTURE);
		await expect(
			page.getByRole('button', { name: 'undo', exact: true })
		).not.toBeVisible();
	});
});

// ─── Save: special characters in filename ────────────────────────────────────

test.describe('save filename edge cases', () => {
	test('filename with a forward-slash still triggers a download', async ({
		page,
	}) => {
		await goto(page);
		await openSaveModal(page);
		const download = await saveAs(page, 'folder/file');
		// Regardless of how the browser sanitises the slash, a download must occur
		expect(download.suggestedFilename()).toMatch(/\.summa\.json$/);
	});

	test('filename with spaces is preserved in the downloaded filename', async ({
		page,
	}) => {
		await goto(page);
		await openSaveModal(page);
		const download = await saveAs(page, 'my calculation');
		expect(download.suggestedFilename()).toBe('my calculation.summa.json');
	});
});
