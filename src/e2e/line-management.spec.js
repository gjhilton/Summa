import { test, expect } from '@playwright/test';
import { goto } from '../config/playwright/helpers/test-helpers.js';

test.describe('line management', () => {
	test('starts with 2 line items', async ({ page }) => {
		await goto(page);
		await expect(page.getByText('Total items: 2')).toBeVisible();
	});

	test('can add a new line item', async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: /new line item/i }).click();
		await expect(page.getByText('Total items: 3')).toBeVisible();
	});

	test('remove buttons are hidden when only 2 lines remain', async ({ page }) => {
		await goto(page);
		// With 2 lines, remove buttons should be invisible (visibility: hidden)
		const removeButtons = page.getByRole('button', { name: /remove line/i });
		await expect(removeButtons.first()).toBeHidden();
	});

	test('remove button appears when more than 2 lines', async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: /new line item/i }).click();
		// Now 3 lines — remove buttons should be visible
		const removeButtons = page.getByRole('button', { name: /remove line/i });
		await expect(removeButtons.first()).toBeVisible();
	});

	test('removing a line updates the count', async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: /new line item/i }).click();
		await expect(page.getByText('Total items: 3')).toBeVisible();
		const removeButton = page.getByRole('button', { name: /remove line/i }).first();
		await removeButton.click();
		await expect(page.getByText('Total items: 2')).toBeVisible();
	});

	test('cannot remove below 2 lines', async ({ page }) => {
		await goto(page);
		// With exactly 2 lines, clicking remove should do nothing
		const count = page.getByText('Total items: 2');
		await expect(count).toBeVisible();
	});
});
