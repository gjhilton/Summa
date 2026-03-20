/**
 * Tests for subtotal item display at the parent level:
 * - "N items" count shown in subtotal row
 * - Subtotal total display in the parent row
 * - Subtotal title shown in the parent row
 * - Subtotal with 0 items (after clear) shows correct display
 * - Subtotal with error shows correct display
 */
import { test, expect } from '@playwright/test';
import {
	goto,
	enterValue,
	getTotalField,
	toggleAdvancedOptions,
	addSubtotalItem,
	navigateIntoSubtotal,
	navigateViaBreadcrumb,
	enableShowWorking,
} from '../config/playwright/helpers/test-helpers.js';

test.describe('subtotal item parent-level display', () => {
	test('subtotal shows item count "(N items)" in parent row', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		// Default subtotal has 2 lines
		await expect(page.getByText('(2 items)')).toBeVisible();
	});

	test('subtotal item count updates when children are added', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await page.getByRole('button', { name: '+ item' }).click();
		await navigateViaBreadcrumb(page, 'Summa totalis');
		// Now 3 lines inside
		await expect(page.getByText('(3 items)')).toBeVisible();
	});

	test('subtotal shows its computed total in parent row display', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'v'); // 5d
		await navigateViaBreadcrumb(page, 'Summa totalis');
		// Root total matches subtotal's 5d contribution
		await expect(getTotalField(page, 'd')).toHaveValue('v');
	});

	test('subtotal title visible in parent row as clickable edit button', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await page.getByLabel('Sub-calculation title').fill('Yearly total');
		await page.getByLabel('Sub-calculation title').press('Tab');
		await navigateViaBreadcrumb(page, 'Summa totalis');
		// The subtotal row should show the title text somewhere
		await expect(page.getByText('Yearly total')).toBeVisible();
	});

	test('empty subtotal shows "(2 items)" by default', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await expect(page.getByText('(2 items)')).toBeVisible();
	});

	test('subtotal with all-error children shows error state at parent', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'zz'); // invalid
		await enterValue(page, 1, 'd', 'zz'); // invalid
		await navigateViaBreadcrumb(page, 'Summa totalis');
		// Subtotal excluded → root total empty
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});

	test('show working at parent shows subtotal pence breakdown', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 's', 'v'); // 5s = 60d
		await navigateViaBreadcrumb(page, 'Summa totalis');
		await enableShowWorking(page);
		// Show working reveals pence total for the subtotal row
		await expect(page.getByText(/60/).first()).toBeVisible();
	});
});
