import { test, expect } from '@playwright/test';
import {
	goto,
	toggleAdvancedOptions,
	addExtendedItem,
	enableShowWorking,
	getItemsCount,
	getTotalField,
	getField,
	clickDuplicateRow,
	clickClearRow,
} from '../config/playwright/helpers/test-helpers.js';

test.describe('extended items', () => {
	test('adding an extended item increases item count', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await enableShowWorking(page);
		await expect(getItemsCount(page)).toHaveText('Items: 3');
	});

	test('extended item has an Item title input', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await expect(page.getByLabel('Item title').first()).toBeVisible();
	});

	test('extended item has a quantity input defaulting to j (=1)', async ({
		page,
	}) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await expect(page.getByLabel('quantity').first()).toHaveValue('j');
	});

	test('entering pence on extended item updates result display', async ({
		page,
	}) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		// Extended item is row index 2 (after 2 default lines)
		// Result display is index 3 (readonly); total row is last
		await getField(page, 'd', 2).fill('v'); // 5d unit cost, quantity=j (1)
		await expect(getField(page, 'd', 3)).toHaveValue('v');
	});

	test('quantity × unit cost = correct total pence in result', async ({
		page,
	}) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 'd', 2).fill('v'); // 5d per unit
		await page.getByLabel('quantity').first().fill('iij'); // 3 units
		// 5d × 3 = 15d = 1s 3d
		await expect(getField(page, 's', 3)).toHaveValue('j');
		await expect(getField(page, 'd', 3)).toHaveValue('iij');
	});

	test('extended item contributes its total to the grand total', async ({
		page,
	}) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 'd', 2).fill('v'); // 5d × 1 = 5d
		await expect(getTotalField(page, 'd')).toHaveValue('v');
	});

	test('extended item with invalid value is excluded from grand total', async ({
		page,
	}) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 'd', 2).fill('notvalid');
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});

	test('extended item with missing quantity is excluded from grand total', async ({
		page,
	}) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 'd', 2).fill('v');
		await page.getByLabel('quantity').first().fill(''); // clear quantity → error
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});

	test('show working displays pence breakdown for extended item', async ({
		page,
	}) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 'd', 2).fill('v'); // 5d × 1
		await enableShowWorking(page);
		await expect(page.getByText(/unit cost/i)).toBeVisible();
	});

	test('duplicate extended item copies title, quantity and values', async ({
		page,
	}) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await page.getByLabel('Item title').first().fill('My extended');
		await getField(page, 'd', 2).fill('v');
		await page.getByLabel('quantity').first().fill('iij');
		await clickDuplicateRow(page, 2);
		// After duplicate: 2 line items + 2 extended items.
		// Each extended item has an editable d (index 2,4) and result-display d (3,5); total row last.
		// Duplicate (row 3) → second "Item title", second "quantity", editable d at index 4.
		await expect(page.getByLabel('Item title').nth(1)).toHaveValue(
			'My extended'
		);
		await expect(page.getByLabel('quantity').nth(1)).toHaveValue('iij');
		await expect(getField(page, 'd', 4)).toHaveValue('v');
	});

	test('clear extended item resets fields but keeps row', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 'd', 2).fill('v');
		await page.getByLabel('Item title').first().fill('My extended');
		await clickClearRow(page, 2);
		await expect(page.getByLabel('Item title').first()).toHaveValue('');
		await expect(getField(page, 'd', 2)).toHaveValue('');
		await expect(page.getByLabel('quantity').first()).toHaveValue('j');
	});
});
