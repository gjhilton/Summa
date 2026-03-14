import { test, expect } from '@playwright/test';
import { gotoSplash, goto } from '../config/playwright/helpers/test-helpers.js';

test.describe('splash screen', () => {
	test('shows Summa logo on first visit', async ({ page }) => {
		await gotoSplash(page);
		await expect(page.getByRole('img', { name: 'Summa', exact: true })).toBeVisible();
	});

	test('shows "get started" button', async ({ page }) => {
		await gotoSplash(page);
		await expect(page.getByRole('button', { name: 'get started' })).toBeVisible();
	});

	test('shows "read manual" button', async ({ page }) => {
		await gotoSplash(page);
		await expect(page.getByRole('button', { name: 'read manual' })).toBeVisible();
	});

	test('shows warranty disclaimer text', async ({ page }) => {
		await gotoSplash(page);
		await expect(page.getByText(/without warranty/i)).toBeVisible();
	});

	test('shows local storage privacy text', async ({ page }) => {
		await gotoSplash(page);
		await expect(page.getByText(/local storage/i)).toBeVisible();
	});

	test('shows footer', async ({ page }) => {
		await gotoSplash(page);
		await expect(page.locator('footer')).toBeVisible();
	});

	test('"get started" navigates to main screen', async ({ page }) => {
		await gotoSplash(page);
		await page.getByRole('button', { name: 'get started' }).click();
		// Main screen has the export button
		await expect(page.getByRole('button', { name: 'export', exact: true })).toBeVisible();
	});

	test('"read manual" navigates to help screen', async ({ page }) => {
		await gotoSplash(page);
		await page.getByRole('button', { name: 'read manual' }).click();
		// Help screen has "Getting started" heading
		await expect(page.getByRole('heading', { name: 'Getting started' })).toBeVisible();
	});

	test('after "get started", subsequent page load skips splash', async ({ page }) => {
		await gotoSplash(page);
		await page.getByRole('button', { name: 'get started' }).click();
		await page.reload();
		// Main screen shown, not splash
		await expect(page.getByRole('button', { name: 'export', exact: true })).toBeVisible();
	});

	test('after "read manual", subsequent page load skips splash', async ({ page }) => {
		await gotoSplash(page);
		await page.getByRole('button', { name: 'read manual' }).click();
		await page.reload();
		// Help or main screen shown, not splash (welcomed key was set)
		await expect(page.getByRole('button', { name: 'get started' })).not.toBeVisible();
	});

	test('goto() sets welcome key, main screen shown', async ({ page }) => {
		await goto(page);
		await expect(page.getByRole('button', { name: 'get started' })).not.toBeVisible();
		await expect(page.getByRole('button', { name: 'export', exact: true })).toBeVisible();
	});
});
