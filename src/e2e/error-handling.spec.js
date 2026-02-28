import { test, expect } from '@playwright/test';
import { goto, enterValue, getField, getTotalField } from '../config/playwright/helpers/test-helpers.js';

test.describe('error handling', () => {
	test('invalid roman numeral puts line into error state', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'zz');
		const dInput = await getField(page, 'd', 0);
		await expect(dInput).toHaveValue('zz');
	});

	test('error line is excluded from grand total', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'iii'); // 3d valid
		await enterValue(page, 1, 'd', 'zz');  // invalid — excluded
		await expect(getTotalField(page, 'd')).toHaveText('iij');
	});

	test('fixing an error re-includes the line in the total', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'v');   // 5d
		await enterValue(page, 1, 'd', 'zz');  // invalid
		await enterValue(page, 1, 'd', 'iii'); // fix: 3d
		await expect(getTotalField(page, 'd')).toHaveText('viij');
	});

	test('empty field is not an error', async ({ page }) => {
		await goto(page);
		// All fields empty → total is zero, displayed as '—' (fmtZero formatting)
		await expect(getTotalField(page, 'd')).toHaveText('—');
	});
});
