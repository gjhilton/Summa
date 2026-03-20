/**
 * UI detail tests:
 * - Footer content on main screen
 * - Print colophon element exists
 * - Row minimum at sub-level (delete disabled at 2 rows)
 * - Clear dialog text at root vs sub-level
 * - Add item bar accessibility
 * - Screen header shows Summa logo
 * - Summa totalis heading at root
 */
import { test, expect } from '@playwright/test';
import {
	goto,
	toggleAdvancedOptions,
	addSubtotalItem,
	navigateIntoSubtotal,
	navigateViaBreadcrumb,
	revealRowActions,
	clickDeleteRow,
	enableShowWorking,
	getItemsCount,
} from '../config/playwright/helpers/test-helpers.js';

// ─── Footer ───────────────────────────────────────────────────────────────────

test.describe('main screen footer', () => {
	test('footer is visible on main screen', async ({ page }) => {
		await goto(page);
		await expect(page.locator('footer')).toBeVisible();
	});

	test('footer shows version text', async ({ page }) => {
		await goto(page);
		await expect(page.locator('footer').getByText(/Summa v/)).toBeVisible();
	});

	test('footer shows copyright text', async ({ page }) => {
		await goto(page);
		await expect(page.locator('footer').getByText(/copyright/i)).toBeVisible();
	});

	test('footer shows help button on main screen', async ({ page }) => {
		await goto(page);
		await expect(page.locator('footer').getByRole('button', { name: /help/i })).toBeVisible();
	});

	test('clicking footer help button navigates to help screen', async ({ page }) => {
		await goto(page);
		await page.locator('footer').getByRole('button', { name: /help/i }).click();
		await expect(page.getByRole('heading', { name: 'Getting started' })).toBeVisible();
	});
});

// ─── Print colophon ───────────────────────────────────────────────────────────

test.describe('print colophon', () => {
	test('print colophon element is present in DOM', async ({ page }) => {
		await goto(page);
		const colophon = page.locator('#print-colophon');
		await expect(colophon).toBeAttached();
	});

	test('print colophon contains the Summa URL', async ({ page }) => {
		await goto(page);
		const colophon = page.locator('#print-colophon');
		await expect(colophon).toContainText('Summa');
	});
});

// ─── Row minimum enforcement at sub-level ────────────────────────────────────

test.describe('delete button disabled at minimum row count inside subtotal', () => {
	test('delete button is disabled when sub-level has only 2 rows', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await revealRowActions(page, 0);
		await expect(
			page.getByRole('button', { name: 'Delete row' }).first()
		).toBeDisabled();
	});

	test('delete enabled when sub-level has 3 rows', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await page.getByRole('button', { name: '+ item' }).click();
		await revealRowActions(page, 0);
		await expect(
			page.getByRole('button', { name: 'Delete row' }).first()
		).toBeEnabled();
	});

	test('delete disabled again after deleting down to 2 rows at sub-level', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await page.getByRole('button', { name: '+ item' }).click();
		await clickDeleteRow(page, 0);
		await revealRowActions(page, 0);
		await expect(
			page.getByRole('button', { name: 'Delete row' }).first()
		).toBeDisabled();
	});
});

// ─── Clear dialogs ────────────────────────────────────────────────────────────

test.describe('clear dialog text', () => {
	test('root clear button dialog says "Clear all items?"', async ({ page }) => {
		await goto(page);
		let dialogMessage = '';
		page.once('dialog', async dialog => {
			dialogMessage = dialog.message();
			await dialog.dismiss();
		});
		await page.getByRole('button', { name: 'clear', exact: true }).click();
		expect(dialogMessage).toBe('Clear all items?');
	});

	test('sub-level clear button dialog says "Clear all items?"', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		let dialogMessage = '';
		page.once('dialog', async dialog => {
			dialogMessage = dialog.message();
			await dialog.dismiss();
		});
		await page.getByRole('button', { name: 'clear', exact: true }).click();
		expect(dialogMessage).toBe('Clear all items?');
	});
});

// ─── Add item bar ─────────────────────────────────────────────────────────────

test.describe('add item bar', () => {
	test('"+ item" button has the accessible name "+ item"', async ({ page }) => {
		await goto(page);
		await expect(page.getByRole('button', { name: '+ item' })).toBeVisible();
	});

	test('clicking "+ item" increases item count', async ({ page }) => {
		await goto(page);
		await enableShowWorking(page);
		await page.getByRole('button', { name: '+ item' }).click();
		await expect(getItemsCount(page)).toHaveText('Items: 3');
	});

	test('"+ item" button present at sub-level', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await expect(page.getByRole('button', { name: '+ item' })).toBeVisible();
	});
});

// ─── Logo and heading ─────────────────────────────────────────────────────────

test.describe('logo and page heading', () => {
	test('Summa logo visible on main screen', async ({ page }) => {
		await goto(page);
		await expect(page.getByRole('img', { name: 'Summa', exact: true })).toBeVisible();
	});

	test('Summa logo still visible at sub-level', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await expect(page.getByRole('img', { name: 'Summa', exact: true })).toBeVisible();
	});

	test('"paginæ" not visible at root level', async ({ page }) => {
		await goto(page);
		await expect(page.getByText('paginæ')).not.toBeVisible();
	});

	test('"paginæ" visible at sub-level total row', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await expect(page.getByText('paginæ')).toBeVisible();
	});
});
