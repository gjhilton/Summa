import { test, expect } from '@playwright/test';
import {
	goto,
	enterValue,
	enableShowWorking,
	getItemsCount,
	getField,
	getTotalField,
	clickDeleteRow,
	clickUndo,
	toggleAdvancedOptions,
	addSubtotalItem,
	addExtendedItem,
	navigateIntoSubtotal,
	navigateViaBreadcrumb,
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

	test('coalesce: multiple keystrokes to same field produce one undo entry', async ({
		page,
	}) => {
		await goto(page);
		// Type each character individually to the same field — all coalesce to one entry
		const dInput = getField(page, 'd', 0);
		await dInput.focus();
		await page.keyboard.type('v');
		await page.keyboard.type('j');
		await page.keyboard.type('j');
		// One undo should revert the whole sequence back to ''
		await clickUndo(page);
		await expect(dInput).toHaveValue('');
		// Undo button gone — only one entry was in the stack
		await expect(
			page.getByRole('button', { name: 'undo', exact: true })
		).not.toBeVisible();
	});

	test('coalesce breaks when switching fields', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'v'); // d field
		await enterValue(page, 0, 's', 'j'); // s field — different coalesce key
		// Two undo steps needed (one per field)
		await clickUndo(page);
		await expect(getField(page, 's', 0)).toHaveValue('');
		await expect(getField(page, 'd', 0)).toHaveValue('v'); // d still set
		await clickUndo(page);
		await expect(getField(page, 'd', 0)).toHaveValue('');
	});

	test('undo stack capped at 25: oldest entry dropped after 26th mutation', async ({
		page,
	}) => {
		await goto(page);
		// Make 26 distinct mutations (use add-line to avoid coalescing)
		for (let i = 0; i < 26; i++) {
			await page.getByRole('button', { name: '+ item' }).click();
		}
		// Stack holds 25 entries. Undo 25 times — stack should empty.
		for (let i = 0; i < 25; i++) {
			await clickUndo(page);
		}
		// Undo button gone — 26th entry was dropped
		await expect(
			page.getByRole('button', { name: 'undo', exact: true })
		).not.toBeVisible();
	});

	test('clear all then undo restores items', async ({ page }) => {
		await goto(page);
		await enableShowWorking(page);
		await enterValue(page, 0, 'd', 'v');
		await enterValue(page, 1, 'd', 'iij');
		page.once('dialog', d => d.accept());
		await page.getByRole('button', { name: 'clear', exact: true }).click();
		// After clear: fields empty
		await expect(getField(page, 'd', 0)).toHaveValue('');
		await clickUndo(page);
		// Restored: values back
		await expect(getField(page, 'd', 0)).toHaveValue('v');
		await expect(getField(page, 'd', 1)).toHaveValue('iij');
	});

	test('undo in subtotal does not affect root lines', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'x'); // 10d at root
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'v'); // 5d in subtotal
		await clickUndo(page); // undo the sub-level change
		// Sub-total total should be empty now
		await expect(getField(page, 'd', 0)).toHaveValue('');
		// Navigate back to root and verify root line unchanged
		await navigateViaBreadcrumb(page, 'Summa totalis');
		await expect(getField(page, 'd', 0)).toHaveValue('x');
	});

	test('add extended item then undo removes it', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await enableShowWorking(page);
		await addExtendedItem(page);
		await expect(getItemsCount(page)).toHaveText('Items: 3');
		await clickUndo(page);
		await expect(getItemsCount(page)).toHaveText('Items: 2');
	});

	test('add subtotal item then undo removes it', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await enableShowWorking(page);
		await addSubtotalItem(page);
		await expect(getItemsCount(page)).toHaveText('Items: 3');
		await clickUndo(page);
		await expect(getItemsCount(page)).toHaveText('Items: 2');
	});

	test('quantity change on extended item then undo reverts quantity', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await page.getByLabel('quantity').first().fill('iij'); // 3
		await clickUndo(page);
		await expect(page.getByLabel('quantity').first()).toHaveValue('j'); // back to default 1
	});

	test('line title change then undo reverts title', async ({ page }) => {
		await goto(page);
		await page.getByLabel('Line title').first().fill('Wages');
		await page.getByLabel('Line title').first().press('Tab');
		await clickUndo(page);
		await expect(page.getByLabel('Line title').first()).toHaveValue('');
	});

	test('line title coalesces: multiple chars to same field produce one undo entry', async ({
		page,
	}) => {
		await goto(page);
		const titleInput = page.getByLabel('Line title').first();
		await titleInput.focus();
		await page.keyboard.type('W');
		await page.keyboard.type('a');
		await page.keyboard.type('g');
		await page.keyboard.type('e');
		// One undo reverts to empty
		await clickUndo(page);
		await expect(titleInput).toHaveValue('');
		// Stack empty — only one coalesced entry was pushed
		await expect(
			page.getByRole('button', { name: 'undo', exact: true })
		).not.toBeVisible();
	});

	test('sub-level add line then undo removes it at sub-level', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enableShowWorking(page);
		await page.getByRole('button', { name: '+ item' }).click();
		await expect(getItemsCount(page)).toHaveText('Items: 3');
		await clickUndo(page);
		await expect(getItemsCount(page)).toHaveText('Items: 2');
	});

	test('sub-level delete then undo restores row at sub-level', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enableShowWorking(page);
		// Add a third row so we can delete
		await page.getByRole('button', { name: '+ item' }).click();
		await clickDeleteRow(page, 0);
		await expect(getItemsCount(page)).toHaveText('Items: 2');
		await clickUndo(page);
		await expect(getItemsCount(page)).toHaveText('Items: 3');
	});

	test('subtotal title change then undo reverts title', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		const titleInput = page.getByLabel('Sub-calculation title');
		await titleInput.fill('My sub');
		await titleInput.press('Tab'); // blur to push undo
		await clickUndo(page);
		await expect(titleInput).toHaveValue('');
	});

	test('clear subtotal item (row action) then undo restores its children', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'v'); // 5d inside
		await navigateViaBreadcrumb(page, 'Summa totalis');
		// Total should be v
		await expect(getTotalField(page, 'd')).toHaveValue('v');
		// Clear the subtotal item from parent
		await page.getByRole('button', { name: 'Open actions' }).nth(2).click();
		page.once('dialog', d => d.accept());
		await page.getByRole('button', { name: 'Clear item' }).nth(2).click({ force: true });
		await expect(getTotalField(page, 'd')).toHaveValue('');
		// Undo restores the 5d inside
		await clickUndo(page);
		await expect(getTotalField(page, 'd')).toHaveValue('v');
	});

	test('subtotal title re-blur without change does not push extra undo entry', async ({
		page,
	}) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		const titleInput = page.getByLabel('Sub-calculation title');
		// Type a title and blur → one undo entry pushed
		await titleInput.fill('My sub');
		await titleInput.press('Tab');
		await expect(
			page.getByRole('button', { name: 'undo', exact: true })
		).toBeVisible();
		// Focus and blur without changing value → no additional undo entry
		await titleInput.focus();
		await titleInput.press('Tab');
		// One undo should fully revert the title to empty
		await clickUndo(page);
		await expect(titleInput).toHaveValue('');
		// Stack now empty
		await expect(
			page.getByRole('button', { name: 'undo', exact: true })
		).not.toBeVisible();
	});
});
