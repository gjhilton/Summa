import { test, expect } from '@playwright/test';
import {
	goto,
	enterValue,
	enableShowWorking,
	getItemsCount,
	toggleAdvancedOptions,
	addExtendedItem,
	getField,
} from '../config/playwright/helpers/test-helpers.js';

test.describe('show working', () => {
	test('explain calculations toggle is present', async ({ page }) => {
		await goto(page);
		const toggle = page.getByRole('switch', { name: /explain calculations/i });
		await expect(toggle).toBeVisible();
	});

	test('enabling show working reveals working annotations', async ({
		page,
	}) => {
		await goto(page);
		await enterValue(page, 0, 's', 'v'); // 5s = 60d
		await enableShowWorking(page);
		await expect(page.getByText(/60/).first()).toBeVisible();
	});

	test('disabling show working hides working annotations', async ({
		page,
	}) => {
		await goto(page);
		await enterValue(page, 0, 's', 'v');
		const toggle = page.getByRole('switch', { name: /explain calculations/i });
		await toggle.click(); // enable
		await toggle.click(); // disable
		await expect(page.getByText('60')).not.toBeVisible();
	});

	test('item count shown in total row when show working enabled', async ({
		page,
	}) => {
		await goto(page);
		await enableShowWorking(page);
		await expect(getItemsCount(page)).toBeVisible();
	});

	test('item count hidden when show working disabled', async ({ page }) => {
		await goto(page);
		await expect(page.getByText(/^Items: \d+$/)).not.toBeVisible();
	});

	test('item count reflects current line count', async ({ page }) => {
		await goto(page);
		await enableShowWorking(page);
		await page.getByRole('button', { name: '+ item' }).click();
		await page.getByRole('button', { name: '+ item' }).click();
		await expect(getItemsCount(page)).toHaveText('Items: 4');
	});

	test('total row shows pence explanation when show working enabled', async ({
		page,
	}) => {
		await goto(page);
		await enterValue(page, 0, 's', 'v'); // 5s = 60d → total explanation row
		await enableShowWorking(page);
		// The total row explanation shows the pence breakdown (60d = ...)
		// It appears in an ExplanationRow inside ItemTotal, after the line explanation
		await expect(page.getByText(/60/).nth(1)).toBeVisible();
	});
});

// ─── Error explanation rows ───────────────────────────────────────────────────

test.describe('error explanation rows', () => {
	test('show working reveals "only Roman numerals allowed" for invalid line field', async ({
		page,
	}) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'zz');
		await enableShowWorking(page);
		await expect(page.getByText(/only Roman numerals allowed/i)).toBeVisible();
	});

	test('error explanation names the specific field that has an error', async ({
		page,
	}) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'zz'); // d field invalid
		await enableShowWorking(page);
		await expect(page.getByText(/d field/i)).toBeVisible();
	});

	test('error explanation not shown when show working is off', async ({
		page,
	}) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'zz');
		// show working is off (goto() disables it)
		await expect(page.getByText(/only Roman numerals allowed/i)).not.toBeVisible();
	});

	test('extended item: show working reveals "quantity is required" when quantity cleared', async ({
		page,
	}) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 'd', 2).fill('v');
		await page.getByLabel('quantity').first().fill(''); // clear → quantityMissing
		await enableShowWorking(page);
		await expect(page.getByText(/quantity is required/i)).toBeVisible();
	});

	test('extended item: show working reveals "only Roman numerals allowed" for invalid unit price', async ({
		page,
	}) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 'd', 2).fill('notvalid');
		await enableShowWorking(page);
		await expect(page.getByText(/only Roman numerals allowed/i)).toBeVisible();
	});
});
