import { test, expect } from '@playwright/test';
import {
	goto,
	enableShowWorking,
	getItemsCount,
	toggleAdvancedOptions,
} from '../config/playwright/helpers/test-helpers.js';

test.describe('keyboard shortcuts', () => {
	test('= adds a line item', async ({ page }) => {
		await goto(page);
		await enableShowWorking(page);
		await page.keyboard.press('=');
		await expect(getItemsCount(page)).toHaveText('Items: 3');
	});

	test('= adds a line item when advanced mode is on', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await enableShowWorking(page);
		await page.keyboard.press('=');
		await expect(getItemsCount(page)).toHaveText('Items: 3');
		await expect(page.getByLabel('quantity')).toHaveCount(0);
	});

	test('Shift+= adds a line item when advanced mode is off', async ({
		page,
	}) => {
		await goto(page);
		await enableShowWorking(page);
		await page.keyboard.press('Shift+=');
		await expect(getItemsCount(page)).toHaveText('Items: 3');
		await expect(page.getByLabel('quantity')).toHaveCount(0);
	});

	test('Shift+= adds an extended item when advanced mode is on', async ({
		page,
	}) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await page.getByRole('button', { name: /new extended item/i }).waitFor();
		await page.keyboard.press('Shift+=');
		await expect(page.getByLabel('quantity')).toHaveCount(1);
	});

	test('= does not fire when save modal is open', async ({ page }) => {
		await goto(page);
		await enableShowWorking(page);
		await page.getByRole('button', { name: 'Save', exact: true }).click();
		await page.keyboard.press('=');
		await expect(getItemsCount(page)).toHaveText('Items: 2');
		await page.keyboard.press('Escape');
	});

	test('= does not fire when load modal is open', async ({ page }) => {
		await goto(page);
		await enableShowWorking(page);
		await page.getByRole('button', { name: 'Load', exact: true }).click();
		await page.keyboard.press('=');
		await expect(getItemsCount(page)).toHaveText('Items: 2');
		await page.keyboard.press('Escape');
	});

	test('= adds to current sub-level when navigated into a subtotal', async ({
		page,
	}) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await page.getByRole('button', { name: /new subtotal item/i }).click();
		await page.getByRole('button', { name: 'Untitled' }).first().click();
		await enableShowWorking(page);
		await expect(getItemsCount(page)).toHaveText('Items: 2');
		await page.keyboard.press('=');
		await expect(getItemsCount(page)).toHaveText('Items: 3');
	});
});
