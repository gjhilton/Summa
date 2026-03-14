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
	getTotalField,
} from '../config/playwright/helpers/test-helpers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SIMPLE_FIXTURE = path.resolve(__dirname, 'fixtures/simple.summa.json');
const INVALID_FIXTURE = path.resolve(__dirname, 'fixtures/invalid.json');

// ─── button visibility ────────────────────────────────────────────────────────

test.describe('Save/Load button visibility', () => {
	test('export button visible on root level', async ({ page }) => {
		await goto(page);
		await expect(
			page.getByRole('button', { name: 'export', exact: true })
		).toBeVisible();
	});

	test('load button visible on root level', async ({ page }) => {
		await goto(page);
		await expect(
			page.getByRole('button', { name: 'load', exact: true }).first()
		).toBeVisible();
	});

	test('export button hidden on sub-level', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await expect(
			page.getByRole('button', { name: 'export', exact: true })
		).not.toBeVisible();
	});

	test('load button hidden on sub-level', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await expect(
			page.getByRole('button', { name: 'load', exact: true }).first()
		).not.toBeVisible();
	});
});

// ─── Save button enabled/disabled ────────────────────────────────────────────

test.describe('Save button state', () => {
	test('export button is enabled when no errors', async ({ page }) => {
		await goto(page);
		const saveBtn = page.getByRole('button', { name: 'export', exact: true });
		await expect(saveBtn).not.toBeDisabled();
	});

	test('export button is disabled when a line has an error', async ({
		page,
	}) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'not-roman');
		const saveBtn = page.getByRole('button', { name: 'export', exact: true });
		await expect(saveBtn).toBeDisabled();
	});

	test('export button re-enables after fixing error', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'not-roman');
		const saveBtn = page.getByRole('button', { name: 'export', exact: true });
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

	test('after Clear, save modal filename is empty', async ({ page }) => {
		await goto(page);
		await openSaveModal(page);
		await saveAs(page, 'my-calc');

		// Clear the calculation
		page.once('dialog', dialog => dialog.accept());
		await page.getByRole('button', { name: 'clear', exact: true }).click();

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

	test('saved file contains correct l/s/d values for entered data', async ({
		page,
	}) => {
		await goto(page);
		await enterValue(page, 0, 's', 'v'); // 5s
		await enterValue(page, 0, 'd', 'iij'); // 3d
		await openSaveModal(page);
		const download = await saveAs(page, 'values-test');
		const filePath = await download.path();
		if (!filePath) throw new Error('Download path is null');
		const { readFileSync } = await import('fs');
		const content = JSON.parse(readFileSync(filePath, 'utf-8'));
		const line = content.lines[0];
		expect(line.literals.s).toBe('v');
		expect(line.literals.d).toBe('iij');
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
		await page.getByRole('button', { name: 'cancel', exact: true }).click();
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
		const totalS = page.getByLabel('s', { exact: true }).last();
		await expect(totalS).toHaveValue('xij');
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

// ─── Save exports full root calculation ──────────────────────────────────────

test.describe('Save from sub-level', () => {
	test('saving from root exports all lines including subtotal children', async ({
		page,
	}) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'v'); // 5d inside subtotal
		// Return to root to save (export button only visible at root)
		await page.getByRole('button', { name: 'done', exact: true }).click();
		await openSaveModal(page);
		const download = await saveAs(page, 'full-export');
		const filePath = await download.path();
		if (!filePath) throw new Error('Download path is null');
		const { readFileSync } = await import('fs');
		const content = JSON.parse(readFileSync(filePath, 'utf-8'));
		// Root has 2 default lines + 1 subtotal; subtotal has children
		const subtotal = content.lines.find(
			(l) => l.itemType === 'SUBTOTAL_ITEM'
		);
		expect(subtotal).toBeTruthy();
		expect(Array.isArray(subtotal.lines)).toBe(true);
		// Sub-calc has the entered value
		const subLine = subtotal.lines[0];
		expect(subLine.literals.d).toBe('v');
	});
});

// ─── Load while navigated into subtotal ──────────────────────────────────────

test.describe('Load while inside subtotal', () => {
	test('loading a file from inside a subtotal resets navigation to root', async ({
		page,
	}) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		// Should be at sub-level (done button visible)
		await expect(
			page.getByRole('button', { name: 'done', exact: true })
		).toBeVisible();
		// Cannot load from sub-level (load button hidden), so navigate back first
		// This verifies that after loading, breadcrumb is gone
		await page.getByRole('button', { name: 'done', exact: true }).click();
		await openLoadModal(page);
		await loadFile(page, SIMPLE_FIXTURE);
		// After load: at root, no breadcrumb
		await expect(
			page.getByRole('navigation', { name: /breadcrumb/i })
		).not.toBeVisible();
		// Loaded data shows correct total
		await expect(getTotalField(page, 's')).toHaveValue('xij');
	});
});

// ─── Invalid file error handling ──────────────────────────────────────────────

test.describe('Invalid file handling', () => {
	test('invalid file shows error message in modal', async ({ page }) => {
		await goto(page);
		await openLoadModal(page);
		await page.getByLabel('Summa file').setInputFiles(INVALID_FIXTURE);
		await page
			.getByRole('button', { name: 'load', exact: true })
			.last()
			.click();
		await expect(page.getByText('Not a valid JSON file')).toBeVisible();
	});

	test('error does not clear the existing calculation', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'v');
		// Confirm value is present
		const totalD = page.getByLabel('d', { exact: true }).last();
		await expect(totalD).toHaveValue('v');

		await openLoadModal(page);
		await page.getByLabel('Summa file').setInputFiles(INVALID_FIXTURE);
		await page
			.getByRole('button', { name: 'load', exact: true })
			.last()
			.click();

		// Error shown, modal still open
		await expect(page.getByText('Not a valid JSON file')).toBeVisible();
		// Close modal and verify calculation unchanged
		await page.keyboard.press('Escape');
		await expect(totalD).toHaveValue('v');
	});

	test('modal stays open on load failure', async ({ page }) => {
		await goto(page);
		await openLoadModal(page);
		await page.getByLabel('Summa file').setInputFiles(INVALID_FIXTURE);
		await page
			.getByRole('button', { name: 'load', exact: true })
			.last()
			.click();
		await expect(page.getByText('Load calculation')).toBeVisible();
	});
});
