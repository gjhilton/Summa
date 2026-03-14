import { test, expect } from '@playwright/test';
import {
	goto,
	openSaveModal,
	toggleAdvancedOptions,
	addSubtotalItem,
	navigateIntoSubtotal,
	revealRowActions,
} from '../config/playwright/helpers/test-helpers.js';

// ─── Modal focus ──────────────────────────────────────────────────────────────

test.describe('Save modal focus', () => {
	test('filename input receives focus when Save modal opens', async ({ page }) => {
		await goto(page);
		await openSaveModal(page);
		await expect(page.getByLabel('Filename')).toBeFocused();
	});

	test('Tab from filename reaches the cancel button', async ({ page }) => {
		await goto(page);
		await openSaveModal(page);
		// Filename is autofocused; one Tab → cancel
		await page.keyboard.press('Tab');
		await expect(
			page.getByRole('button', { name: 'cancel', exact: true })
		).toBeFocused();
	});

	test('Tab from cancel reaches the save button', async ({ page }) => {
		await goto(page);
		await openSaveModal(page);
		await page.keyboard.press('Tab'); // → cancel
		await page.keyboard.press('Tab'); // → save
		await expect(
			page.getByRole('button', { name: 'save', exact: true }).last()
		).toBeFocused();
	});

	test('Escape key closes Save modal without triggering a download', async ({ page }) => {
		await goto(page);
		await openSaveModal(page);
		// Watch for any download event — none should fire
		let downloadFired = false;
		page.on('download', () => { downloadFired = true; });
		await page.keyboard.press('Escape');
		await expect(page.getByText('Save calculation')).not.toBeVisible();
		expect(downloadFired).toBe(false);
	});
});

// ─── Tab order: action buttons excluded ───────────────────────────────────────

test.describe('Tab order: action buttons', () => {
	test('action buttons have tabIndex -1 so are not in the Tab sequence', async ({
		page,
	}) => {
		await goto(page);
		// Verify each action button has tabIndex=-1 in the DOM
		const deleteBtn = page.getByRole('button', { name: 'Delete row' }).first();
		const duplicateBtn = page
			.getByRole('button', { name: 'Duplicate row' })
			.first();
		const clearBtn = page.getByRole('button', { name: 'Clear item' }).first();
		await expect(deleteBtn).toHaveAttribute('tabindex', '-1');
		await expect(duplicateBtn).toHaveAttribute('tabindex', '-1');
		await expect(clearBtn).toHaveAttribute('tabindex', '-1');
	});

	test('Tab from d field moves to the title of the next row', async ({ page }) => {
		await goto(page);
		// Use focus() to avoid clicking into the action strip overlay
		await page.getByLabel('d', { exact: true }).first().focus();
		await page.keyboard.press('Tab');
		await expect(page.getByLabel('Line title').nth(1)).toBeFocused();
	});
});

// ─── Shift+Tab ────────────────────────────────────────────────────────────────

test.describe('Shift+Tab (reverse tab order)', () => {
	test('Shift+Tab from li field reaches the Line title in the same row', async ({ page }) => {
		await goto(page);
		await page.getByLabel('li', { exact: true }).first().click();
		await page.keyboard.press('Shift+Tab');
		await expect(page.getByLabel('Line title').first()).toBeFocused();
	});

	test('Shift+Tab from s field reaches the li field', async ({ page }) => {
		await goto(page);
		await page.getByLabel('s', { exact: true }).first().click();
		await page.keyboard.press('Shift+Tab');
		await expect(page.getByLabel('li', { exact: true }).first()).toBeFocused();
	});
});

// ─── Enter key in calculation fields ─────────────────────────────────────────

test.describe('Enter key in calculation fields', () => {
	test('Enter in d field does not clear or change the entered value', async ({ page }) => {
		await goto(page);
		await page.getByLabel('d', { exact: true }).first().fill('v');
		await page.getByLabel('d', { exact: true }).first().press('Enter');
		await expect(page.getByLabel('d', { exact: true }).first()).toHaveValue('v');
	});

	test('Enter in li field does not clear or change the entered value', async ({ page }) => {
		await goto(page);
		await page.getByLabel('li', { exact: true }).first().fill('iij');
		await page.getByLabel('li', { exact: true }).first().press('Enter');
		await expect(page.getByLabel('li', { exact: true }).first()).toHaveValue('iij');
	});
});

// ─── Toggles at sub-level ─────────────────────────────────────────────────────

test.describe('Toggles remain interactive at sub-level', () => {
	test('advanced mode toggle is not disabled at sub-level', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		const toggle = page.getByRole('switch', { name: /advanced mode/i });
		await expect(toggle).not.toBeDisabled();
	});

	test('advanced mode toggle can be toggled off at sub-level', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		const toggle = page.getByRole('switch', { name: /advanced mode/i });
		await toggle.click();
		await expect(toggle).toHaveAttribute('aria-checked', 'false');
	});

	test('show working toggle is not disabled at sub-level', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		const toggle = page.getByRole('switch', { name: /explain calculations/i });
		await expect(toggle).not.toBeDisabled();
	});

	test('show working toggle can be enabled at sub-level', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		const toggle = page.getByRole('switch', { name: /explain calculations/i });
		await toggle.click();
		await expect(toggle).toHaveAttribute('aria-checked', 'true');
	});
});
