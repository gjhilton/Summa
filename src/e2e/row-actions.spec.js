import { test, expect } from '@playwright/test';
import {
	goto,
	enterValue,
	enableShowWorking,
	getItemsCount,
	revealRowActions,
	clickDeleteRow,
	clickDuplicateRow,
	clickClearRow,
	clickUndo,
} from '../config/playwright/helpers/test-helpers.js';

test.describe('row actions', () => {
	test('action buttons hidden by default — only "Open actions" visible, not "Close actions"', async ({ page }) => {
		await goto(page);
		await expect(
			page.getByRole('button', { name: 'Open actions' }).first()
		).toBeVisible();
		await expect(
			page.getByRole('button', { name: 'Close actions' })
		).toHaveCount(0);
	});

	test('reveal button (‹) is visible with label "Open actions"', async ({ page }) => {
		await goto(page);
		await expect(
			page.getByRole('button', { name: 'Open actions' }).first()
		).toBeVisible();
	});

	test('delete: confirm dialog appears', async ({ page }) => {
		await goto(page);
		await revealRowActions(page, 0);
		let dialogMessage = '';
		page.once('dialog', async dialog => {
			dialogMessage = dialog.message();
			await dialog.dismiss();
		});
		await page.getByRole('button', { name: 'Delete row' }).first().click({ force: true });
		expect(dialogMessage).toBe('Delete this row?');
	});

	test('delete: confirm removes the row', async ({ page }) => {
		await goto(page);
		await enableShowWorking(page);
		// Add a third row first
		await page.getByRole('button', { name: '+ item' }).click();
		await expect(getItemsCount(page)).toHaveText('Items: 3');
		await clickDeleteRow(page, 0);
		await expect(getItemsCount(page)).toHaveText('Items: 2');
	});

	test('delete: dismiss keeps the row', async ({ page }) => {
		await goto(page);
		await enableShowWorking(page);
		await revealRowActions(page, 0);
		page.once('dialog', async dialog => dialog.dismiss());
		await page.getByRole('button', { name: 'Delete row' }).first().click({ force: true });
		await expect(getItemsCount(page)).toHaveText('Items: 2');
	});

	test('duplicate: row appears below original', async ({ page }) => {
		await goto(page);
		await enableShowWorking(page);
		await clickDuplicateRow(page, 0);
		await expect(getItemsCount(page)).toHaveText('Items: 3');
	});

	test('duplicate: values copied to new row', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'v');
		await clickDuplicateRow(page, 0);
		const dInput = await page.getByLabel('d', { exact: true }).nth(1);
		await expect(dInput).toHaveValue('v');
	});

	test('duplicate: title copied to new row', async ({ page }) => {
		await goto(page);
		await page.getByLabel('Line title').first().fill('My item');
		await clickDuplicateRow(page, 0);
		await expect(page.getByLabel('Line title').nth(1)).toHaveValue('My item');
	});

	test('clear item: confirm dialog appears', async ({ page }) => {
		await goto(page);
		await revealRowActions(page, 0);
		let dialogMessage = '';
		page.once('dialog', async dialog => {
			dialogMessage = dialog.message();
			await dialog.dismiss();
		});
		await page.getByRole('button', { name: 'Clear item' }).first().click({ force: true });
		expect(dialogMessage).toBe('Clear this item?');
	});

	test('clear item: confirm clears values, row stays', async ({ page }) => {
		await goto(page);
		await enableShowWorking(page);
		await enterValue(page, 0, 'd', 'v');
		await clickClearRow(page, 0);
		// Row count unchanged
		await expect(getItemsCount(page)).toHaveText('Items: 2');
		// Value cleared
		const dInput = await page.getByLabel('d', { exact: true }).first();
		await expect(dInput).toHaveValue('');
	});

	test('clear item: dismiss keeps values', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'v');
		await revealRowActions(page, 0);
		page.once('dialog', async dialog => dialog.dismiss());
		await page.getByRole('button', { name: 'Clear item' }).first().click({ force: true });
		const dInput = await page.getByLabel('d', { exact: true }).first();
		await expect(dInput).toHaveValue('v');
	});

	test('after duplicate, undo removes the duplicate', async ({ page }) => {
		await goto(page);
		await enableShowWorking(page);
		await clickDuplicateRow(page, 0);
		await expect(getItemsCount(page)).toHaveText('Items: 3');
		await clickUndo(page);
		await expect(getItemsCount(page)).toHaveText('Items: 2');
	});

	test('after delete, undo restores the row', async ({ page }) => {
		await goto(page);
		await enableShowWorking(page);
		await page.getByRole('button', { name: '+ item' }).click();
		await clickDeleteRow(page, 0);
		await expect(getItemsCount(page)).toHaveText('Items: 2');
		await clickUndo(page);
		await expect(getItemsCount(page)).toHaveText('Items: 3');
	});

	test('after clear item, undo restores the values', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'v');
		await clickClearRow(page, 0);
		const dInput = await page.getByLabel('d', { exact: true }).first();
		await expect(dInput).toHaveValue('');
		await clickUndo(page);
		await expect(dInput).toHaveValue('v');
	});
});

test.describe('action strip reveal button', () => {
	test('no action strip is open on page load', async ({ page }) => {
		await goto(page);
		// Every row shows "Open actions" (closed); none show "Close actions" (open)
		await expect(page.getByRole('button', { name: 'Close actions' })).toHaveCount(0);
		await expect(page.getByRole('button', { name: 'Open actions' })).toHaveCount(2);
	});

	test('clicking reveal button shows action buttons', async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: 'Open actions' }).first().click();
		await expect(
			page.getByRole('button', { name: 'Delete row' }).first()
		).toBeVisible();
	});

	test('reveal button label changes to "Close actions" when open', async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: 'Open actions' }).first().click();
		await expect(
			page.getByRole('button', { name: 'Close actions' }).first()
		).toBeVisible();
	});

	test('clicking close button returns to "Open actions" state', async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: 'Open actions' }).first().click();
		await page.getByRole('button', { name: 'Close actions' }).first().click();
		await expect(
			page.getByRole('button', { name: 'Open actions' }).first()
		).toBeVisible();
		await expect(
			page.getByRole('button', { name: 'Close actions' })
		).toHaveCount(0);
	});

	test('opening a second row closes the first', async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: 'Open actions' }).first().click();
		// Row 0 open; row 1 still shows 'Open actions'
		await page.getByRole('button', { name: 'Open actions' }).first().click();
		// Row 1 now open, row 0 closed — exactly one 'Close actions' visible
		await expect(
			page.getByRole('button', { name: 'Close actions' })
		).toHaveCount(1);
	});
});
