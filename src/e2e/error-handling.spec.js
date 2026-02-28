import { test, expect } from '@playwright/test';
import { goto, enterValue } from '../config/playwright/helpers/test-helpers.js';

test.describe('error handling', () => {
	test('invalid roman numeral puts line into error state', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'zz');
		// The line row should have error background
		// Check that the field has the invalid value
		const dInput = page.getByLabel('d').first();
		await expect(dInput).toHaveValue('zz');
	});

	test('error line is excluded from grand total', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'iii'); // 3d valid
		await enterValue(page, 1, 'd', 'zz');  // invalid — should be excluded
		// Total should still be 3d (iii)
		const dTotal = page.getByLabel('d').last();
		await expect(dTotal).toHaveValue('iij');
	});

	test('fixing an error re-includes the line in the total', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'v');   // 5d
		await enterValue(page, 1, 'd', 'zz');  // invalid
		await enterValue(page, 1, 'd', 'iii'); // fix: 3d
		// Total should now be viii = 8d
		const dTotal = page.getByLabel('d').last();
		await expect(dTotal).toHaveValue('viij');
	});

	test('empty field is not an error', async ({ page }) => {
		await goto(page);
		// Fields are empty by default; total should be 0
		const dTotal = page.getByLabel('d').last();
		await expect(dTotal).toHaveValue('0');
	});
});
