import { test, expect } from '@playwright/test';
import {
	goto,
	enterValue,
	getField,
	getTotalField,
	enableShowWorking,
	getItemsCount,
	clickUndo,
} from '../config/playwright/helpers/test-helpers.js';

/**
 * Drag row at fromIndex to the position of row at toIndex using mouse drag.
 * Uses the drag handle button for the source row.
 */
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
	// Move incrementally to trigger dnd-kit drag detection
	await page.mouse.move(sx, sy + 5);
	await page.mouse.move(tx, ty);
	await page.mouse.up();
}

test.describe('drag to reorder', () => {
	test('dragging row 0 below row 1 changes their positions', async ({
		page,
	}) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'v'); // row 0: 5d
		await enterValue(page, 1, 'd', 'iij'); // row 1: 3d

		await dragRow(page, 0, 1);

		// After drag, row 0 should now show 3d, row 1 should show 5d
		await expect(getField(page, 'd', 0)).toHaveValue('iij');
		await expect(getField(page, 'd', 1)).toHaveValue('v');
	});

	test('grand total is unchanged after drag reorder', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'v'); // 5d
		await enterValue(page, 1, 'd', 'iij'); // 3d

		await dragRow(page, 0, 1);

		// Total still 8d regardless of order
		await expect(getTotalField(page, 'd')).toHaveValue('viij');
	});

	test('drag adds to undo stack', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'v');
		await enterValue(page, 1, 'd', 'iij');

		// Undo button should appear after drag (drag is a mutation)
		await dragRow(page, 0, 1);
		await expect(
			page.getByRole('button', { name: 'undo', exact: true })
		).toBeVisible();
	});

	test('undo after drag restores original order', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'v'); // row 0: 5d
		await enterValue(page, 1, 'd', 'iij'); // row 1: 3d

		await dragRow(page, 0, 1);
		await expect(getField(page, 'd', 0)).toHaveValue('iij');
		await expect(page.getByRole('button', { name: 'undo', exact: true })).toBeVisible();

		await clickUndo(page);
		// After undo, should restore original order
		await expect(getField(page, 'd', 0)).toHaveValue('v');
		await expect(getField(page, 'd', 1)).toHaveValue('iij');
	});

	test('drag with same source and target does not mutate', async ({
		page,
	}) => {
		await goto(page);
		// Drag row 0 onto itself — should not push to undo
		const handle = page.getByRole('button', { name: 'Drag to reorder' }).first();
		const box = await handle.boundingBox();
		if (!box) throw new Error('No bounding box');
		const cx = box.x + box.width / 2;
		const cy = box.y + box.height / 2;
		await page.mouse.move(cx, cy);
		await page.mouse.down();
		await page.mouse.move(cx, cy + 2);
		await page.mouse.up();
		await expect(
			page.getByRole('button', { name: 'undo', exact: true })
		).not.toBeVisible();
	});
});
