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
} from '../config/playwright/helpers/test-helpers.js';

test.describe('subtotal items', () => {
	test('can add a subtotal item in advanced mode', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await enableShowWorking(page);
		await expect(getItemsCount(page)).toHaveText('Items: 3');
	});

	test('subtotal title is a clickable link', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		const titleBtn = page.getByRole('button', { name: 'Untitled' });
		await expect(titleBtn).toBeVisible();
	});

	test('clicking subtotal title navigates into the sub-calculation', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await expect(page.getByRole('navigation', { name: /breadcrumb/i })).toBeVisible();
	});

	test('breadcrumb root shows "Summa totalis"', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await expect(page.getByRole('button', { name: 'Summa totalis' })).toBeVisible();
	});

	test('sub-level total row shows "Summa paginae" instead of logo', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
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

	test('sub-level has a Done button', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await expect(page.getByRole('button', { name: '← Done' })).toBeVisible();
	});

	test('Done button returns to parent calculation', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await page.getByRole('button', { name: '← Done' }).click();
		await expect(page.getByRole('navigation', { name: /breadcrumb/i })).not.toBeVisible();
	});

	test('sub-level shows "Clear page" instead of "Clear"', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await expect(page.getByRole('button', { name: 'Clear page', exact: true })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Clear', exact: true })).not.toBeVisible();
	});

	test('root screen shows "Clear" not "Clear page"', async ({ page }) => {
		await goto(page);
		await expect(page.getByRole('button', { name: 'Clear', exact: true })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Clear page', exact: true })).not.toBeVisible();
	});

	test('Clear page confirm says "Erase N items?"', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		let dialogMessage = '';
		page.once('dialog', async (dialog) => {
			dialogMessage = dialog.message();
			await dialog.dismiss();
		});
		await page.getByRole('button', { name: 'Clear page' }).click();
		expect(dialogMessage).toMatch(/^Erase \d+ items\?$/);
	});

	test('root Clear confirm says "Clear all?"', async ({ page }) => {
		await goto(page);
		let dialogMessage = '';
		page.once('dialog', async (dialog) => {
			dialogMessage = dialog.message();
			await dialog.dismiss();
		});
		await page.getByRole('button', { name: 'Clear' }).click();
		expect(dialogMessage).toBe('Clear all?');
	});

	test('adding lines inside subtotal updates sub-total display', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'v');   // 5d
		await enterValue(page, 1, 'd', 'iii'); // 3d
		// Sub-total should show viii = 8d
		await expect(getTotalField(page, 'd')).toHaveText('viij');
	});

	test('navigating back via breadcrumb shows parent total includes subtotal', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'v');   // 5d
		await enterValue(page, 1, 'd', 'iii'); // 3d = 8d subtotal
		await navigateViaBreadcrumb(page, 'Summa totalis');
		await expect(page.getByText('Summa paginae')).not.toBeVisible();
		await expect(getTotalField(page, 'd')).toHaveText('viij');
	});

	test('Clear page at sub-level only resets sub-calc', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await enterValue(page, 0, 'd', 'v');
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'iii');
		page.on('dialog', (dialog) => dialog.accept());
		await page.getByRole('button', { name: 'Clear page' }).click();
		await enableShowWorking(page);
		await expect(getItemsCount(page)).toHaveText('Items: 2');
		await navigateViaBreadcrumb(page, 'Summa totalis');
		const dInput = await getField(page, 'd', 0);
		await expect(dInput).toHaveValue('v');
	});

});
