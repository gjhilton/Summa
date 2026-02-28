import { test, expect } from '@playwright/test';
import { goto, enterValue } from '../config/playwright/helpers/test-helpers.js';

test.describe('show working', () => {
	test('show working toggle is present', async ({ page }) => {
		await goto(page);
		const toggle = page.getByRole('switch', { name: /show working/i });
		await expect(toggle).toBeVisible();
	});

	test('enabling show working reveals working annotations', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 's', 'v'); // 5s = 60d
		const toggle = page.getByRole('switch', { name: /show working/i });
		await toggle.click();
		// After enabling show working, the page should show calculation breakdowns
		// The working row shows pence values
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
});
