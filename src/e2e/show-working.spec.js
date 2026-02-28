import { test, expect } from '@playwright/test';
import { goto, enterValue, enableShowWorking, getItemsCount } from '../config/playwright/helpers/test-helpers.js';

test.describe('show working', () => {
	test('show working toggle is present', async ({ page }) => {
		await goto(page);
		const toggle = page.getByRole('switch', { name: /show working/i });
		await expect(toggle).toBeVisible();
	});

	test('enabling show working reveals working annotations', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 's', 'v'); // 5s = 60d
		await enableShowWorking(page);
		await expect(page.getByText(/60/)).toBeVisible();
	});

	test('disabling show working hides working annotations', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 's', 'v');
		const toggle = page.getByRole('switch', { name: /show working/i });
		await toggle.click(); // enable
		await toggle.click(); // disable
		await expect(page.getByText('60')).not.toBeVisible();
	});

	test('item count shown in total row when show working enabled', async ({ page }) => {
		await goto(page);
		await enableShowWorking(page);
		await expect(getItemsCount(page)).toBeVisible();
	});

	test('item count hidden when show working disabled', async ({ page }) => {
		await goto(page);
		await expect(page.getByText(/^Items: \d+$/)).not.toBeVisible();
	});

	test('item count reflects current line count', async ({ page }) => {
		await goto(page);
		await enableShowWorking(page);
		await page.getByRole('button', { name: /new line item/i }).click();
		await page.getByRole('button', { name: /new line item/i }).click();
		await expect(getItemsCount(page)).toHaveText('Items: 4');
	});
});
