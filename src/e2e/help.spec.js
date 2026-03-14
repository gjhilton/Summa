import { test, expect } from '@playwright/test';
import { goto } from '../config/playwright/helpers/test-helpers.js';

test.describe('help screen', () => {
	test('help button in footer navigates to help screen', async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: /help/i }).click();
		await expect(page.getByRole('heading', { name: 'Getting started' })).toBeVisible();
	});

	test('help screen shows back button', async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: /help/i }).click();
		await expect(page.getByRole('button', { name: /back/i })).toBeVisible();
	});

	test('back button returns to main screen', async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: /help/i }).click();
		await page.getByRole('button', { name: /back/i }).click();
		await expect(page.getByRole('button', { name: 'export', exact: true })).toBeVisible();
	});

	test('help screen shows "Getting started" heading', async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: /help/i }).click();
		await expect(page.getByRole('heading', { name: 'Getting started' })).toBeVisible();
	});

	test('help screen shows "Historical note" heading', async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: /help/i }).click();
		await expect(page.getByRole('heading', { name: 'Historical note' })).toBeVisible();
	});

	test('help screen shows "Organising items" heading', async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: /help/i }).click();
		await expect(page.getByRole('heading', { name: 'Organising items' })).toBeVisible();
	});

	test('help screen shows "Explanations" heading', async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: /help/i }).click();
		await expect(page.getByRole('heading', { name: 'Explanations' })).toBeVisible();
	});

	test('help screen shows "Advanced features" heading', async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: /help/i }).click();
		await expect(page.getByRole('heading', { name: 'Advanced features' })).toBeVisible();
	});

	test('help screen shows "Extended items" heading', async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: /help/i }).click();
		await expect(page.getByRole('heading', { name: 'Extended items' })).toBeVisible();
	});

	test('help screen shows "Subtotal items" heading', async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: /help/i }).click();
		await expect(page.getByRole('heading', { name: 'Subtotal items' })).toBeVisible();
	});

	test('help screen shows "Export and load" heading', async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: /help/i }).click();
		await expect(page.getByRole('heading', { name: 'Export and load' })).toBeVisible();
	});

	test('help screen shows "About Summa" heading', async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: /help/i }).click();
		await expect(page.getByRole('heading', { name: 'About Summa' })).toBeVisible();
	});

	test('"Explanations are currently enabled" shows when show-working is on', async ({ page }) => {
		await goto(page);
		// goto() starts with show-working off; enable it first
		await page.getByRole('switch', { name: /explain calculations/i }).click();
		await page.getByRole('button', { name: /help/i }).click();
		await expect(page.getByText(/Explanations are currently enabled/)).toBeVisible();
	});

	test('"Explanations are currently disabled" shows when show-working is off', async ({ page }) => {
		await goto(page);
		// goto() already leaves show-working off
		await page.getByRole('button', { name: /help/i }).click();
		await expect(page.getByText(/Explanations are currently disabled/)).toBeVisible();
	});

	test('"Advanced features are currently disabled" shows by default', async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: /help/i }).click();
		await expect(page.getByText(/Advanced features are currently disabled/)).toBeVisible();
	});

	test('toggling advanced in help and returning to main shows advanced item buttons', async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: /help/i }).click();
		// Toggle advanced mode in help screen (uses "advanced" label on the help toggle)
		await page.getByRole('switch', { name: /advanced/i }).click();
		await page.getByRole('button', { name: /back/i }).click();
		await expect(page.getByRole('button', { name: /extended/i })).toBeVisible();
	});
});
