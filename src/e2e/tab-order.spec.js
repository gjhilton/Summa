import { test, expect } from '@playwright/test';
import {
	goto,
	enableShowWorking,
	toggleAdvancedOptions,
	addSubtotalItem,
	navigateIntoSubtotal,
} from '../config/playwright/helpers/test-helpers.js';

test.describe('tab order', () => {
	test('export button is focusable', async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: 'export', exact: true }).focus();
		await expect(page.getByRole('button', { name: 'export', exact: true })).toBeFocused();
	});

	test('tab order through a line: title → li → s → d', async ({ page }) => {
		await goto(page);
		const titleInput = page.getByLabel('Line title').first();
		await titleInput.focus();
		await page.keyboard.press('Tab');
		// After title, should be in the li field of the same row
		await expect(page.getByLabel('li', { exact: true }).first()).toBeFocused();
		await page.keyboard.press('Tab');
		await expect(page.getByLabel('s', { exact: true }).first()).toBeFocused();
		await page.keyboard.press('Tab');
		await expect(page.getByLabel('d', { exact: true }).first()).toBeFocused();
	});

	test('tab from last d field of row 0 reaches title field of row 1', async ({ page }) => {
		await goto(page);
		const d0 = page.getByLabel('d', { exact: true }).first();
		await d0.focus();
		await page.keyboard.press('Tab');
		await expect(page.getByLabel('Line title').nth(1)).toBeFocused();
	});

	test('explain calculations toggle is focusable', async ({ page }) => {
		await goto(page);
		await page.getByRole('switch', { name: /explain calculations/i }).focus();
		await expect(page.getByRole('switch', { name: /explain calculations/i })).toBeFocused();
	});

	test('advanced mode toggle is focusable', async ({ page }) => {
		await goto(page);
		await page.getByRole('switch', { name: /advanced mode/i }).focus();
		await expect(page.getByRole('switch', { name: /advanced mode/i })).toBeFocused();
	});

	test('at sub-level: done button is focusable', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await page.getByRole('button', { name: 'done', exact: true }).focus();
		await expect(page.getByRole('button', { name: 'done', exact: true })).toBeFocused();
	});

	test('at sub-level: breadcrumb button is focusable', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await page.getByRole('button', { name: 'Summa totalis' }).focus();
		await expect(page.getByRole('button', { name: 'Summa totalis' })).toBeFocused();
	});

	test('at sub-level: title input receives focus', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await page.getByLabel('Sub-calculation title').focus();
		await expect(page.getByLabel('Sub-calculation title')).toBeFocused();
	});

	test('when undo visible: undo button is focusable', async ({ page }) => {
		await goto(page);
		// Trigger undo button appearance
		await page.getByLabel('li', { exact: true }).first().fill('j');
		await expect(page.getByRole('button', { name: 'undo', exact: true })).toBeVisible();
		await page.getByRole('button', { name: 'undo', exact: true }).focus();
		await expect(page.getByRole('button', { name: 'undo', exact: true })).toBeFocused();
	});
});
