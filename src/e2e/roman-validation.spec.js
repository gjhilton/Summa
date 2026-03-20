/**
 * Tests for Roman numeral validation edge cases:
 * - Legal additive forms (iiii, etc.)
 * - Legal subtractive forms (iv, ix, xl, xc, cd, cm)
 * - Illegal doubled singletons (vv, ll, dd)
 * - Illegal subtractive pairs (il, ic, id, im, vl, vc, vd, vm, etc.)
 * - Uppercase/mixed-case normalisation
 */
import { test, expect } from '@playwright/test';
import {
	goto,
	enterValue,
	getField,
	getTotalField,
} from '../config/playwright/helpers/test-helpers.js';

// ─── Valid Roman numeral inputs ───────────────────────────────────────────────

test.describe('valid Roman numeral inputs accepted', () => {
	test('single i is valid (1d)', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'i');
		await expect(getTotalField(page, 'd')).toHaveValue('j'); // 1 → j
	});

	test('single v is valid (5d)', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'v');
		await expect(getTotalField(page, 'd')).toHaveValue('v');
	});

	test('single x is valid (10d)', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'x');
		await expect(getTotalField(page, 'd')).toHaveValue('x');
	});

	test('iiii is valid additive form of 4', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'iiii');
		await expect(getTotalField(page, 'd')).toHaveValue('iiij'); // 4 → iiij
	});

	test('xl is valid subtractive form of 40', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'l', 'xl'); // 40£
		await expect(getTotalField(page, 'l')).toHaveValue('xl');
	});

	test('xc is valid subtractive form of 90', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'l', 'xc'); // 90£
		await expect(getTotalField(page, 'l')).toHaveValue('xc');
	});

	test('cd is valid subtractive form of 400', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'l', 'cd'); // 400£
		await expect(getTotalField(page, 'l')).toHaveValue('CD');
	});

	test('cm is valid subtractive form of 900', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'l', 'cm'); // 900£
		await expect(getTotalField(page, 'l')).toHaveValue('CM');
	});

	test('m is valid (1000 in pounds)', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'l', 'm');
		await expect(getTotalField(page, 'l')).toHaveValue('M');
	});

	test('c is valid (100 in pounds)', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'l', 'c');
		await expect(getTotalField(page, 'l')).toHaveValue('C');
	});

	test('uppercase input is accepted (normalised to lowercase)', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'V'); // uppercase V = 5
		await expect(getTotalField(page, 'd')).toHaveValue('v');
	});

	test('mixed case input is accepted', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'Vij'); // 7d
		await expect(getTotalField(page, 'd')).toHaveValue('vij');
	});
});

// ─── Invalid inputs: doubled singletons ──────────────────────────────────────

test.describe('doubled singleton characters are invalid', () => {
	test('vv in d field is an error', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'vv');
		// Error line excluded from total → total is 0 → ''
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});

	test('ll in l field is an error', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'l', 'll');
		await expect(getTotalField(page, 'l')).toHaveValue('');
	});

	test('dd in l field is an error', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'l', 'dd');
		await expect(getTotalField(page, 'l')).toHaveValue('');
	});

	test('vvi (vv prefix) is invalid', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'vvi');
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});
});

// ─── Invalid inputs: illegal subtractive pairs ───────────────────────────────

test.describe('illegal subtractive pairs are invalid', () => {
	test('il is not a valid subtractive pair', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'il');
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});

	test('ic is not a valid subtractive pair', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'ic');
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});

	test('id is not a valid subtractive pair', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'id');
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});

	test('im is not a valid subtractive pair', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'l', 'im');
		await expect(getTotalField(page, 'l')).toHaveValue('');
	});

	test('vl is not a valid subtractive pair', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'l', 'vl');
		await expect(getTotalField(page, 'l')).toHaveValue('');
	});

	test('vc is not a valid subtractive pair', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'l', 'vc');
		await expect(getTotalField(page, 'l')).toHaveValue('');
	});

	test('xd is not a valid subtractive pair', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'l', 'xd');
		await expect(getTotalField(page, 'l')).toHaveValue('');
	});

	test('lm is not a valid subtractive pair', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'l', 'lm');
		await expect(getTotalField(page, 'l')).toHaveValue('');
	});
});

// ─── Invalid: non-Roman characters ───────────────────────────────────────────

test.describe('non-Roman characters are invalid', () => {
	test('digits are invalid', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', '5');
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});

	test('letters outside Roman set are invalid', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'z');
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});

	test('mixed valid and non-Roman characters are invalid', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'v5');
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});
});

// ─── Output formatting: conditional uppercase ─────────────────────────────────

test.describe('conditional uppercase in output', () => {
	test('100 → C in output (uppercase)', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'l', 'c');
		await expect(getTotalField(page, 'l')).toHaveValue('C');
	});

	test('1000 → M in output (uppercase)', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'l', 'm');
		await expect(getTotalField(page, 'l')).toHaveValue('M');
	});

	test('ccvij pounds → CCCvij in output (uppercase before first small numeral)', async ({ page }) => {
		await goto(page);
		// 200 + 5 + 1 + 1 = 207 in pounds → no carry from pounds, output is CCCvij
		// (integerToRoman(207) = 'ccvii'; formatEarlyModernOutput: no ix/iv to expand;
		// j-rule: last i in run → j; uppercase: CC before small numeral)
		await enterValue(page, 0, 'l', 'ccvij'); // 207£ — no carry since pounds don't carry
		await expect(getTotalField(page, 'l')).toHaveValue('CCvij');
	});

	test('xcvij pounds → xcvij in output (x is small so no uppercase)', async ({ page }) => {
		await goto(page);
		// 90 + 5 + 1 + 1 = 97 in pounds → no carry; output xcvij
		// x is a small numeral so seenSmall=true immediately, c stays lowercase
		await enterValue(page, 0, 'l', 'xcvij'); // 97£
		await expect(getTotalField(page, 'l')).toHaveValue('xcvij');
	});

	test('5 → v (no uppercase, v is a small numeral)', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'v');
		await expect(getTotalField(page, 'd')).toHaveValue('v');
	});

	test('6 → vj (v small, i→j but no uppercase)', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'vi');
		await expect(getTotalField(page, 'd')).toHaveValue('vj');
	});
});

// ─── Error in all three fields ────────────────────────────────────────────────

test.describe('errors in multiple fields of same row', () => {
	test('error in l field only excludes the row from total', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'l', 'vv'); // invalid
		await enterValue(page, 1, 'd', 'v');  // 5d valid
		await expect(getTotalField(page, 'd')).toHaveValue('v');
		await expect(getTotalField(page, 'l')).toHaveValue('');
	});

	test('error in s field only excludes the row from total', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 's', 'll'); // invalid
		await enterValue(page, 1, 'd', 'v');  // 5d valid
		await expect(getTotalField(page, 'd')).toHaveValue('v');
	});

	test('errors in all three fields of same row: row excluded, other row valid', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'l', 'zz'); // invalid
		await enterValue(page, 0, 's', 'zz'); // invalid
		await enterValue(page, 0, 'd', 'zz'); // invalid
		await enterValue(page, 1, 'd', 'v');  // 5d valid on row 1
		// Row 0 has errors in all fields, excluded; row 1 contributes 5d
		await expect(getTotalField(page, 'd')).toHaveValue('v');
	});
});
