/**
 * Tests for early-modern Roman numeral input normalization and output formatting.
 * Input rules: j→i, u→v, normalize to lowercase.
 * Output rules: last-i-in-run→j, iv→iiij (anti-subtraction expansion), L/C/D/M uppercase.
 */
import { test, expect } from '@playwright/test';
import {
	goto,
	enterValue,
	getField,
	getTotalField,
} from '../config/playwright/helpers/test-helpers.js';

// ─── Input normalization ──────────────────────────────────────────────────────

test.describe('input normalization', () => {
	test("'j' input is treated as 1 (j→i)", async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'j'); // j normalizes to i = 1d
		await expect(getTotalField(page, 'd')).toHaveValue('j'); // output: 1 → j
	});

	test("'u' input is treated as 5 (u→v)", async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'u'); // u normalizes to v = 5d
		await expect(getTotalField(page, 'd')).toHaveValue('v');
	});

	test("'jj' input is treated as 2 (each j→i)", async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'jj'); // jj → ii = 2d
		await expect(getTotalField(page, 'd')).toHaveValue('ij'); // output: 2 → ij
	});

	test("'uj' input normalizes to 'vi' = 6d", async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'uj'); // u→v, j→i → vi = 6d
		await expect(getTotalField(page, 'd')).toHaveValue('vj'); // output: 6 → vj
	});

	test('multiple j inputs sum correctly via normalization', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'j'); // 1d
		await enterValue(page, 1, 'd', 'ij'); // 2d
		// 1 + 2 = 3d → iij
		await expect(getTotalField(page, 'd')).toHaveValue('iij');
	});
});

// ─── Output formatting (early-modern style) ───────────────────────────────────

test.describe('output formatting', () => {
	test('last i in run becomes j in output (1 → j)', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'i'); // 1d
		await expect(getTotalField(page, 'd')).toHaveValue('j');
	});

	test('2 → ij in output', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'ii'); // 2d
		await expect(getTotalField(page, 'd')).toHaveValue('ij');
	});

	test('3 → iij in output', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'iii'); // 3d
		await expect(getTotalField(page, 'd')).toHaveValue('iij');
	});

	test('4 → iiij in output (anti-subtraction: iv → iiij)', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'iv'); // iv normalizes, 4d → expands to iiij
		await expect(getTotalField(page, 'd')).toHaveValue('iiij');
	});

	test('entering iiij directly also gives iiij total', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'iiij'); // 4d directly
		await expect(getTotalField(page, 'd')).toHaveValue('iiij');
	});

	test('50 → L in output (uppercase)', async ({ page }) => {
		await goto(page);
		// Enter 50 in the pounds field (no carry from pounds, so output is just L)
		await enterValue(page, 0, 'l', 'l'); // lowercase l = 50
		await expect(getTotalField(page, 'l')).toHaveValue('L');
	});

	test('500 → D in output (uppercase)', async ({ page }) => {
		await goto(page);
		// Enter 500 in the pounds field
		await enterValue(page, 0, 'l', 'd'); // lowercase d = 500
		await expect(getTotalField(page, 'l')).toHaveValue('D');
	});
});

// ─── Currency carry ───────────────────────────────────────────────────────────

test.describe('currency carry', () => {
	test('12d → 1s 0d in total', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'vij'); // 7d
		await enterValue(page, 1, 'd', 'v');   // 5d → 12d = 1s
		await expect(getTotalField(page, 's')).toHaveValue('j');
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});

	test('24d → 2s 0d in total', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'xij'); // 12d
		await enterValue(page, 1, 'd', 'xij'); // 12d → 24d = 2s
		await expect(getTotalField(page, 's')).toHaveValue('ij');
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});

	test('20s → 1£ 0s in total', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 's', 'x'); // 10s
		await enterValue(page, 1, 's', 'x'); // 10s → 20s = 1£
		await expect(getTotalField(page, 'l')).toHaveValue('j');
		await expect(getTotalField(page, 's')).toHaveValue('');
	});

	test('11d + 11d = 22d = 1s 10d in total', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'xj');  // 11d
		await enterValue(page, 1, 'd', 'xj');  // 11d → 22d = 1s 10d
		await expect(getTotalField(page, 's')).toHaveValue('j');
		await expect(getTotalField(page, 'd')).toHaveValue('x');
	});

	test('l/s/d all fields in same row sum to correct total', async ({ page }) => {
		await goto(page);
		// 1£ 2s 3d in row 0; 0 in row 1 → total 1£ 2s 3d
		await enterValue(page, 0, 'l', 'j');
		await enterValue(page, 0, 's', 'ij');
		await enterValue(page, 0, 'd', 'iij');
		await expect(getTotalField(page, 'l')).toHaveValue('j');
		await expect(getTotalField(page, 's')).toHaveValue('ij');
		await expect(getTotalField(page, 'd')).toHaveValue('iij');
	});

	test('mixed l/s/d across rows carry correctly', async ({ page }) => {
		await goto(page);
		// Row 0: 0£ 19s 11d; Row 1: 0£ 0s 1d → total: 1£ 0s 0d
		await enterValue(page, 0, 's', 'xix'); // 19s
		await enterValue(page, 0, 'd', 'xj');  // 11d
		await enterValue(page, 1, 'd', 'j');   // 1d → 12d carry = 1s
		// 19s + 1s (carry) = 20s = 1£, 0s, 0d
		await expect(getTotalField(page, 'l')).toHaveValue('j');
		await expect(getTotalField(page, 's')).toHaveValue('');
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});
});
