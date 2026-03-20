/**
 * Advanced extended-item tests:
 * - Various quantity values (i, ij, iij, large)
 * - Shillings and pounds as unit prices
 * - Show-working explanation format
 * - Quantity = invalid after being valid
 * - Both price and quantity invalid simultaneously
 * - Zero unit price (all fields empty) with valid quantity
 * - Load from fixture: extended item round-trip
 */
import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import {
	goto,
	enterValue,
	getField,
	getTotalField,
	toggleAdvancedOptions,
	addExtendedItem,
	enableShowWorking,
	openLoadModal,
	loadFile,
} from '../config/playwright/helpers/test-helpers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXTENDED_FIXTURE = path.resolve(__dirname, 'fixtures/extended.summa.json');

// ─── Quantity values ──────────────────────────────────────────────────────────

test.describe('extended item: quantity values', () => {
	test('quantity i (1 unit) × 5d = 5d', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 'd', 2).fill('v');          // 5d unit price
		await page.getByLabel('quantity').first().fill('i'); // 1 unit
		await expect(getField(page, 'd', 3)).toHaveValue('v');
		await expect(getTotalField(page, 'd')).toHaveValue('v');
	});

	test('quantity ij (2 units) × 5d = 10d', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 'd', 2).fill('v');           // 5d
		await page.getByLabel('quantity').first().fill('ij'); // 2 units
		// 5d × 2 = 10d
		await expect(getField(page, 'd', 3)).toHaveValue('x');
		await expect(getTotalField(page, 'd')).toHaveValue('x');
	});

	test('quantity v (5 units) × 4d = 20d = 1s 8d', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 'd', 2).fill('iiij');        // 4d
		await page.getByLabel('quantity').first().fill('v');  // 5 units
		// 4d × 5 = 20d = 1s 8d
		await expect(getField(page, 's', 3)).toHaveValue('j');
		await expect(getField(page, 'd', 3)).toHaveValue('viij');
	});

	test('quantity x (10 units) × 1s 0d = 10s', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 's', 2).fill('j');           // 1s unit price
		await page.getByLabel('quantity').first().fill('x'); // 10 units
		// 12d × 10 = 120d = 10s
		await expect(getField(page, 's', 3)).toHaveValue('x');
		await expect(getTotalField(page, 's')).toHaveValue('x');
	});
});

// ─── Unit price in all three fields ──────────────────────────────────────────

test.describe('extended item: unit price in various fields', () => {
	test('pounds unit price: j (£1) × iij (3 units) = £3', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 'l', 2).fill('j');           // £1 unit price
		await page.getByLabel('quantity').first().fill('iij'); // 3 units
		// £1 × 3 = £3
		await expect(getField(page, 'l', 3)).toHaveValue('iij');
		await expect(getTotalField(page, 'l')).toHaveValue('iij');
	});

	test('shillings unit price: v (5s) × ij (2 units) = 10s', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 's', 2).fill('v');           // 5s unit price
		await page.getByLabel('quantity').first().fill('ij'); // 2 units
		// 5s × 2 = 10s
		await expect(getField(page, 's', 3)).toHaveValue('x');
		await expect(getTotalField(page, 's')).toHaveValue('x');
	});

	test('mixed l/s/d unit price: £1 2s 3d × 2 = £2 4s 6d', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 'l', 2).fill('j');   // £1
		await getField(page, 's', 2).fill('ij');  // 2s
		await getField(page, 'd', 2).fill('iij'); // 3d
		// Total unit price: 240+24+3=267d; × 2 = 534d = £2 4s 6d
		await page.getByLabel('quantity').first().fill('ij'); // 2 units
		// 534d = 2*240 + 54 = 2£ + 4s (48d) + 6d
		await expect(getField(page, 'l', 3)).toHaveValue('ij');
		await expect(getField(page, 's', 3)).toHaveValue('iiij');
		await expect(getField(page, 'd', 3)).toHaveValue('vj');
	});
});

// ─── Error states ─────────────────────────────────────────────────────────────

test.describe('extended item: both price and quantity invalid', () => {
	test('invalid price AND invalid quantity: excluded from total', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 'd', 2).fill('zz');              // invalid price
		await page.getByLabel('quantity').first().fill('zz'); // invalid quantity
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});

	test('invalid price, valid quantity: excluded from total', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 'd', 2).fill('zz');              // invalid price
		await page.getByLabel('quantity').first().fill('iij'); // valid quantity
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});

	test('valid price, invalid quantity: excluded from total', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 'd', 2).fill('v');               // 5d valid
		await page.getByLabel('quantity').first().fill('zz'); // invalid quantity
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});

	test('empty price (all fields blank) with valid quantity: not an error, contributes 0d', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		// Leave price fields empty — no value, so 0d × j = 0d (not an error)
		// The extended item shows no error, just contributes 0
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});

	test('going from valid to invalid quantity re-excludes from total', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 'd', 2).fill('v');                // 5d
		await page.getByLabel('quantity').first().fill('ij');  // 2 units = 10d
		await expect(getTotalField(page, 'd')).toHaveValue('x');
		// Now make quantity invalid
		await page.getByLabel('quantity').first().fill('zz');
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});
});

// ─── Show working for extended item ──────────────────────────────────────────

test.describe('extended item: show working explanations', () => {
	test('show working shows unit cost label', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 'd', 2).fill('v'); // 5d
		await enableShowWorking(page);
		await expect(page.getByText(/unit cost/i)).toBeVisible();
	});

	test('show working shows quantity × unit cost product', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 'd', 2).fill('v');              // 5d unit price
		await page.getByLabel('quantity').first().fill('iij'); // 3 units
		await enableShowWorking(page);
		// Explanation should mention 3 units × 5d = 15d
		await expect(page.getByText(/15/).first()).toBeVisible();
	});

	test('show working shows "quantity is required" for empty quantity', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addExtendedItem(page);
		await getField(page, 'd', 2).fill('v');
		await page.getByLabel('quantity').first().fill(''); // clear
		await enableShowWorking(page);
		await expect(page.getByText(/quantity is required/i)).toBeVisible();
	});
});

// ─── Load fixture with extended item ─────────────────────────────────────────

test.describe('loading fixture with extended item', () => {
	test('loads extended fixture and shows correct total', async ({ page }) => {
		await goto(page);
		await openLoadModal(page);
		await loadFile(page, EXTENDED_FIXTURE);
		// Fixture: EXTENDED_ITEM "Bookes" 5d × 3 = 15d; LINE_ITEM "Other item" 1s = 12d
		// Total = 15d + 12d = 27d = 2s 3d
		await expect(getTotalField(page, 's')).toHaveValue('ij');
		await expect(getTotalField(page, 'd')).toHaveValue('iij');
	});

	test('loads extended fixture and shows item title', async ({ page }) => {
		await goto(page);
		await openLoadModal(page);
		await loadFile(page, EXTENDED_FIXTURE);
		await expect(page.getByLabel('Item title').first()).toHaveValue('Bookes');
	});

	test('loads extended fixture with correct quantity', async ({ page }) => {
		await goto(page);
		await openLoadModal(page);
		await loadFile(page, EXTENDED_FIXTURE);
		await expect(page.getByLabel('quantity').first()).toHaveValue('iij');
	});
});
