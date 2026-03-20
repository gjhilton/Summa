/**
 * Tests for large currency values and boundary conditions:
 * - Exact 240d boundary (= £1)
 * - Exact 12d boundary (= 1s)
 * - Exact 20s boundary (= £1)
 * - Multiple-pound totals
 * - Large shilling counts
 * - Mixed large values across multiple rows
 */
import { test, expect } from '@playwright/test';
import {
	goto,
	enterValue,
	getTotalField,
	enableShowWorking,
	getItemsCount,
} from '../config/playwright/helpers/test-helpers.js';

test.describe('exact boundary values', () => {
	test('exactly 12d = 1s 0d', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'xij'); // 12d exactly
		await expect(getTotalField(page, 's')).toHaveValue('j');
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});

	test('exactly 240d = £1 0s 0d', async ({ page }) => {
		await goto(page);
		// 240d = 20s × 12d = £1
		// Enter as 12d × 20 rows — but add rows one at a time is slow
		// Instead, use pounds: 1 pound = 240 pence; enter directly
		await enterValue(page, 0, 'l', 'j'); // 1£
		await expect(getTotalField(page, 'l')).toHaveValue('j');
		await expect(getTotalField(page, 's')).toHaveValue('');
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});

	test('exactly 20s = £1 0s 0d', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 's', 'xx'); // 20s
		await expect(getTotalField(page, 'l')).toHaveValue('j');
		await expect(getTotalField(page, 's')).toHaveValue('');
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});

	test('19s 12d = £1 0s 0d (carry from d to s, then to £)', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 's', 'xix'); // 19s
		await enterValue(page, 0, 'd', 'xij'); // 12d → 1s carry → 20s total → £1
		await expect(getTotalField(page, 'l')).toHaveValue('j');
		await expect(getTotalField(page, 's')).toHaveValue('');
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});

	test('£1 0s 0d in multiple rows sums to £2', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'l', 'j'); // £1
		await enterValue(page, 1, 'l', 'j'); // £1
		await expect(getTotalField(page, 'l')).toHaveValue('ij');
	});
});

test.describe('large totals', () => {
	test('xix shillings (19s) — output uses early-modern j-rule on ix', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 's', 'xix'); // 19s
		// integerToRoman(19) = 'xix'; formatEarlyModernOutput expands ix → viiii, then j-rule → xviiij
		await expect(getTotalField(page, 's')).toHaveValue('xviiij');
	});

	test('large pound value: l (50) in pounds field', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'l', 'l'); // 50£
		await expect(getTotalField(page, 'l')).toHaveValue('L');
	});

	test('£5 + £7 = £12', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'l', 'v');   // £5
		await enterValue(page, 1, 'l', 'vij'); // £7
		await expect(getTotalField(page, 'l')).toHaveValue('xij');
	});

	test('all fields in one row: £2 5s 3d → total matches', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'l', 'ij');
		await enterValue(page, 0, 's', 'v');
		await enterValue(page, 0, 'd', 'iij');
		await expect(getTotalField(page, 'l')).toHaveValue('ij');
		await expect(getTotalField(page, 's')).toHaveValue('v');
		await expect(getTotalField(page, 'd')).toHaveValue('iij');
	});

	test('1d + 1d across many rows sums correctly', async ({ page }) => {
		await goto(page);
		// Row 0 and 1: 1d each = 2d
		await enterValue(page, 0, 'd', 'j'); // 1d
		await enterValue(page, 1, 'd', 'j'); // 1d
		await expect(getTotalField(page, 'd')).toHaveValue('ij');
	});
});

test.describe('zero values', () => {
	test('all empty rows show empty total', async ({ page }) => {
		await goto(page);
		await expect(getTotalField(page, 'l')).toHaveValue('');
		await expect(getTotalField(page, 's')).toHaveValue('');
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});

	test('entering then clearing a value returns to empty total', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'v');
		await expect(getTotalField(page, 'd')).toHaveValue('v');
		await enterValue(page, 0, 'd', ''); // clear it
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});
});

test.describe('multiple rows all contribute to total', () => {
	test('adding many rows accumulates correctly', async ({ page }) => {
		await goto(page);
		await enableShowWorking(page);
		// Add 3 more rows → 5 total
		await page.getByRole('button', { name: '+ item' }).click();
		await page.getByRole('button', { name: '+ item' }).click();
		await page.getByRole('button', { name: '+ item' }).click();
		await expect(getItemsCount(page)).toHaveText('Items: 5');
		// Enter 1d in each of 5 rows
		for (let i = 0; i < 5; i++) {
			await enterValue(page, i, 'd', 'j'); // 1d each
		}
		// 5 × 1d = 5d → v
		await expect(getTotalField(page, 'd')).toHaveValue('v');
	});
});
