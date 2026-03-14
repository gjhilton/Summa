import { test, expect } from '@playwright/test';
import { gotoSplash, goto } from '../config/playwright/helpers/test-helpers.js';

// ─── Content ──────────────────────────────────────────────────────────────────

test.describe('splash screen content', () => {
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

	test('shows description of what Summa does', async ({ page }) => {
		await gotoSplash(page);
		await expect(page.getByText(/calculator for historians/i)).toBeVisible();
	});

	test('mentions Early Modern British accounts', async ({ page }) => {
		await gotoSplash(page);
		await expect(page.getByText(/Early Modern/)).toBeVisible();
	});

	test('mentions pounds, shillings and pence in Roman numerals', async ({ page }) => {
		await gotoSplash(page);
		await expect(page.getByText(/pounds, shillings and pence/i)).toBeVisible();
		await expect(page.getByText(/Roman numerals/i)).toBeVisible();
	});

	test('shows warranty disclaimer', async ({ page }) => {
		await gotoSplash(page);
		await expect(page.getByText(/without warranty/i)).toBeVisible();
	});

	test('mentions it is beta software', async ({ page }) => {
		await gotoSplash(page);
		await expect(page.getByText(/beta software/i)).toBeVisible();
	});

	test('advises checking results against source documents', async ({ page }) => {
		await gotoSplash(page);
		await expect(page.getByText(/check any results/i)).toBeVisible();
	});

	test('states work is stored only in local storage', async ({ page }) => {
		await gotoSplash(page);
		await expect(page.getByText(/local storage/i)).toBeVisible();
	});

	test('states work never leaves your device', async ({ page }) => {
		await gotoSplash(page);
		await expect(page.getByText(/never leaves your device/i)).toBeVisible();
	});

	test('states no analytics or user data collected', async ({ page }) => {
		await gotoSplash(page);
		await expect(page.getByText(/does not collect analytics/i)).toBeVisible();
	});

	test('mentions Google Fonts', async ({ page }) => {
		await gotoSplash(page);
		await expect(page.getByText(/Google Fonts/)).toBeVisible();
	});

	test('shows agreement text', async ({ page }) => {
		await gotoSplash(page);
		await expect(page.getByText(/By continuing you agree/i)).toBeVisible();
	});

	test('shows footer', async ({ page }) => {
		await gotoSplash(page);
		await expect(page.locator('footer')).toBeVisible();
	});
});

// ─── Navigation ───────────────────────────────────────────────────────────────

test.describe('splash screen navigation', () => {
	test('"get started" navigates to main screen', async ({ page }) => {
		await gotoSplash(page);
		await page.getByRole('button', { name: 'get started' }).click();
		await expect(page.getByRole('button', { name: 'export', exact: true })).toBeVisible();
	});

	test('"read manual" navigates to help screen', async ({ page }) => {
		await gotoSplash(page);
		await page.getByRole('button', { name: 'read manual' }).click();
		await expect(page.getByRole('heading', { name: 'Getting started' })).toBeVisible();
	});

	test('"read manual" → help → back → arrives at main screen (not splash)', async ({
		page,
	}) => {
		await gotoSplash(page);
		await page.getByRole('button', { name: 'read manual' }).click();
		await expect(page.getByRole('heading', { name: 'Getting started' })).toBeVisible();
		await page.getByRole('button', { name: /back/i }).click();
		await expect(page.getByRole('button', { name: 'export', exact: true })).toBeVisible();
		await expect(page.getByRole('button', { name: 'get started' })).not.toBeVisible();
	});

	test('splash not visible on main screen after "get started"', async ({ page }) => {
		await gotoSplash(page);
		await page.getByRole('button', { name: 'get started' }).click();
		await expect(page.getByRole('button', { name: 'get started' })).not.toBeVisible();
	});

	test('splash not visible on help screen after "read manual"', async ({ page }) => {
		await gotoSplash(page);
		await page.getByRole('button', { name: 'read manual' }).click();
		await expect(page.getByRole('button', { name: 'get started' })).not.toBeVisible();
	});
});

// ─── Welcome-seen persistence ─────────────────────────────────────────────────

test.describe('welcome-seen persistence', () => {
	test('after "get started", reload skips splash → main screen', async ({ page }) => {
		await gotoSplash(page);
		await page.getByRole('button', { name: 'get started' }).click();
		await page.reload();
		await expect(page.getByRole('button', { name: 'export', exact: true })).toBeVisible();
		await expect(page.getByRole('button', { name: 'get started' })).not.toBeVisible();
	});

	test('after "read manual", reload skips splash', async ({ page }) => {
		await gotoSplash(page);
		await page.getByRole('button', { name: 'read manual' }).click();
		await page.reload();
		await expect(page.getByRole('button', { name: 'get started' })).not.toBeVisible();
	});

	test('goto() sets welcome key — main screen shown, splash absent', async ({ page }) => {
		await goto(page);
		await expect(page.getByRole('button', { name: 'get started' })).not.toBeVisible();
		await expect(page.getByRole('button', { name: 'export', exact: true })).toBeVisible();
	});

	test('existing saved calculation (no welcome key) skips splash', async ({ page }) => {
		// hasSeenWelcome() returns true when STORAGE_KEY exists, even without WELCOME_KEY.
		// This covers users who had data before the splash screen was added.
		await page.goto('/');
		await page.evaluate(() => {
			localStorage.clear();
			localStorage.setItem('summa_calculation', JSON.stringify([]));
		});
		await page.reload();
		await expect(page.getByRole('button', { name: 'get started' })).not.toBeVisible();
		await expect(page.getByRole('button', { name: 'export', exact: true })).toBeVisible();
	});

	test('no localStorage keys → splash shown', async ({ page }) => {
		await page.goto('/');
		await page.evaluate(() => localStorage.clear());
		await page.reload();
		await expect(page.getByRole('button', { name: 'get started' })).toBeVisible();
	});

	test('clearing localStorage after first visit shows splash again on reload', async ({
		page,
	}) => {
		await gotoSplash(page);
		await page.getByRole('button', { name: 'get started' }).click();
		await expect(page.getByRole('button', { name: 'export', exact: true })).toBeVisible();
		// Simulate clearing browser data
		await page.evaluate(() => localStorage.clear());
		await page.reload();
		await expect(page.getByRole('button', { name: 'get started' })).toBeVisible();
	});
});
