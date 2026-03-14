import { test, expect } from '@playwright/test';
import {
	goto,
	enableShowWorking,
	getItemsCount,
	revealRowActions,
	clickDeleteRow,
} from '../config/playwright/helpers/test-helpers.js';

test.describe('line management', () => {
	test('starts with 2 line items', async ({ page }) => {
		await goto(page);
		await enableShowWorking(page);
		await expect(getItemsCount(page)).toHaveText('Items: 2');
	});

	test('can add a new line item', async ({ page }) => {
		await goto(page);
		await enableShowWorking(page);
		await page.getByRole('button', { name: '+ item' }).click();
		await expect(getItemsCount(page)).toHaveText('Items: 3');
	});

	test('delete button is revealed on hover', async ({ page }) => {
		await goto(page);
		await revealRowActions(page, 0);
		await expect(
			page.getByRole('button', { name: 'Delete row' }).first()
		).toBeVisible();
	});

	test('deleting a line updates the count', async ({ page }) => {
		await goto(page);
		await enableShowWorking(page);
		await page.getByRole('button', { name: '+ item' }).click();
		await expect(getItemsCount(page)).toHaveText('Items: 3');
		await clickDeleteRow(page, 0);
		await expect(getItemsCount(page)).toHaveText('Items: 2');
	});

	test('item count is hidden when show working is off', async ({ page }) => {
		await goto(page);
		await expect(page.getByText(/^Items: \d+$/)).not.toBeVisible();
	});

	test('item count appears when show working is enabled', async ({
		page,
	}) => {
		await goto(page);
		await enableShowWorking(page);
		await expect(getItemsCount(page)).toBeVisible();
	});
});
