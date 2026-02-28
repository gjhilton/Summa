import { test, expect } from '@playwright/test';
import { goto, enterValue } from '../config/playwright/helpers/test-helpers.js';

test.describe('basic calculation', () => {
	test('page loads and shows the Summa logo', async ({ page }) => {
		await goto(page);
		const logo = page.getByRole('img', { name: /summa/i });
		await expect(logo).toBeVisible();
	});

	test('entering pence in one field updates the total', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'v');
		// Total should reflect 5 pence
		const dTotal = page.getByLabel('d').last();
		await expect(dTotal).toHaveValue('v');
	});

	test('two lines sum correctly', async ({ page }) => {
		await goto(page);
		// Enter iii (3d) in line 0 and v (5d) in line 1
		await enterValue(page, 0, 'd', 'iii');
		await enterValue(page, 1, 'd', 'v');
		// Grand total should show viii = 8d
		// The total row fields are readonly (no onChange)
		const totalFields = page.getByLabel('d');
		const lastField = totalFields.last();
		await expect(lastField).toHaveValue('viij');
	});

	test('shillings carry to pounds correctly', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 's', 'x');
		await enterValue(page, 1, 's', 'x');
		// 10s + 10s = 20s = 1£
		const lTotal = page.getByLabel('l').last();
		await expect(lTotal).toHaveValue('j');
	});

	test('entering shillings shows correct total', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 's', 'v');
		await enterValue(page, 1, 's', 'vij');
		// 5s + 7s = 12s
		const sTotal = page.getByLabel('s').last();
		await expect(sTotal).toHaveValue('xij');
	});
});
