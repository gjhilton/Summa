/**
 * Row action tests specific to extended items and subtotal items:
 * - Duplicate extended item copies price, quantity, title
 * - Clear extended item zeroes price/quantity but keeps the row
 * - Delete extended item removes it from list
 * - Duplicate subtotal item creates a sibling with same title
 * - Clear subtotal item (from parent row) resets its children
 * - Tab order through extended item: title → li → s → d → quantity → next row
 * - Save (export) disabled when subtotal has a nested error
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
	revealRowActions,
	clickDeleteRow,
	clickDuplicateRow,
	clickClearRow,
	clickUndo,
} from '../config/playwright/helpers/test-helpers.js';

// ─── Extended item: duplicate ─────────────────────────────────────────────────

test.describe('duplicate extended item', () => {
	test('duplicate extended item increases item count to 4', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await enableShowWorking(page);
		await expect(getItemsCount(page)).toHaveText('Items: 3');
		// Row index 2 is the extended item (rows 0, 1 are line items)
		await clickDuplicateRow(page, 2);
		await expect(getItemsCount(page)).toHaveText('Items: 4');
	});

	test('duplicate extended item copies unit price', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 'd', 2).fill('v'); // 5d unit price
		// Duplicate row 2
		await clickDuplicateRow(page, 2);
		// New row at index 3 should also have 5d unit price
		await expect(getField(page, 'd', 3)).toHaveValue('v');
	});

	test('duplicate extended item copies quantity', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await page.getByLabel('quantity').first().fill('iij'); // 3 units
		await clickDuplicateRow(page, 2);
		// New row's quantity should be 3
		await expect(page.getByLabel('quantity').nth(1)).toHaveValue('iij');
	});

	test('duplicate extended item copies title', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await page.getByLabel('Item title').first().fill('Candles');
		await clickDuplicateRow(page, 2);
		await expect(page.getByLabel('Item title').nth(1)).toHaveValue('Candles');
	});

	test('duplicate extended item doubles its contribution to total', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 'd', 2).fill('v');               // 5d unit price
		await page.getByLabel('quantity').first().fill('ij'); // 2 units = 10d
		await clickDuplicateRow(page, 2);
		// Two identical extended items: 10d + 10d = 20d = 1s 8d
		await expect(getTotalField(page, 's')).toHaveValue('j');
		await expect(getTotalField(page, 'd')).toHaveValue('viij');
	});
});

// ─── Extended item: clear ─────────────────────────────────────────────────────

test.describe('clear extended item', () => {
	test('clear extended item zeroes its product display', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 'd', 2).fill('v');               // 5d
		await page.getByLabel('quantity').first().fill('ij'); // 2 units
		// Verify it contributes to total
		await expect(getTotalField(page, 'd')).toHaveValue('x');
		// Clear the extended item row
		await clickClearRow(page, 2);
		// Total should now be empty (no contribution)
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});

	test('clear extended item keeps item count unchanged', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await enableShowWorking(page);
		await expect(getItemsCount(page)).toHaveText('Items: 3');
		await clickClearRow(page, 2);
		// Row is kept, count unchanged
		await expect(getItemsCount(page)).toHaveText('Items: 3');
	});

	test('undo after clear extended item restores its price and quantity', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 'd', 2).fill('v');
		await page.getByLabel('quantity').first().fill('iij');
		await clickClearRow(page, 2);
		// Verify cleared
		await expect(getTotalField(page, 'd')).toHaveValue('');
		await clickUndo(page);
		// Restored: 5d × 3 = 15d = 1s 3d
		await expect(getTotalField(page, 's')).toHaveValue('j');
		await expect(getTotalField(page, 'd')).toHaveValue('iij');
	});
});

// ─── Extended item: delete ────────────────────────────────────────────────────

test.describe('delete extended item', () => {
	test('delete extended item removes it from list', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await enableShowWorking(page);
		await expect(getItemsCount(page)).toHaveText('Items: 3');
		await clickDeleteRow(page, 2);
		await expect(getItemsCount(page)).toHaveText('Items: 2');
	});

	test('delete extended item removes its contribution from total', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 'd', 2).fill('v');              // 5d
		await page.getByLabel('quantity').first().fill('ij'); // 2 units = 10d
		await expect(getTotalField(page, 'd')).toHaveValue('x');
		await clickDeleteRow(page, 2);
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});

	test('undo after delete extended item restores it', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 'd', 2).fill('v');
		await enableShowWorking(page);
		await expect(getItemsCount(page)).toHaveText('Items: 3');
		await clickDeleteRow(page, 2);
		await expect(getItemsCount(page)).toHaveText('Items: 2');
		await clickUndo(page);
		await expect(getItemsCount(page)).toHaveText('Items: 3');
		// Restored value
		await expect(getField(page, 'd', 2)).toHaveValue('v');
	});
});

// ─── Subtotal item: duplicate ──────────────────────────────────────────────────

test.describe('duplicate subtotal item', () => {
	test('duplicate subtotal item increases item count', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await enableShowWorking(page);
		await expect(getItemsCount(page)).toHaveText('Items: 3');
		await clickDuplicateRow(page, 2);
		await expect(getItemsCount(page)).toHaveText('Items: 4');
	});

	test('duplicate subtotal item creates independent copy', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'v'); // 5d inside subtotal
		await navigateViaBreadcrumb(page, 'Summa totalis');
		// Verify subtotal contributes 5d
		await expect(getTotalField(page, 'd')).toHaveValue('v');
		// Duplicate the subtotal row (index 2 in root)
		await clickDuplicateRow(page, 2);
		// Two identical subtotals: 5d + 5d = 10d
		await expect(getTotalField(page, 'd')).toHaveValue('x');
	});
});

// ─── Tab order: extended item ─────────────────────────────────────────────────

test.describe('tab order through extended item', () => {
	test('quantity field is focusable via keyboard', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await page.getByLabel('quantity').first().focus();
		await expect(page.getByLabel('quantity').first()).toBeFocused();
	});

	test('tab from quantity moves focus to li (librae) unit price field', async ({ page }) => {
		// DOM order: Item title → quantity → li → s → d (unit price)
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await page.getByLabel('quantity').first().focus();
		await page.keyboard.press('Tab');
		// After quantity, next focusable is li (librae) field of unit price
		await expect(page.getByLabel('li', { exact: true }).nth(2)).toBeFocused();
	});

	test('shift+tab from li unit price field reaches the quantity field', async ({ page }) => {
		// DOM order: Item title → quantity → li → s → d (unit price)
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		// Focus the li field of the extended item (index 2 among li fields)
		await page.getByLabel('li', { exact: true }).nth(2).focus();
		await page.keyboard.press('Shift+Tab');
		// Shift+Tab from li unit price should reach quantity field
		await expect(page.getByLabel('quantity').first()).toBeFocused();
	});

	test('tab from Item title reaches quantity field', async ({ page }) => {
		// DOM order: Item title → quantity → li → s → d (unit price)
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await page.getByLabel('Item title').first().focus();
		await page.keyboard.press('Tab');
		// After Item title, next is quantity
		await expect(page.getByLabel('quantity').first()).toBeFocused();
	});
});

// ─── Save disabled due to nested error ───────────────────────────────────────

test.describe('export disabled due to nested error in subtotal', () => {
	test('export button disabled when subtotal has an error child', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'zz'); // invalid → subtotal has error
		await navigateViaBreadcrumb(page, 'Summa totalis');
		const exportBtn = page.getByRole('button', { name: 'export', exact: true });
		await expect(exportBtn).toBeDisabled();
	});

	test('export button re-enabled after fixing nested error', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'zz'); // invalid
		await navigateViaBreadcrumb(page, 'Summa totalis');
		await expect(
			page.getByRole('button', { name: 'export', exact: true })
		).toBeDisabled();
		// Fix the error
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'v'); // now valid
		await navigateViaBreadcrumb(page, 'Summa totalis');
		await expect(
			page.getByRole('button', { name: 'export', exact: true })
		).not.toBeDisabled();
	});
});
