import { test, expect } from '@playwright/test';
import {
	goto,
	enterValue,
	enableShowWorking,
	getField,
	getTotalField,
	getItemsCount,
	toggleAdvancedOptions,
	addSubtotalItem,
	navigateIntoSubtotal,
	navigateViaBreadcrumb,
	revealRowActions,
	clickDuplicateRow,
	clickUndo,
} from '../config/playwright/helpers/test-helpers.js';

// ─── Show working at sub-level ────────────────────────────────────────────────

test.describe('show working inside subtotal', () => {
	test('enabling show working reveals explanation annotations inside subtotal', async ({
		page,
	}) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 's', 'v'); // 5s = 60d
		await enableShowWorking(page);
		await expect(page.getByText(/60/).first()).toBeVisible();
	});

	test('item count is visible inside subtotal when show working is on', async ({
		page,
	}) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enableShowWorking(page);
		await expect(getItemsCount(page)).toBeVisible();
		await expect(getItemsCount(page)).toHaveText('Items: 2');
	});

	test('error explanation is shown inside subtotal with show working on', async ({
		page,
	}) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'zz'); // invalid
		await enableShowWorking(page);
		await expect(page.getByText(/only Roman numerals allowed/i)).toBeVisible();
	});
});

// ─── Undo at sub-level ────────────────────────────────────────────────────────

test.describe('undo button at sub-level', () => {
	test('undo button is hidden before any edit inside subtotal', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await expect(
			page.getByRole('button', { name: 'undo', exact: true })
		).not.toBeVisible();
	});

	test('undo button appears after an edit inside subtotal', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'v');
		await expect(
			page.getByRole('button', { name: 'undo', exact: true })
		).toBeVisible();
	});

	test('sub-level undo stack survives navigating to root and back', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'v'); // push to sub-level stack
		// Navigate to root via done
		await page.getByRole('button', { name: 'done', exact: true }).click();
		// Navigate back into the same subtotal
		await navigateIntoSubtotal(page);
		// Undo button should still be present — stack is per-path and survives navigation
		await expect(
			page.getByRole('button', { name: 'undo', exact: true })
		).toBeVisible();
		// Undo reverts the value
		await clickUndo(page);
		await expect(getField(page, 'd', 0)).toHaveValue('');
	});
});

// ─── Row actions at sub-level ─────────────────────────────────────────────────

test.describe('row actions inside subtotal', () => {
	test('delete confirm message inside subtotal is "Delete this row?"', async ({
		page,
	}) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await revealRowActions(page, 0);
		let dialogMessage = '';
		page.once('dialog', async dialog => {
			dialogMessage = dialog.message();
			await dialog.dismiss();
		});
		await page.getByRole('button', { name: 'Delete row' }).first().click({ force: true });
		expect(dialogMessage).toBe('Delete this row?');
	});

	test('clear item confirm message inside subtotal is "Clear this item?"', async ({
		page,
	}) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await revealRowActions(page, 0);
		let dialogMessage = '';
		page.once('dialog', async dialog => {
			dialogMessage = dialog.message();
			await dialog.dismiss();
		});
		await page.getByRole('button', { name: 'Clear item' }).first().click({ force: true });
		expect(dialogMessage).toBe('Clear this item?');
	});

	test('duplicate inside subtotal increases item count', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enableShowWorking(page);
		await clickDuplicateRow(page, 0);
		await expect(getItemsCount(page)).toHaveText('Items: 3');
	});
});

// ─── Nested error propagation ─────────────────────────────────────────────────

test.describe('three-level nested error propagation', () => {
	test('error three levels deep is excluded from the root grand total', async ({
		page,
	}) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		// Root → add subtotal → navigate in (level 1)
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		// Level 1 → add subtotal → navigate in (level 2)
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		// Enter invalid value at level 2
		await enterValue(page, 0, 'd', 'zz');
		// Navigate back to root
		await navigateViaBreadcrumb(page, 'Summa totalis');
		// Root total must be empty: error at level 2 → level 1 subtotal has error
		// → level 1 subtotal excluded from root → root total = ''
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});

	test('valid value at level 2 with a sibling error at level 2 still excludes level 1', async ({
		page,
	}) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'v'); // 5d valid
		await enterValue(page, 1, 'd', 'zz'); // invalid → level 2 has error → level 1 excluded
		await navigateViaBreadcrumb(page, 'Summa totalis');
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});
});
