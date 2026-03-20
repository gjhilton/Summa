/**
 * Tests for clear / reset behaviour:
 * - Multiple clears in sequence
 * - Clear resets to exactly 2 empty line items
 * - Clear dismiss keeps state
 * - Clear at root resets navigation to root
 * - Clear after load leaves clean state
 * - Root clear also resets saveFilename
 */
import { test, expect } from '@playwright/test';
import {
	goto,
	enterValue,
	getField,
	getTotalField,
	enableShowWorking,
	getItemsCount,
	toggleAdvancedOptions,
	addSubtotalItem,
	addExtendedItem,
	navigateIntoSubtotal,
	navigateViaBreadcrumb,
	openSaveModal,
	saveAs,
} from '../config/playwright/helpers/test-helpers.js';

test.describe('clear and reset behaviour', () => {
	test('clear resets to exactly 2 empty line items', async ({ page }) => {
		await goto(page);
		await enableShowWorking(page);
		// Add extra lines
		await page.getByRole('button', { name: '+ item' }).click();
		await page.getByRole('button', { name: '+ item' }).click();
		await expect(getItemsCount(page)).toHaveText('Items: 4');
		// Clear
		page.once('dialog', d => d.accept());
		await page.getByRole('button', { name: 'clear', exact: true }).click();
		await expect(getItemsCount(page)).toHaveText('Items: 2');
		// Values cleared
		await expect(getField(page, 'd', 0)).toHaveValue('');
		await expect(getField(page, 'd', 1)).toHaveValue('');
	});

	test('dismiss on clear dialog keeps all items', async ({ page }) => {
		await goto(page);
		await enableShowWorking(page);
		await enterValue(page, 0, 'd', 'v');
		page.once('dialog', d => d.dismiss());
		await page.getByRole('button', { name: 'clear', exact: true }).click();
		// State unchanged
		await expect(getField(page, 'd', 0)).toHaveValue('v');
		await expect(getItemsCount(page)).toHaveText('Items: 2');
	});

	test('two clears in sequence both succeed', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'v');
		page.once('dialog', d => d.accept());
		await page.getByRole('button', { name: 'clear', exact: true }).click();
		await expect(getField(page, 'd', 0)).toHaveValue('');
		// Enter value and clear again
		await enterValue(page, 0, 'd', 'iij');
		page.once('dialog', d => d.accept());
		await page.getByRole('button', { name: 'clear', exact: true }).click();
		await expect(getField(page, 'd', 0)).toHaveValue('');
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});

	test('clear removes subtotal and extended items (resets to 2 lines)', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await addSubtotalItem(page);
		await enableShowWorking(page);
		await expect(getItemsCount(page)).toHaveText('Items: 4');
		page.once('dialog', d => d.accept());
		await page.getByRole('button', { name: 'clear', exact: true }).click();
		await expect(getItemsCount(page)).toHaveText('Items: 2');
	});

	test('save filename resets to empty after clear', async ({ page }) => {
		await goto(page);
		// Save with a filename
		await openSaveModal(page);
		await saveAs(page, 'before-clear');
		// Clear
		page.once('dialog', d => d.accept());
		await page.getByRole('button', { name: 'clear', exact: true }).click();
		// Open save modal again — filename should be empty
		await openSaveModal(page);
		await expect(page.getByLabel('Filename')).toHaveValue('');
	});

	test('root clear from inside subtotal (via breadcrumb nav back first)', async ({ page }) => {
		// Simulate: navigate to subtotal, come back to root, clear
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'v');
		await navigateViaBreadcrumb(page, 'Summa totalis');
		// Verify subtotal contributes to root total
		await expect(getTotalField(page, 'd')).toHaveValue('v');
		// Clear all at root
		page.once('dialog', d => d.accept());
		await page.getByRole('button', { name: 'clear', exact: true }).click();
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});
});
