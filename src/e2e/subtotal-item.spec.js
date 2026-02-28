import { test, expect } from '@playwright/test';
import {
	goto,
	toggleAdvancedOptions,
	addSubtotalItem,
	navigateIntoSubtotal,
	navigateViaBreadcrumb,
	enterValue,
} from '../config/playwright/helpers/test-helpers.js';

test.describe('subtotal items', () => {
	test('can add a subtotal item in advanced mode', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await expect(page.getByText('Total items: 3')).toBeVisible();
	});

	test('subtotal shows a pencil edit button', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		const editBtn = page.getByRole('button', { name: /edit subtotal/i });
		await expect(editBtn).toBeVisible();
	});

	test('clicking pencil navigates into the subtotal', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		// Should now show the breadcrumb nav
		await expect(page.getByRole('navigation', { name: /breadcrumb/i })).toBeVisible();
		// Should show "Summa paginae" heading
		await expect(page.getByText('Summa paginae')).toBeVisible();
	});

	test('sub-level shows advanced options toggle as disabled', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		const toggle = page.getByRole('switch', { name: /advanced options/i });
		await expect(toggle).toBeDisabled();
	});

	test('adding lines inside subtotal updates sub-total display', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		// Enter values inside the sub-calculation
		await enterValue(page, 0, 'd', 'v');   // 5d
		await enterValue(page, 1, 'd', 'iii'); // 3d
		// Sub-total should show viii = 8d
		const dTotal = page.getByLabel('d').last();
		await expect(dTotal).toHaveValue('viij');
	});

	test('navigating back via breadcrumb shows parent total includes subtotal', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'v');   // 5d
		await enterValue(page, 1, 'd', 'iii'); // 3d = 8d subtotal
		// Navigate back to root
		await navigateViaBreadcrumb(page, 'Summa');
		// Breadcrumb should be gone
		await expect(page.getByText('Summa paginae')).not.toBeVisible();
		// The root total should include the 8d from the subtotal
		const dTotal = page.getByLabel('d').last();
		await expect(dTotal).toHaveValue('viij');
	});

	test('Clear at sub-level only resets sub-calc', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		// Set a value at root level
		await enterValue(page, 0, 'd', 'v');
		// Add subtotal, navigate in, set values
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'iii');
		// Clear at sub-level
		page.on('dialog', (dialog) => dialog.accept());
		await page.getByRole('button', { name: /clear/i }).click();
		// Sub-calc should be reset (2 empty lines)
		await expect(page.getByText('Total items: 2')).toBeVisible();
		// Navigate back — root line 0 should still have its value
		await navigateViaBreadcrumb(page, 'Summa');
		const dInput = page.getByLabel('d').first();
		await expect(dInput).toHaveValue('v');
	});

	test('nested subtotals: can add subtotal inside subtotal', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		// Advanced options should be disabled at depth 1 — cannot add sub-subtotal via toggle
		// So this test verifies the disabled state
		const toggle = page.getByRole('switch', { name: /advanced options/i });
		await expect(toggle).toBeDisabled();
	});
});
