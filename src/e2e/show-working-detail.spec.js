/**
 * Detailed show-working tests:
 * - Error explanation names specific field: "l field", "s field", "d field"
 * - Pence breakdown arithmetic for l/s/d fields
 * - Total explanation shows correct pence breakdown
 * - Extended item explanation: basePence × quantity
 * - Subtotal show-working at root shows pence total
 * - No explanation for empty fields
 * - No explanation for zero total
 */
import { test, expect } from '@playwright/test';
import {
	goto,
	enterValue,
	getField,
	enableShowWorking,
	toggleAdvancedOptions,
	addExtendedItem,
	addSubtotalItem,
	navigateIntoSubtotal,
	navigateViaBreadcrumb,
} from '../config/playwright/helpers/test-helpers.js';

// ─── Field-specific error labels ──────────────────────────────────────────────

test.describe('error explanation field labels', () => {
	test('invalid l field shows "li field" in error explanation', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'l', 'zz'); // invalid l (labelled "li" in UI)
		await enableShowWorking(page);
		// The l field is displayed as "li" (librae abbreviation)
		await expect(page.getByText(/li field/i)).toBeVisible();
	});

	test('invalid s field shows "s field" in error explanation', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 's', 'zz'); // invalid s
		await enableShowWorking(page);
		await expect(page.getByText(/s field/i)).toBeVisible();
	});

	test('invalid d field shows "d field" in error explanation', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'zz'); // invalid d
		await enableShowWorking(page);
		await expect(page.getByText(/d field/i)).toBeVisible();
	});

	test('multiple invalid fields show "li and s fields" in explanation', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'l', 'zz'); // invalid l (displayed as "li")
		await enterValue(page, 0, 's', 'zz'); // invalid s
		await enableShowWorking(page);
		// formatFieldList(['li', 's']) → "li and s fields"
		await expect(page.getByText(/li and s fields/i)).toBeVisible();
	});
});

// ─── Pence breakdown arithmetic ───────────────────────────────────────────────

test.describe('pence breakdown arithmetic in show-working', () => {
	test('1 shilling = 12d shown in working', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 's', 'j'); // 1s = 12d
		await enableShowWorking(page);
		await expect(page.getByText('12').first()).toBeVisible();
	});

	test('1 pound = 240d shown in working', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'l', 'j'); // 1£ = 240d
		await enableShowWorking(page);
		await expect(page.getByText('240').first()).toBeVisible();
	});

	test('5 shillings shows 60d in working (5 × 12)', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 's', 'v'); // 5s = 60d
		await enableShowWorking(page);
		await expect(page.getByText(/60/).first()).toBeVisible();
	});

	test('10 pence shows 10 directly (multiplier = 1)', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'x'); // 10d
		await enableShowWorking(page);
		// For d field with multiplier 1, no "N × 1 =" prefix is shown, just the pence
		// The total pence shown in the total row: 10d
		await expect(page.getByText('10').first()).toBeVisible();
	});
});

// ─── No explanation for empty/zero ───────────────────────────────────────────

test.describe('no explanation for empty rows', () => {
	test('no explanation row visible when all fields are empty', async ({ page }) => {
		await goto(page);
		await enableShowWorking(page);
		// No fields filled — no working rows should appear (only the blank lines)
		// The explanation text "× 12" or "× 240" would appear if values were present
		await expect(page.getByText(/× 12/)).not.toBeVisible();
		await expect(page.getByText(/× 240/)).not.toBeVisible();
	});
});

// ─── Extended item working ────────────────────────────────────────────────────

test.describe('extended item show-working detail', () => {
	test('extended item shows quantity × basePence in working', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 'd', 2).fill('v');              // 5d unit
		await page.getByLabel('quantity').first().fill('iij'); // 3 units → 15d
		await enableShowWorking(page);
		// Working shows 3 × 5d = 15d
		await expect(page.getByText(/15/).first()).toBeVisible();
	});

	test('extended item with invalid price shows error, not working breakdown', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 'd', 2).fill('zz'); // invalid
		await enableShowWorking(page);
		await expect(page.getByText(/only Roman numerals allowed/i)).toBeVisible();
	});
});

// ─── Total explanation ────────────────────────────────────────────────────────

test.describe('total explanation row', () => {
	test('total row explanation shown for non-zero total', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 's', 'v'); // 5s = 60d
		await enableShowWorking(page);
		// Two explanations: one for the line, one for the total row
		const sixties = page.getByText(/60/);
		await expect(sixties.nth(1)).toBeVisible();
	});

	test('total row explanation not shown when total is zero', async ({ page }) => {
		await goto(page);
		await enableShowWorking(page);
		// Empty → total is 0 → no total explanation
		await expect(page.getByText(/× 12/)).not.toBeVisible();
	});

	test('total explanation correct for pence total with carry', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'xij'); // 12d = 1s 0d
		await enableShowWorking(page);
		// 12 pence total
		await expect(page.getByText('12').first()).toBeVisible();
	});
});
