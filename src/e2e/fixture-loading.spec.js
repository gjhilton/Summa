/**
 * Tests for loading fixture files:
 * - Loading a fixture with subtotal items
 * - Loading a fixture with extended items
 * - Loading a fixture with mixed item types
 * - First-visit demo lines (firstVisitLines)
 */
import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import {
	goto,
	getTotalField,
	getField,
	openLoadModal,
	loadFile,
	enableShowWorking,
	getItemsCount,
} from '../config/playwright/helpers/test-helpers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SUBTOTAL_FIXTURE = path.resolve(__dirname, 'fixtures/subtotal.summa.json');
const EXTENDED_FIXTURE = path.resolve(__dirname, 'fixtures/extended.summa.json');

// ─── Subtotal fixture ─────────────────────────────────────────────────────────

test.describe('loading subtotal fixture', () => {
	test('loads subtotal fixture and shows correct root total', async ({ page }) => {
		await goto(page);
		await openLoadModal(page);
		await loadFile(page, SUBTOTAL_FIXTURE);
		// Fixture: SUBTOTAL "Quarter 1" (5s + 3s = 8s) + LINE "Standalone" 2s = 10s
		await expect(getTotalField(page, 's')).toHaveValue('x');
	});

	test('loads subtotal fixture and shows edit button', async ({ page }) => {
		await goto(page);
		await openLoadModal(page);
		await loadFile(page, SUBTOTAL_FIXTURE);
		await expect(page.getByRole('button', { name: 'edit' })).toBeVisible();
	});

	test('can navigate into loaded subtotal and see correct children', async ({ page }) => {
		await goto(page);
		await openLoadModal(page);
		await loadFile(page, SUBTOTAL_FIXTURE);
		// Navigate into the subtotal
		await page.getByRole('button', { name: 'edit' }).first().click();
		// Sub-level total: 5s + 3s = 8s
		await expect(getTotalField(page, 's')).toHaveValue('viij');
	});

	test('loaded subtotal shows its title in the sub-calculation header', async ({ page }) => {
		await goto(page);
		await openLoadModal(page);
		await loadFile(page, SUBTOTAL_FIXTURE);
		await page.getByRole('button', { name: 'edit' }).first().click();
		await expect(page.getByLabel('Sub-calculation title')).toHaveValue('Quarter 1');
	});

	test('loaded subtotal children show correct titles', async ({ page }) => {
		await goto(page);
		await openLoadModal(page);
		await loadFile(page, SUBTOTAL_FIXTURE);
		await page.getByRole('button', { name: 'edit' }).first().click();
		await expect(page.getByLabel('Line title').first()).toHaveValue('January');
		await expect(page.getByLabel('Line title').nth(1)).toHaveValue('February');
	});

	test('item count correct for loaded subtotal fixture', async ({ page }) => {
		await goto(page);
		await openLoadModal(page);
		await loadFile(page, SUBTOTAL_FIXTURE);
		await enableShowWorking(page);
		// Root: 1 subtotal + 1 line = 2 items
		await expect(getItemsCount(page)).toHaveText('Items: 2');
	});
});

// ─── First-visit demo lines ───────────────────────────────────────────────────

test.describe('first visit demo lines', () => {
	test('first visit (no storage, no welcome key) shows demo values j and ij in d fields', async ({ page }) => {
		await page.goto('/');
		await page.evaluate(() => localStorage.clear());
		await page.reload();
		// Splash screen shown; click "get started"
		await page.getByRole('button', { name: 'get started' }).click();
		// Disable show-working if needed
		const toggle = page.getByRole('switch', { name: /explain calculations/i });
		if ((await toggle.getAttribute('aria-checked')) === 'true') {
			await toggle.click();
		}
		// firstVisitLines() sets row 0 d='j' (1d) and row 1 d='ij' (2d)
		await expect(getField(page, 'd', 0)).toHaveValue('j');
		await expect(getField(page, 'd', 1)).toHaveValue('ij');
	});

	test('first visit total is iij (1d + 2d = 3d)', async ({ page }) => {
		await page.goto('/');
		await page.evaluate(() => localStorage.clear());
		await page.reload();
		await page.getByRole('button', { name: 'get started' }).click();
		const toggle = page.getByRole('switch', { name: /explain calculations/i });
		if ((await toggle.getAttribute('aria-checked')) === 'true') {
			await toggle.click();
		}
		await expect(getTotalField(page, 'd')).toHaveValue('iij');
	});

	test('after "get started", subsequent reload uses empty lines (not demo lines)', async ({ page }) => {
		await page.goto('/');
		await page.evaluate(() => localStorage.clear());
		await page.reload();
		await page.getByRole('button', { name: 'get started' }).click();
		// Now clear the calculation and reload
		await page.evaluate(() => {
			localStorage.clear();
			localStorage.setItem('summa_welcomed', '1');
		});
		await page.reload();
		// With summa_welcomed key present, defaultLines() returns initialState (empty)
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});
});

// ─── Load error: missing id in line item ─────────────────────────────────────

test.describe('loading files with structural errors in items', () => {
	test('line item missing id shows error', async ({ page }) => {
		await goto(page);
		await openLoadModal(page);
		await page.getByLabel('Summa file').setInputFiles({
			name: 'bad-line.json',
			mimeType: 'application/json',
			buffer: Buffer.from(JSON.stringify({
				metadata: { appName: 'summa' },
				lines: [
					{ itemType: 'LINE_ITEM', title: 'No id', literals: { l: '', s: '', d: '' } },
				],
			})),
		});
		await page.getByRole('button', { name: 'load', exact: true }).last().click();
		// Should show an error (missing id)
		await expect(page.getByText(/invalid|error|failed/i)).toBeVisible();
	});

	test('unknown item type shows error', async ({ page }) => {
		await goto(page);
		await openLoadModal(page);
		await page.getByLabel('Summa file').setInputFiles({
			name: 'unknown-type.json',
			mimeType: 'application/json',
			buffer: Buffer.from(JSON.stringify({
				metadata: { appName: 'summa' },
				lines: [
					{ id: 'abc', itemType: 'UNKNOWN_TYPE', title: '', literals: { l: '', s: '', d: '' } },
				],
			})),
		});
		await page.getByRole('button', { name: 'load', exact: true }).last().click();
		await expect(page.getByText(/invalid|error|unknown/i)).toBeVisible();
	});
});
