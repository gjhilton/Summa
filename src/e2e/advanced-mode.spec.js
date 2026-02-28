import { test, expect } from '@playwright/test';
import { goto, toggleAdvancedOptions } from '../config/playwright/helpers/test-helpers.js';

test.describe('advanced mode', () => {
	test('advanced options toggle is present', async ({ page }) => {
		await goto(page);
		const toggle = page.getByRole('switch', { name: /advanced options/i });
		await expect(toggle).toBeVisible();
	});

	test('new extended item button is hidden by default', async ({ page }) => {
		await goto(page);
		const btn = page.getByRole('button', { name: /new extended item/i });
		await expect(btn).not.toBeVisible();
	});

	test('enabling advanced mode shows new extended item button', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		const btn = page.getByRole('button', { name: /new extended item/i });
		await expect(btn).toBeVisible();
	});

	test('enabling advanced mode shows new subtotal item button', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		const btn = page.getByRole('button', { name: /new subtotal item/i });
		await expect(btn).toBeVisible();
	});

	test('can add an extended item in advanced mode', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await page.getByRole('button', { name: /new extended item/i }).click();
		const toggle = page.getByRole('switch', { name: /show working/i });
		await toggle.click();
		await expect(page.getByText('Items: 3')).toBeVisible();
	});

	test('disabling advanced mode hides advanced buttons', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await toggleAdvancedOptions(page); // toggle off
		const btn = page.getByRole('button', { name: /new extended item/i });
		await expect(btn).not.toBeVisible();
	});
});
