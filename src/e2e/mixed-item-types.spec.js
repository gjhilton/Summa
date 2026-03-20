/**
 * Tests for calculations with mixed item types:
 * - Line items + extended items + subtotal items all together
 * - Multiple subtotals at root level
 * - Delete the only subtotal (with 2 regular items remaining)
 * - Reorder mixed types
 * - Show working with mixed types
 * - Error in one type does not affect others
 */
import { test, expect } from '@playwright/test';
import {
	goto,
	enterValue,
	getField,
	getTotalField,
	enableShowWorking,
	getItemsCount,
	toggleAdvancedOptions,
	addExtendedItem,
	addSubtotalItem,
	navigateIntoSubtotal,
	navigateViaBreadcrumb,
	clickDeleteRow,
	clickDuplicateRow,
	revealRowActions,
} from '../config/playwright/helpers/test-helpers.js';

// ─── Multiple subtotals at root ───────────────────────────────────────────────

test.describe('multiple subtotals at root level', () => {
	test('two subtotals both contribute to root total', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		// Add first subtotal
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'v'); // 5d
		await navigateViaBreadcrumb(page, 'Summa totalis');
		// Add second subtotal
		await addSubtotalItem(page);
		// Navigate into the second one (now the last edit button)
		await page.getByRole('button', { name: 'edit' }).last().click();
		await enterValue(page, 0, 'd', 'iij'); // 3d
		await navigateViaBreadcrumb(page, 'Summa totalis');
		// Total: 5d + 3d = 8d
		await expect(getTotalField(page, 'd')).toHaveValue('viij');
	});

	test('error in one subtotal does not affect other subtotal', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		// First subtotal: valid 5d
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'v');
		await navigateViaBreadcrumb(page, 'Summa totalis');
		// Second subtotal: invalid
		await addSubtotalItem(page);
		await page.getByRole('button', { name: 'edit' }).last().click();
		await enterValue(page, 0, 'd', 'zz');
		await navigateViaBreadcrumb(page, 'Summa totalis');
		// Only first subtotal (5d) contributes; second excluded due to error
		await expect(getTotalField(page, 'd')).toHaveValue('v');
	});

	test('item count with two subtotals is 4 (2 default lines + 2 subtotals)', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await addSubtotalItem(page);
		await enableShowWorking(page);
		await expect(getItemsCount(page)).toHaveText('Items: 4');
	});
});

// ─── Mixed types calculation ──────────────────────────────────────────────────

test.describe('mixed item types in one calculation', () => {
	test('line + extended + subtotal all contribute to total', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		// Row 0: line item with 3d
		await enterValue(page, 0, 'd', 'iij');
		// Add extended item: 5d × 2 = 10d
		await addExtendedItem(page);
		await getField(page, 'd', 2).fill('v');             // 5d unit
		await page.getByLabel('quantity').first().fill('ij'); // 2 units
		// Add subtotal with 2d
		await addSubtotalItem(page);
		await page.getByRole('button', { name: 'edit' }).first().click();
		await enterValue(page, 0, 'd', 'ij');
		await navigateViaBreadcrumb(page, 'Summa totalis');
		// Total: 3d + 10d + 2d = 15d = 1s 3d
		await expect(getTotalField(page, 's')).toHaveValue('j');
		await expect(getTotalField(page, 'd')).toHaveValue('iij');
	});

	test('extended item error does not affect line items or subtotals', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await enterValue(page, 0, 'd', 'v'); // 5d line item
		await addExtendedItem(page);
		await getField(page, 'd', 2).fill('zz'); // invalid extended
		// Total: only the 5d line item contributes
		await expect(getTotalField(page, 'd')).toHaveValue('v');
	});

	test('show working with mixed types shows items count correctly', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await addSubtotalItem(page);
		await enableShowWorking(page);
		// 2 default + 1 extended + 1 subtotal = 4 items
		await expect(getItemsCount(page)).toHaveText('Items: 4');
	});
});

// ─── Delete and duplicate across types ───────────────────────────────────────

test.describe('delete and duplicate mixed item types', () => {
	test('can delete a subtotal item leaving only line items', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await enableShowWorking(page);
		await expect(getItemsCount(page)).toHaveText('Items: 3');
		// Delete the subtotal (row 2)
		await clickDeleteRow(page, 2);
		await expect(getItemsCount(page)).toHaveText('Items: 2');
	});

	test('can delete an extended item leaving only line items', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await enableShowWorking(page);
		await expect(getItemsCount(page)).toHaveText('Items: 3');
		await clickDeleteRow(page, 2);
		await expect(getItemsCount(page)).toHaveText('Items: 2');
	});

	test('duplicate subtotal item with children doubles its contribution', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'v'); // 5d in subtotal
		await navigateViaBreadcrumb(page, 'Summa totalis');
		// Duplicate subtotal (row 2)
		await clickDuplicateRow(page, 2);
		// Two subtotals each with 5d → total 10d
		await expect(getTotalField(page, 'd')).toHaveValue('x');
	});

	test('duplicate extended item doubles its contribution', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 'd', 2).fill('v'); // 5d × 1 = 5d
		await clickDuplicateRow(page, 2);
		// Two extended items each with 5d → total 10d
		await expect(getTotalField(page, 'd')).toHaveValue('x');
	});
});

// ─── Show working with subtotal ───────────────────────────────────────────────

test.describe('show working with subtotal items', () => {
	test('show working reveals subtotal item pence breakdown at root', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 's', 'v'); // 5s = 60d
		await navigateViaBreadcrumb(page, 'Summa totalis');
		await enableShowWorking(page);
		// The subtotal row shows its total pence breakdown
		await expect(page.getByText(/60/).first()).toBeVisible();
	});

	test('sub-calc total row shows "paginæ" label', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await expect(page.getByText('paginæ')).toBeVisible();
	});
});
