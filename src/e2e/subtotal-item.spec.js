import { test, expect } from '@playwright/test';
import {
	goto,
	toggleAdvancedOptions,
	addSubtotalItem,
	navigateIntoSubtotal,
	navigateViaBreadcrumb,
	enterValue,
	enableShowWorking,
	getItemsCount,
	getTotalField,
	getField,
	clickUndo,
} from '../config/playwright/helpers/test-helpers.js';

test.describe('subtotal items', () => {
	test('can add a subtotal item in advanced mode', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await enableShowWorking(page);
		await expect(getItemsCount(page)).toHaveText('Items: 3');
	});

	test('subtotal item shows an edit button', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await expect(page.getByRole('button', { name: 'edit' })).toBeVisible();
	});

	test('clicking edit navigates into the sub-calculation', async ({
		page,
	}) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await expect(
			page.getByRole('navigation', { name: /breadcrumb/i })
		).toBeVisible();
	});

	test('breadcrumb root shows "Summa totalis"', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await expect(
			page.getByRole('button', { name: 'Summa totalis' })
		).toBeVisible();
	});

	test('sub-level has a done button', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await expect(
			page.getByRole('button', { name: 'done', exact: true })
		).toBeVisible();
	});

	test('done button returns to parent calculation', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await page.getByRole('button', { name: 'done', exact: true }).click();
		await expect(
			page.getByRole('navigation', { name: /breadcrumb/i })
		).not.toBeVisible();
	});

	test('root clear confirm says "Clear all items?"', async ({ page }) => {
		await goto(page);
		let dialogMessage = '';
		page.once('dialog', async dialog => {
			dialogMessage = dialog.message();
			await dialog.dismiss();
		});
		await page.getByRole('button', { name: 'clear', exact: true }).click();
		expect(dialogMessage).toBe('Clear all items?');
	});

	test('adding lines inside subtotal updates sub-total display', async ({
		page,
	}) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'v'); // 5d
		await enterValue(page, 1, 'd', 'iii'); // 3d
		// Sub-total should show viii = 8d
		await expect(getTotalField(page, 'd')).toHaveValue('viij');
	});

	test('navigating back via breadcrumb shows parent total includes subtotal', async ({
		page,
	}) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'v'); // 5d
		await enterValue(page, 1, 'd', 'iii'); // 3d = 8d subtotal
		await navigateViaBreadcrumb(page, 'Summa totalis');
		await expect(getTotalField(page, 'd')).toHaveValue('viij');
	});

	test('sub-level clear resets sub-calc to 2 empty lines', async ({
		page,
	}) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'v');
		await enterValue(page, 1, 'd', 'iii');
		// Clear at sub-level
		page.once('dialog', d => d.accept());
		await page.getByRole('button', { name: 'clear', exact: true }).click();
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});

	test('sub-level clear does not affect root total', async ({ page }) => {
		await goto(page);
		// Add a regular line with a value at root
		await enterValue(page, 0, 'd', 'x'); // 10d at root
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'v');
		page.once('dialog', d => d.accept());
		await page.getByRole('button', { name: 'clear', exact: true }).click();
		// Navigate back to root
		await navigateViaBreadcrumb(page, 'Summa totalis');
		// Root line (10d) unaffected; subtotal now 0
		await expect(getTotalField(page, 'd')).toHaveValue('x');
	});

	test('undo after sub-level clear restores sub-calc contents', async ({
		page,
	}) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'v');
		page.once('dialog', d => d.accept());
		await page.getByRole('button', { name: 'clear', exact: true }).click();
		await expect(getTotalField(page, 'd')).toHaveValue('');
		await clickUndo(page);
		await expect(getTotalField(page, 'd')).toHaveValue('v');
	});

	test('sub-level error lines excluded from subtotal', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'v'); // 5d valid
		await enterValue(page, 1, 'd', 'zz'); // invalid, excluded
		await expect(getTotalField(page, 'd')).toHaveValue('v');
	});

	test('duplicate subtotal copies its children', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'v'); // 5d inside subtotal
		await navigateViaBreadcrumb(page, 'Summa totalis');
		// Hover the subtotal row (index 2) to reveal its action strip, then duplicate
		await page.getByRole('button', { name: 'Drag to reorder' }).nth(2).hover();
		await page.getByRole('button', { name: 'Duplicate row' }).nth(2).click();
		// Now 2 subtotal items each contributing 5d → total 10d
		await expect(getTotalField(page, 'd')).toHaveValue('x');
	});
});
