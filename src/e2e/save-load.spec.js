import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import {
	goto,
	enterValue,
	openSaveModal,
	openLoadModal,
	closeSaveModal,
	closeLoadModal,
	saveAs,
	loadFile,
	toggleAdvancedOptions,
	addSubtotalItem,
	navigateIntoSubtotal,
} from '../config/playwright/helpers/test-helpers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SIMPLE_FIXTURE = path.resolve(__dirname, 'fixtures/simple.summa.json');
const INVALID_FIXTURE = path.resolve(__dirname, 'fixtures/invalid.json');

// ─── button visibility ────────────────────────────────────────────────────────

test.describe('Save/Load button visibility', () => {
	test('Save button visible on root level', async ({ page }) => {
		await goto(page);
		await expect(
			page.getByRole('button', { name: 'Save', exact: true })
		).toBeVisible();
	});

	test('Load button visible on root level', async ({ page }) => {
		await goto(page);
		await expect(
			page.getByRole('button', { name: 'Load', exact: true })
		).toBeVisible();
	});

	test('Save button hidden on sub-level', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page, 'Untitled');
		await expect(
			page.getByRole('button', { name: 'Save', exact: true })
		).not.toBeVisible();
	});

	test('Load button hidden on sub-level', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page, 'Untitled');
		await expect(
			page.getByRole('button', { name: 'Load', exact: true })
		).not.toBeVisible();
	});
});

// ─── Save button enabled/disabled ────────────────────────────────────────────

test.describe('Save button state', () => {
	test('Save button is enabled when no errors', async ({ page }) => {
		await goto(page);
		const saveBtn = page.getByRole('button', { name: 'Save', exact: true });
		await expect(saveBtn).not.toBeDisabled();
	});

	test('Save button is disabled when a line has an error', async ({
		page,
	}) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'not-roman');
		const saveBtn = page.getByRole('button', { name: 'Save', exact: true });
		await expect(saveBtn).toBeDisabled();
	});

	test('Save button re-enables after fixing error', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'not-roman');
		const saveBtn = page.getByRole('button', { name: 'Save', exact: true });
		await expect(saveBtn).toBeDisabled();
		await enterValue(page, 0, 'd', 'v');
		await expect(saveBtn).not.toBeDisabled();
	});
});

// ─── Save modal ───────────────────────────────────────────────────────────────

test.describe('Save modal', () => {
	test('Save modal opens on click', async ({ page }) => {
		await goto(page);
		await openSaveModal(page);
		await expect(page.getByText('Save calculation')).toBeVisible();
	});

	test('Save modal closes on Escape', async ({ page }) => {
		await goto(page);
		await openSaveModal(page);
		await closeSaveModal(page);
		await expect(page.getByText('Save calculation')).not.toBeVisible();
	});

	test('Save modal has filename input', async ({ page }) => {
		await goto(page);
		await openSaveModal(page);
		await expect(page.getByLabel('Filename')).toBeVisible();
	});

	test('Save modal shows .summa.json suffix', async ({ page }) => {
		await goto(page);
		await openSaveModal(page);
		await expect(page.getByText('.summa.json')).toBeVisible();
	});

	test('filename defaults to empty on first save', async ({ page }) => {
		await goto(page);
		await openSaveModal(page);
		await expect(page.getByLabel('Filename')).toHaveValue('');
	});

	test('after saving "my-calc", re-open modal shows "my-calc"', async ({
		page,
	}) => {
		await goto(page);
		await openSaveModal(page);
		await saveAs(page, 'my-calc');
		await openSaveModal(page);
		await expect(page.getByLabel('Filename')).toHaveValue('my-calc');
	});

	test('after Clear, save modal filename is empty', async ({ page }) => {
		await goto(page);
		await openSaveModal(page);
		await saveAs(page, 'my-calc');

		// Clear the calculation
		page.once('dialog', dialog => dialog.accept());
		await page.getByRole('button', { name: 'Clear', exact: true }).click();

		await openSaveModal(page);
		await expect(page.getByLabel('Filename')).toHaveValue('');
	});

	test('save triggers download', async ({ page }) => {
		await goto(page);
		await openSaveModal(page);
		const download = await saveAs(page, 'test-calc');
		expect(download.suggestedFilename()).toBe('test-calc.summa.json');
	});

	test('saved file is valid JSON with summa metadata', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'v');
		await openSaveModal(page);
		const download = await saveAs(page, 'test-calc');
		const filePath = await download.path();
		if (!filePath) throw new Error('Download path is null');
		const { readFileSync } = await import('fs');
		const content = JSON.parse(readFileSync(filePath, 'utf-8'));
		expect(content.metadata.appName).toBe('summa');
		expect(Array.isArray(content.lines)).toBe(true);
	});
});

// ─── Load modal ───────────────────────────────────────────────────────────────

test.describe('Load modal', () => {
	test('Load modal opens on click', async ({ page }) => {
		await goto(page);
		await openLoadModal(page);
		await expect(page.getByText('Load calculation')).toBeVisible();
	});

	test('Load modal closes on Escape', async ({ page }) => {
		await goto(page);
		await openLoadModal(page);
		await closeLoadModal(page);
		await expect(page.getByText('Load calculation')).not.toBeVisible();
	});

	test('Load modal has file input', async ({ page }) => {
		await goto(page);
		await openLoadModal(page);
		await expect(page.getByLabel('Summa file')).toBeVisible();
	});

	test('Load modal Cancel button closes the modal', async ({ page }) => {
		await goto(page);
		await openLoadModal(page);
		await page.getByRole('button', { name: 'Cancel', exact: true }).click();
		await expect(page.getByText('Load calculation')).not.toBeVisible();
	});
});

// ─── Load a valid file ────────────────────────────────────────────────────────

test.describe('Loading a valid fixture file', () => {
	test('loads fixture and shows correct totals', async ({ page }) => {
		await goto(page);
		await openLoadModal(page);
		await loadFile(page, SIMPLE_FIXTURE);
		// 5s + 7s = 12s
		const totalS = page.getByLabel('shillings', { exact: true }).last();
		await expect(totalS).toHaveText('xij');
	});

	test('loads fixture and shows line titles', async ({ page }) => {
		await goto(page);
		await openLoadModal(page);
		await loadFile(page, SIMPLE_FIXTURE);
		await expect(page.getByLabel('Line title').first()).toHaveValue(
			'First item'
		);
		await expect(page.getByLabel('Line title').nth(1)).toHaveValue(
			'Second item'
		);
	});

	test('after loading, save modal filename is empty', async ({ page }) => {
		await goto(page);
		// First save something
		await openSaveModal(page);
		await saveAs(page, 'original');
		// Now load a different file
		await openLoadModal(page);
		await loadFile(page, SIMPLE_FIXTURE);
		// Filename should reset
		await openSaveModal(page);
		await expect(page.getByLabel('Filename')).toHaveValue('');
	});
});

// ─── Invalid file error handling ──────────────────────────────────────────────

test.describe('Invalid file handling', () => {
	test('invalid file shows error message in modal', async ({ page }) => {
		await goto(page);
		await openLoadModal(page);
		await page.getByLabel('Summa file').setInputFiles(INVALID_FIXTURE);
		await page
			.getByRole('button', { name: 'Load', exact: true })
			.last()
			.click();
		await expect(page.getByText('Not a valid JSON file')).toBeVisible();
	});

	test('error does not clear the existing calculation', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'v');
		// Confirm value is present
		const totalD = page.getByLabel('pence', { exact: true }).last();
		await expect(totalD).toHaveText('v');

		await openLoadModal(page);
		await page.getByLabel('Summa file').setInputFiles(INVALID_FIXTURE);
		await page
			.getByRole('button', { name: 'Load', exact: true })
			.last()
			.click();

		// Error shown, modal still open
		await expect(page.getByText('Not a valid JSON file')).toBeVisible();
		// Close modal and verify calculation unchanged
		await page.keyboard.press('Escape');
		await expect(totalD).toHaveText('v');
	});

	test('modal stays open on load failure', async ({ page }) => {
		await goto(page);
		await openLoadModal(page);
		await page.getByLabel('Summa file').setInputFiles(INVALID_FIXTURE);
		await page
			.getByRole('button', { name: 'Load', exact: true })
			.last()
			.click();
		await expect(page.getByText('Load calculation')).toBeVisible();
	});
});
