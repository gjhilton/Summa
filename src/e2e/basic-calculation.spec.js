import { test, expect } from '@playwright/test';
import { goto, enterValue, getTotalField } from '../config/playwright/helpers/test-helpers.js';

test.describe('basic calculation', () => {
	test('page loads and shows the Summa logo', async ({ page }) => {
		await goto(page);
		const logo = page.getByRole('img', { name: 'Summa', exact: true });
		await expect(logo).toBeVisible();
	});

	test('entering pence in one field updates the total', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'v');
		await expect(getTotalField(page, 'd')).toHaveText('v');
	});

	test('two lines sum correctly', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'iii');
		await enterValue(page, 1, 'd', 'v');
		await expect(getTotalField(page, 'd')).toHaveText('viij');
	});

	test('shillings carry to pounds correctly', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 's', 'x');
		await enterValue(page, 1, 's', 'x');
		// 10s + 10s = 20s = £1
		await expect(getTotalField(page, 'l')).toHaveText('j');
	});

	test('entering shillings shows correct total', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 's', 'v');
		await enterValue(page, 1, 's', 'vij');
		// 5s + 7s = 12s
		await expect(getTotalField(page, 's')).toHaveText('xij');
	});
});
