/**
 * Drag-reorder tests inside a subtotal (sub-level):
 * - Drag first→last in a subtotal
 * - Drag last→first in a subtotal
 * - Drag in subtotal does not affect root level lines
 * - Total invariant after drag at sub-level
 * - Undo after drag at sub-level restores order
 */
import { test, expect } from '@playwright/test';
import {
	goto,
	enterValue,
	getField,
	getTotalField,
	toggleAdvancedOptions,
	addSubtotalItem,
	navigateIntoSubtotal,
	navigateViaBreadcrumb,
	clickUndo,
} from '../config/playwright/helpers/test-helpers.js';

/** Drag row at fromIndex to the position of row at toIndex via mouse drag. */
async function dragRow(page, fromIndex, toIndex) {
	const handles = page.getByRole('button', { name: 'Drag to reorder' });
	const source = handles.nth(fromIndex);
	const target = handles.nth(toIndex);
	const sourceBox = await source.boundingBox();
	const targetBox = await target.boundingBox();
	if (!sourceBox || !targetBox) throw new Error('Could not get bounding box');
	const sx = sourceBox.x + sourceBox.width / 2;
	const sy = sourceBox.y + sourceBox.height / 2;
	const tx = targetBox.x + targetBox.width / 2;
	const ty = targetBox.y + targetBox.height / 2;
	await page.mouse.move(sx, sy);
	await page.mouse.down();
	await page.mouse.move(sx, sy + 5);
	await page.mouse.move(tx, ty);
	await page.mouse.up();
}

// ─── Drag at sub-level ────────────────────────────────────────────────────────

test.describe('drag reorder inside subtotal', () => {
	test('drag first row to last position inside subtotal: total unchanged', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		// Add a third row inside subtotal
		await page.getByRole('button', { name: '+ item' }).click();
		await enterValue(page, 0, 'd', 'iij');  // 3d
		await enterValue(page, 1, 'd', 'v');    // 5d
		await enterValue(page, 2, 'd', 'vij');  // 7d

		await dragRow(page, 0, 2);

		// Total inside subtotal: 3+5+7 = 15d = 1s 3d
		await expect(getTotalField(page, 's')).toHaveValue('j');
		await expect(getTotalField(page, 'd')).toHaveValue('iij');
	});

	test('drag last row to first position inside subtotal: total unchanged', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await page.getByRole('button', { name: '+ item' }).click();
		await enterValue(page, 0, 'd', 'iij');  // 3d
		await enterValue(page, 1, 'd', 'v');    // 5d
		await enterValue(page, 2, 'd', 'vij');  // 7d

		await dragRow(page, 2, 0);

		// Total: 15d = 1s 3d
		await expect(getTotalField(page, 's')).toHaveValue('j');
		await expect(getTotalField(page, 'd')).toHaveValue('iij');
	});

	test('drag inside subtotal does not affect root lines', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'x');    // 10d at root
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await page.getByRole('button', { name: '+ item' }).click();
		await enterValue(page, 0, 'd', 'iij');
		await enterValue(page, 1, 'd', 'v');
		await enterValue(page, 2, 'd', 'vij');

		await dragRow(page, 0, 2);
		// Wait for drag to complete before navigating back
		await expect(getField(page, 'd', 0)).toHaveValue('v');

		// Navigate back to root; root row 0 should still be 10d
		await navigateViaBreadcrumb(page, 'Summa totalis');
		await expect(getField(page, 'd', 0)).toHaveValue('x');
	});

	test('drag in subtotal: root total reflects subtotal total correctly', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await page.getByRole('button', { name: '+ item' }).click();
		await enterValue(page, 0, 'd', 'iij');  // 3d
		await enterValue(page, 1, 'd', 'v');    // 5d
		await enterValue(page, 2, 'd', 'vij');  // 7d

		await dragRow(page, 1, 0);

		// Navigate to root
		await navigateViaBreadcrumb(page, 'Summa totalis');
		// Root total = subtotal total = 15d = 1s 3d
		await expect(getTotalField(page, 's')).toHaveValue('j');
		await expect(getTotalField(page, 'd')).toHaveValue('iij');
	});

	test('undo drag inside subtotal restores exact row order', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await page.getByRole('button', { name: '+ item' }).click();
		await enterValue(page, 0, 'd', 'iij');  // 3d
		await enterValue(page, 1, 'd', 'v');    // 5d
		await enterValue(page, 2, 'd', 'vij');  // 7d

		await dragRow(page, 0, 2);
		// Wait for drag to complete and undo button to appear before undoing
		await expect(getField(page, 'd', 0)).toHaveValue('v');
		await expect(page.getByRole('button', { name: 'undo', exact: true })).toBeVisible();
		await page.waitForTimeout(200);
		await clickUndo(page);

		// Restored: row 0 = 3d, row 1 = 5d, row 2 = 7d
		await expect(getField(page, 'd', 0)).toHaveValue('iij');
		await expect(getField(page, 'd', 1)).toHaveValue('v');
		await expect(getField(page, 'd', 2)).toHaveValue('vij');
	});
});
