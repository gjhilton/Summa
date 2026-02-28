import { test, expect } from '@playwright/test';
import {
	goto,
	enableShowWorking,
	getItemsCount,
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
		await page.getByRole('button', { name: /new line item/i }).click();
		await expect(getItemsCount(page)).toHaveText('Items: 3');
	});

	test('remove buttons are hidden when only 2 lines remain', async ({
		page,
	}) => {
		await goto(page);
		const removeButtons = page.getByRole('button', {
			name: /remove line/i,
		});
		await expect(removeButtons.first()).toBeHidden();
	});

	test('remove button appears when more than 2 lines', async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: /new line item/i }).click();
		const removeButtons = page.getByRole('button', {
			name: /remove line/i,
		});
		await expect(removeButtons.first()).toBeVisible();
	});

	test('removing a line updates the count', async ({ page }) => {
		await goto(page);
		await enableShowWorking(page);
		await page.getByRole('button', { name: /new line item/i }).click();
		await expect(getItemsCount(page)).toHaveText('Items: 3');
		const removeButton = page
			.getByRole('button', { name: /remove line/i })
			.first();
		await removeButton.click();
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
