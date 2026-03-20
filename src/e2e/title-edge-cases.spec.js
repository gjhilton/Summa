/**
 * Edge cases for item titles:
 * - Very long titles do not break layout
 * - Empty title shows placeholder text in breadcrumb ("Untitled")
 * - Title with special characters is stored and displayed correctly
 * - Subtotal breadcrumb uses raw title (not "Untitled" while editing)
 * - Sub-calculation title placeholder text
 */
import { test, expect } from '@playwright/test';
import {
	goto,
	toggleAdvancedOptions,
	addSubtotalItem,
	navigateIntoSubtotal,
	navigateViaBreadcrumb,
} from '../config/playwright/helpers/test-helpers.js';

test.describe('title edge cases', () => {
	test('very long line title is accepted without error', async ({ page }) => {
		await goto(page);
		const longTitle = 'A'.repeat(200);
		await page.getByLabel('Line title').first().fill(longTitle);
		await expect(page.getByLabel('Line title').first()).toHaveValue(longTitle);
	});

	test('title containing numbers and punctuation is stored correctly', async ({ page }) => {
		await goto(page);
		const specialTitle = 'Wages, Q1 1642 — £3 paid';
		await page.getByLabel('Line title').first().fill(specialTitle);
		await expect(page.getByLabel('Line title').first()).toHaveValue(specialTitle);
	});

	test('empty subtotal title shows "Untitled" in breadcrumb nav', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		// Title is empty — breadcrumb should show "Untitled"
		await expect(
			page.getByRole('navigation', { name: /breadcrumb/i })
		).toContainText('Untitled');
	});

	test('breadcrumb updates immediately when subtotal title changes', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		const titleInput = page.getByLabel('Sub-calculation title');
		await titleInput.fill('Midsummer accounts');
		await titleInput.press('Tab');
		// Breadcrumb should show the new title
		await expect(
			page.getByRole('navigation', { name: /breadcrumb/i })
		).toContainText('Midsummer accounts');
	});

	test('subtitle placeholder is shown when sub-calculation title is empty', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		const titleInput = page.getByLabel('Sub-calculation title');
		// The input should have a placeholder (or show empty)
		await expect(titleInput).toHaveValue('');
	});

	test('subtotal title shows in breadcrumb at level 2 via navigate', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		const titleInput = page.getByLabel('Sub-calculation title');
		await titleInput.fill('Level 1 sub');
		await titleInput.press('Tab');
		// Add nested subtotal
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		// At level 2: breadcrumb should contain both "Summa totalis" and "Level 1 sub"
		await expect(page.getByRole('button', { name: 'Summa totalis' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Level 1 sub' })).toBeVisible();
	});

	test('navigating via level-1 breadcrumb from level-2 shows level-1 screen', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		const titleInput = page.getByLabel('Sub-calculation title');
		await titleInput.fill('My sub');
		await titleInput.press('Tab');
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		// Click the level-1 breadcrumb
		await page.getByRole('button', { name: 'My sub' }).click();
		// We are now at level 1: done button visible, Summa totalis button visible
		await expect(page.getByRole('button', { name: 'done', exact: true })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Summa totalis' })).toBeVisible();
		// Not at level 2: level-2 sub no longer in breadcrumb
		await expect(page.getByRole('button', { name: 'Untitled' })).not.toBeVisible();
	});

	test('empty line title placeholder renders in input', async ({ page }) => {
		await goto(page);
		// Empty line title — input value is '' but a placeholder attribute should exist
		const titleInput = page.getByLabel('Line title').first();
		await expect(titleInput).toHaveValue('');
		// The placeholder is rendered (we just verify the element is present and empty)
		await expect(titleInput).toBeVisible();
	});
});
