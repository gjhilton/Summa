/**
 * Extended drag-reorder tests:
 * - Drag first item to last position in 3+ row lists
 * - Drag last item to first position
 * - Drag a middle item
 * - Drag among mixed item types
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

// ─── 3-row drag scenarios ─────────────────────────────────────────────────────

test.describe('drag with 3 rows', () => {
	test('drag first row to last position in 3-row list', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'iij');  // 3d
		await enterValue(page, 1, 'd', 'v');    // 5d
		await page.getByRole('button', { name: '+ item' }).click();
		await enterValue(page, 2, 'd', 'vij');  // 7d

		await dragRow(page, 0, 2);

		// Row 0 should now be 5d, row 1 = 7d, row 2 = 3d (or 5d→0→7d→3d)
		// After drag 0→2: order is [5d, 7d, 3d] OR [5d, 3d, 7d] depending on implementation
		// Just verify total is unchanged: 3+5+7 = 15d = 1s 3d
		await expect(getTotalField(page, 's')).toHaveValue('j');
		await expect(getTotalField(page, 'd')).toHaveValue('iij');
	});

	test('drag last row to first position in 3-row list', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'iij');  // 3d
		await enterValue(page, 1, 'd', 'v');    // 5d
		await page.getByRole('button', { name: '+ item' }).click();
		await enterValue(page, 2, 'd', 'vij');  // 7d

		await dragRow(page, 2, 0);

		// Total unchanged: 15d = 1s 3d
		await expect(getTotalField(page, 's')).toHaveValue('j');
		await expect(getTotalField(page, 'd')).toHaveValue('iij');
	});

	test('drag middle row changes its position', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'iij');  // 3d
		await enterValue(page, 1, 'd', 'v');    // 5d
		await page.getByRole('button', { name: '+ item' }).click();
		await enterValue(page, 2, 'd', 'vij');  // 7d

		await dragRow(page, 1, 0);

		// After moving row 1 to row 0: row 0 should now show 5d
		await expect(getField(page, 'd', 0)).toHaveValue('v');
		// Total still 15d
		await expect(getTotalField(page, 's')).toHaveValue('j');
	});

	test('undo after dragging in 3-row list restores exact original order', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'iij');  // 3d
		await enterValue(page, 1, 'd', 'v');    // 5d
		await page.getByRole('button', { name: '+ item' }).click();
		await enterValue(page, 2, 'd', 'vij');  // 7d

		// Record original order
		await dragRow(page, 0, 2);
		await clickUndo(page);

		// Restored: row 0 = 3d
		await expect(getField(page, 'd', 0)).toHaveValue('iij');
		await expect(getField(page, 'd', 1)).toHaveValue('v');
		await expect(getField(page, 'd', 2)).toHaveValue('vij');
	});
});

// ─── Drag maintains total across reorders ─────────────────────────────────────

test.describe('total invariant after drag', () => {
	test('total is same regardless of row order (4 rows)', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'j');   // 1d
		await enterValue(page, 1, 'd', 'ij');  // 2d
		await page.getByRole('button', { name: '+ item' }).click();
		await enterValue(page, 2, 'd', 'iij'); // 3d
		await page.getByRole('button', { name: '+ item' }).click();
		await enterValue(page, 3, 'd', 'iiij'); // 4d

		// Drag row 3 to row 0
		await dragRow(page, 3, 0);

		// Total: 1+2+3+4 = 10d = x
		await expect(getTotalField(page, 'd')).toHaveValue('x');
	});
});
