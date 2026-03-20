/**
 * Save/load round-trip tests:
 * - Save then load restores identical state for line items
 * - Save then load restores extended items (quantity, unit price)
 * - Save then load restores subtotals with children
 * - Export disabled when subtotal child has error
 * - File content structure validation for extended/subtotal types
 */
import { test, expect } from '@playwright/test';
import {
	goto,
	enterValue,
	getField,
	getTotalField,
	openSaveModal,
	openLoadModal,
	saveAs,
	toggleAdvancedOptions,
	addExtendedItem,
	addSubtotalItem,
	navigateIntoSubtotal,
	navigateViaBreadcrumb,
} from '../config/playwright/helpers/test-helpers.js';

// ─── Round-trip: plain line items ────────────────────────────────────────────

test.describe('save/load round-trip: line items', () => {
	test('l/s/d values survive a save/load cycle', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'l', 'ij');
		await enterValue(page, 0, 's', 'v');
		await enterValue(page, 0, 'd', 'iij');
		await openSaveModal(page);
		const download = await saveAs(page, 'roundtrip-test');
		const filePath = await download.path();
		if (!filePath) throw new Error('Download path null');

		// Clear and load
		page.once('dialog', d => d.accept());
		await page.getByRole('button', { name: 'clear', exact: true }).click();
		await openLoadModal(page);
		const { loadFile } = await import('../config/playwright/helpers/test-helpers.js');
		await loadFile(page, filePath);

		await expect(getField(page, 'l', 0)).toHaveValue('ij');
		await expect(getField(page, 's', 0)).toHaveValue('v');
		await expect(getField(page, 'd', 0)).toHaveValue('iij');
	});

	test('line title survives a save/load cycle', async ({ page }) => {
		await goto(page);
		await page.getByLabel('Line title').first().fill('Wages for March');
		await enterValue(page, 0, 'd', 'v');
		await openSaveModal(page);
		const download = await saveAs(page, 'title-roundtrip');
		const filePath = await download.path();
		if (!filePath) throw new Error('Download path null');

		page.once('dialog', d => d.accept());
		await page.getByRole('button', { name: 'clear', exact: true }).click();
		await openLoadModal(page);
		const { loadFile } = await import('../config/playwright/helpers/test-helpers.js');
		await loadFile(page, filePath);

		await expect(page.getByLabel('Line title').first()).toHaveValue('Wages for March');
	});

	test('grand total is correct after save/load round-trip', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'v');   // 5d
		await enterValue(page, 1, 'd', 'iij'); // 3d → total 8d
		await openSaveModal(page);
		const download = await saveAs(page, 'total-roundtrip');
		const filePath = await download.path();
		if (!filePath) throw new Error('Download path null');

		page.once('dialog', d => d.accept());
		await page.getByRole('button', { name: 'clear', exact: true }).click();
		await openLoadModal(page);
		const { loadFile } = await import('../config/playwright/helpers/test-helpers.js');
		await loadFile(page, filePath);

		await expect(getTotalField(page, 'd')).toHaveValue('viij');
	});
});

// ─── Round-trip: extended items ───────────────────────────────────────────────

test.describe('save/load round-trip: extended items', () => {
	test('extended item quantity and unit price survive save/load', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 'd', 2).fill('v'); // 5d unit price
		await page.getByLabel('quantity').first().fill('iij'); // 3 units
		await page.getByLabel('Item title').first().fill('Books');

		await openSaveModal(page);
		const download = await saveAs(page, 'extended-roundtrip');
		const filePath = await download.path();
		if (!filePath) throw new Error('Download path null');

		page.once('dialog', d => d.accept());
		await page.getByRole('button', { name: 'clear', exact: true }).click();
		await openLoadModal(page);
		const { loadFile } = await import('../config/playwright/helpers/test-helpers.js');
		await loadFile(page, filePath);

		// After load: advanced mode not persisted but data is
		// The extended item reloads as extended type
		await expect(page.getByLabel('Item title').first()).toHaveValue('Books');
		// Unit price at field index 2 (extended item editable d)
		await expect(getField(page, 'd', 2)).toHaveValue('v');
		// Total: 5d × 3 = 15d = 1s 3d
		await expect(getTotalField(page, 's')).toHaveValue('j');
		await expect(getTotalField(page, 'd')).toHaveValue('iij');
	});

	test('saved file contains EXTENDED_ITEM type with correct quantity and unit price', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 'd', 2).fill('v'); // 5d unit price
		// Default quantity is 'j' (1); unit price d is in literals

		await openSaveModal(page);
		const download = await saveAs(page, 'ext-type-test');
		const filePath = await download.path();
		if (!filePath) throw new Error('Download path null');

		const { readFileSync } = await import('fs');
		const content = JSON.parse(readFileSync(filePath, 'utf-8'));
		const extItem = content.lines.find(l => l.itemType === 'EXTENDED_ITEM');
		expect(extItem).toBeTruthy();
		// Default quantity is 'j' (1 unit)
		expect(extItem.quantity).toBe('j');
		// Unit price d field in literals
		expect(extItem.literals.d).toBe('v');
	});
});

// ─── Round-trip: subtotal items ───────────────────────────────────────────────

test.describe('save/load round-trip: subtotal items', () => {
	test('subtotal children survive save/load cycle', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'v'); // 5d inside subtotal
		await page.getByLabel('Sub-calculation title').fill('Section A');
		await page.getByLabel('Sub-calculation title').press('Tab');
		await navigateViaBreadcrumb(page, 'Summa totalis');

		await openSaveModal(page);
		const download = await saveAs(page, 'subtotal-roundtrip');
		const filePath = await download.path();
		if (!filePath) throw new Error('Download path null');

		page.once('dialog', d => d.accept());
		await page.getByRole('button', { name: 'clear', exact: true }).click();
		await openLoadModal(page);
		const { loadFile } = await import('../config/playwright/helpers/test-helpers.js');
		await loadFile(page, filePath);

		// After load: subtotal contributes 5d to root total
		await expect(getTotalField(page, 'd')).toHaveValue('v');
		// Navigate into the subtotal to verify children
		await page.getByRole('button', { name: 'edit' }).first().click();
		await expect(getField(page, 'd', 0)).toHaveValue('v');
	});

	test('subtotal title survives save/load cycle', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await page.getByLabel('Sub-calculation title').fill('Quarter accounts');
		await page.getByLabel('Sub-calculation title').press('Tab');
		await navigateViaBreadcrumb(page, 'Summa totalis');

		await openSaveModal(page);
		const download = await saveAs(page, 'sub-title-roundtrip');
		const filePath = await download.path();
		if (!filePath) throw new Error('Download path null');

		page.once('dialog', d => d.accept());
		await page.getByRole('button', { name: 'clear', exact: true }).click();
		await openLoadModal(page);
		const { loadFile } = await import('../config/playwright/helpers/test-helpers.js');
		await loadFile(page, filePath);

		// Subtotal should now be visible; navigate into it and check title
		await page.getByRole('button', { name: 'edit' }).first().click();
		await expect(page.getByLabel('Sub-calculation title')).toHaveValue('Quarter accounts');
	});
});

// ─── Export disabled when error in subtotal child ────────────────────────────

test.describe('export button disabled when errors exist inside subtotals', () => {
	test('export is disabled when a subtotal child has an error', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'zz'); // invalid
		await navigateViaBreadcrumb(page, 'Summa totalis');
		const exportBtn = page.getByRole('button', { name: 'export', exact: true });
		await expect(exportBtn).toBeDisabled();
	});

	test('export re-enables when subtotal child error is fixed', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'zz'); // invalid
		await navigateViaBreadcrumb(page, 'Summa totalis');
		await expect(
			page.getByRole('button', { name: 'export', exact: true })
		).toBeDisabled();
		// Fix the error
		await page.getByRole('button', { name: 'edit' }).first().click();
		await enterValue(page, 0, 'd', 'v'); // fix
		await navigateViaBreadcrumb(page, 'Summa totalis');
		await expect(
			page.getByRole('button', { name: 'export', exact: true })
		).not.toBeDisabled();
	});

	test('export is enabled after error is cleared (field set to empty)', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'zz'); // invalid
		await expect(
			page.getByRole('button', { name: 'export', exact: true })
		).toBeDisabled();
		await enterValue(page, 0, 'd', ''); // clear to empty → valid (no error)
		await expect(
			page.getByRole('button', { name: 'export', exact: true })
		).not.toBeDisabled();
	});
});
