/**
 * Tests for preferences persistence:
 * - show-working (showExplanation) state after reload
 * - advanced mode state after help screen visit and back
 * - showExplanation defaults to false after goto()
 * - Line title and values persist after reload (detailed)
 */
import { test, expect } from '@playwright/test';
import {
	goto,
	enterValue,
	getField,
	getTotalField,
	toggleAdvancedOptions,
	enableShowWorking,
	getItemsCount,
	addSubtotalItem,
	navigateIntoSubtotal,
	navigateViaBreadcrumb,
} from '../config/playwright/helpers/test-helpers.js';

// ─── showExplanation default ──────────────────────────────────────────────────

test.describe('showExplanation defaults', () => {
	test('goto() leaves show-working OFF (aria-checked false)', async ({ page }) => {
		await goto(page);
		const toggle = page.getByRole('switch', { name: /explain calculations/i });
		await expect(toggle).toHaveAttribute('aria-checked', 'false');
	});

	test('show-working state is NOT persisted in localStorage', async ({ page }) => {
		// showExplanation is React state only — not persisted.
		// After reload, it always starts false.
		await goto(page);
		await enableShowWorking(page); // turn on
		await expect(
			page.getByRole('switch', { name: /explain calculations/i })
		).toHaveAttribute('aria-checked', 'true');
		await page.reload();
		// After reload, goto() disables it; but let's check raw post-reload state
		// without calling goto() again — reload keeps summa_welcomed but
		// showExplanation is React state and resets to false on mount
		await expect(
			page.getByRole('switch', { name: /explain calculations/i })
		).toHaveAttribute('aria-checked', 'false');
	});
});

// ─── advanced mode NOT persisted ─────────────────────────────────────────────

test.describe('advanced mode is not persisted across reloads', () => {
	test('after enabling advanced mode and reloading, it defaults to off', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await expect(
			page.getByRole('switch', { name: /advanced mode/i })
		).toHaveAttribute('aria-checked', 'true');
		await page.reload();
		// Advanced mode resets to false on fresh mount (no persistence)
		await expect(
			page.getByRole('switch', { name: /advanced mode/i })
		).toHaveAttribute('aria-checked', 'false');
	});
});

// ─── Line title persistence ───────────────────────────────────────────────────

test.describe('line title persistence across reloads', () => {
	test('line title persists after reload', async ({ page }) => {
		await goto(page);
		await page.getByLabel('Line title').first().fill('Wages');
		await page.getByLabel('Line title').first().press('Tab');
		await page.reload();
		// The reload doesn't call goto(), so the stored data is used
		await expect(page.getByLabel('Line title').first()).toHaveValue('Wages');
	});

	test('line title and value both persist together after reload', async ({ page }) => {
		await goto(page);
		await page.getByLabel('Line title').first().fill('Rent');
		await enterValue(page, 0, 's', 'v'); // 5s
		await page.reload();
		await expect(page.getByLabel('Line title').first()).toHaveValue('Rent');
		await expect(getField(page, 's', 0)).toHaveValue('v');
	});

	test('multiple line titles persist after reload', async ({ page }) => {
		await goto(page);
		await page.getByLabel('Line title').first().fill('Item one');
		await page.getByLabel('Line title').nth(1).fill('Item two');
		await page.getByLabel('Line title').nth(1).press('Tab');
		await page.reload();
		await expect(page.getByLabel('Line title').first()).toHaveValue('Item one');
		await expect(page.getByLabel('Line title').nth(1)).toHaveValue('Item two');
	});
});

// ─── Calculation state persistence ───────────────────────────────────────────

test.describe('full calculation state persistence', () => {
	test('values in all three fields persist after reload', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'l', 'ij');
		await enterValue(page, 0, 's', 'v');
		await enterValue(page, 0, 'd', 'iij');
		await page.reload();
		await expect(getField(page, 'l', 0)).toHaveValue('ij');
		await expect(getField(page, 's', 0)).toHaveValue('v');
		await expect(getField(page, 'd', 0)).toHaveValue('iij');
	});

	test('subtotal items persist after reload', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'v'); // 5d inside subtotal
		await navigateViaBreadcrumb(page, 'Summa totalis');
		await page.reload();
		// Advanced mode doesn't persist, but the data does
		// After reload: the subtotal's 5d should still be in the total
		await expect(getTotalField(page, 'd')).toHaveValue('v');
	});

	test('error state persists after reload (error line excluded from total)', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'v');   // 5d valid
		await enterValue(page, 1, 'd', 'zz');  // invalid
		await expect(getTotalField(page, 'd')).toHaveValue('v');
		await page.reload();
		// After reload: the invalid value is still invalid, so total is still 5d
		await expect(getTotalField(page, 'd')).toHaveValue('v');
	});
});

// ─── Row count persistence ────────────────────────────────────────────────────

test.describe('row count persists after reload', () => {
	test('added rows persist after reload', async ({ page }) => {
		await goto(page);
		await enableShowWorking(page);
		await page.getByRole('button', { name: '+ item' }).click();
		await page.getByRole('button', { name: '+ item' }).click();
		await expect(getItemsCount(page)).toHaveText('Items: 4');
		await page.reload();
		await enableShowWorking(page);
		await expect(getItemsCount(page)).toHaveText('Items: 4');
	});
});
