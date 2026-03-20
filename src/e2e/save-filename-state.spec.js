/**
 * Tests for save modal filename state:
 * - Re-opening save modal always shows empty filename (reset on each open)
 * - Cancel does not start a download
 * - Typing a filename in the modal and saving uses that filename for the download
 * - Whitespace-only filename falls back to "summa"
 * - The correct .summa.json extension is appended
 * - Saving with errors disabled
 * - Filename input clears between opens (stateless)
 */
import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import {
	goto,
	enterValue,
	openSaveModal,
	openLoadModal,
	saveAs,
	loadFile,
	toggleAdvancedOptions,
	addSubtotalItem,
	navigateIntoSubtotal,
	navigateViaBreadcrumb,
} from '../config/playwright/helpers/test-helpers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SIMPLE_FIXTURE = path.resolve(__dirname, 'fixtures/simple.summa.json');

// ─── Filename always resets to empty on open ──────────────────────────────────

test.describe('filename resets to empty on each modal open', () => {
	test('save modal filename starts empty', async ({ page }) => {
		await goto(page);
		await openSaveModal(page);
		await expect(page.getByLabel('Filename')).toHaveValue('');
	});

	test('typing a filename then cancelling leaves it empty on next open', async ({ page }) => {
		await goto(page);
		await openSaveModal(page);
		await page.getByLabel('Filename').fill('typed-but-cancelled');
		await page.getByRole('button', { name: 'cancel', exact: true }).click();
		// Re-open: filename should be empty (reset every time modal opens)
		await openSaveModal(page);
		await expect(page.getByLabel('Filename')).toHaveValue('');
	});

	test('after saving with a name, re-opening modal shows empty again', async ({ page }) => {
		await goto(page);
		await openSaveModal(page);
		await saveAs(page, 'my-ledger');
		// The modal closed after save; re-open it
		await openSaveModal(page);
		// Filename is reset to empty on every open
		await expect(page.getByLabel('Filename')).toHaveValue('');
	});

	test('after loading a file, save modal shows empty filename', async ({ page }) => {
		await goto(page);
		await openSaveModal(page);
		await saveAs(page, 'before-load');
		await openLoadModal(page);
		await loadFile(page, SIMPLE_FIXTURE);
		await openSaveModal(page);
		await expect(page.getByLabel('Filename')).toHaveValue('');
	});

	test('opening save modal twice in a row: both times shows empty', async ({ page }) => {
		await goto(page);
		// First open
		await openSaveModal(page);
		await expect(page.getByLabel('Filename')).toHaveValue('');
		await page.keyboard.press('Escape');
		// Second open
		await openSaveModal(page);
		await expect(page.getByLabel('Filename')).toHaveValue('');
	});
});

// ─── Download filename ────────────────────────────────────────────────────────

test.describe('download uses the entered filename', () => {
	test('entered filename becomes the download file name', async ({ page }) => {
		await goto(page);
		await openSaveModal(page);
		const download = await saveAs(page, 'quarter-ledger');
		expect(download.suggestedFilename()).toBe('quarter-ledger.summa.json');
	});

	test('whitespace-only filename in modal downloads as summa.summa.json', async ({ page }) => {
		await goto(page);
		await openSaveModal(page);
		await page.getByLabel('Filename').fill('   ');
		const [download] = await Promise.all([
			page.waitForEvent('download'),
			page.getByRole('button', { name: 'save', exact: true }).last().click(),
		]);
		expect(download.suggestedFilename()).toBe('summa.summa.json');
	});
});

// ─── Export disabled with errors ──────────────────────────────────────────────

test.describe('export disabled state interacts with filename input', () => {
	test('export button disabled with error prevents save modal from opening (button is disabled)', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'zz'); // invalid
		const exportBtn = page.getByRole('button', { name: 'export', exact: true });
		await expect(exportBtn).toBeDisabled();
	});

	test('save modal accessible once error is cleared', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'zz'); // invalid
		await expect(
			page.getByRole('button', { name: 'export', exact: true })
		).toBeDisabled();
		await enterValue(page, 0, 'd', 'v'); // fix the error
		await expect(
			page.getByRole('button', { name: 'export', exact: true })
		).not.toBeDisabled();
		// Modal opens correctly
		await openSaveModal(page);
		await expect(page.getByLabel('Filename')).toBeVisible();
		await expect(page.getByLabel('Filename')).toHaveValue('');
	});

	test('nested error in subtotal disables export', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'zz'); // invalid in subtotal
		await navigateViaBreadcrumb(page, 'Summa totalis');
		await expect(
			page.getByRole('button', { name: 'export', exact: true })
		).toBeDisabled();
	});
});
