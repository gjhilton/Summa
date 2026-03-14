import { test, expect } from '@playwright/test';
import {
	goto,
	enterValue,
	enableShowWorking,
	getItemsCount,
	clickDeleteRow,
	clickUndo,
	toggleAdvancedOptions,
	addSubtotalItem,
	navigateIntoSubtotal,
	openLoadModal,
	loadFile,
} from '../config/playwright/helpers/test-helpers.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SIMPLE_FIXTURE = path.resolve(__dirname, 'fixtures/simple.summa.json');

test.describe('undo', () => {
	test('undo button not visible on fresh empty state', async ({ page }) => {
		await goto(page);
		await expect(
			page.getByRole('button', { name: 'undo', exact: true })
		).not.toBeVisible();
	});

	test('entering a value makes undo button appear', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'v');
		await expect(
			page.getByRole('button', { name: 'undo', exact: true })
		).toBeVisible();
	});

	test('clicking undo reverts a value change', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'v');
		await clickUndo(page);
		const dInput = await page.getByLabel('d', { exact: true }).first();
		await expect(dInput).toHaveValue('');
	});

	test('after undo, undo button disappears when stack is empty', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'v');
		await clickUndo(page);
		await expect(
			page.getByRole('button', { name: 'undo', exact: true })
		).not.toBeVisible();
	});

	test('add a line then undo removes the line', async ({ page }) => {
		await goto(page);
		await enableShowWorking(page);
		await page.getByRole('button', { name: '+ item' }).click();
		await expect(getItemsCount(page)).toHaveText('Items: 3');
		await clickUndo(page);
		await expect(getItemsCount(page)).toHaveText('Items: 2');
	});

	test('delete a row then undo restores it', async ({ page }) => {
		await goto(page);
		await enableShowWorking(page);
		await page.getByRole('button', { name: '+ item' }).click();
		await expect(getItemsCount(page)).toHaveText('Items: 3');
		await clickDeleteRow(page, 0);
		await expect(getItemsCount(page)).toHaveText('Items: 2');
		await clickUndo(page);
		await expect(getItemsCount(page)).toHaveText('Items: 3');
	});

	test('multiple sequential undos step back through history', async ({ page }) => {
		await goto(page);
		await enableShowWorking(page);
		await page.getByRole('button', { name: '+ item' }).click();
		await page.getByRole('button', { name: '+ item' }).click();
		await expect(getItemsCount(page)).toHaveText('Items: 4');
		await clickUndo(page);
		await expect(getItemsCount(page)).toHaveText('Items: 3');
		await clickUndo(page);
		await expect(getItemsCount(page)).toHaveText('Items: 2');
	});

	test('loading a file clears undo stack', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'v');
		await expect(
			page.getByRole('button', { name: 'undo', exact: true })
		).toBeVisible();
		await openLoadModal(page);
		await loadFile(page, SIMPLE_FIXTURE);
		await expect(
			page.getByRole('button', { name: 'undo', exact: true })
		).not.toBeVisible();
	});

	test('navigating into subtotal shows own undo stack (root undo hidden)', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'v');
		// Root undo is visible
		await expect(
			page.getByRole('button', { name: 'undo', exact: true })
		).toBeVisible();
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		// At sub-level with empty undo stack, undo button not visible
		await expect(
			page.getByRole('button', { name: 'undo', exact: true })
		).not.toBeVisible();
	});

	test('edit in subtotal makes sub-undo button appear', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'iii');
		await expect(
			page.getByRole('button', { name: 'undo', exact: true })
		).toBeVisible();
	});
});
