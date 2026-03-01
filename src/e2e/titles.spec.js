import { test, expect } from '@playwright/test';
import {
	goto,
	toggleAdvancedOptions,
	addSubtotalItem,
	navigateIntoSubtotal,
	getField,
} from '../config/playwright/helpers/test-helpers.js';

test.describe('item titles', () => {
	test('line items have a title input', async ({ page }) => {
		await goto(page);
		const titleInputs = page.getByLabel('Line title');
		await expect(titleInputs.first()).toBeVisible();
	});

	test('can type a title on a line item', async ({ page }) => {
		await goto(page);
		const titleInput = page.getByLabel('Line title').first();
		await titleInput.fill('Wages');
		await expect(titleInput).toHaveValue('Wages');
	});

	test('title persists after entering a value in the same row', async ({
		page,
	}) => {
		await goto(page);
		const titleInput = page.getByLabel('Line title').first();
		await titleInput.fill('Rent');
		const dInput = await getField(page, 'd', 0);
		await dInput.fill('v');
		await expect(titleInput).toHaveValue('Rent');
	});

	test('extended items have a title input', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await page.getByRole('button', { name: /new extended item/i }).click();
		const titleInputs = page.getByLabel('Item title');
		await expect(titleInputs.first()).toBeVisible();
	});

	test('can type a title on an extended item', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await page.getByRole('button', { name: /new extended item/i }).click();
		const titleInput = page.getByLabel('Item title').first();
		await titleInput.fill('Cloth goods');
		await expect(titleInput).toHaveValue('Cloth goods');
	});

	test('subtotal items have a title input', async ({ page }) => {
		// Title for a subtotal is edited inside its sub-calculation via the header
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		const titleInput = page.getByLabel('Sub-calculation title');
		await expect(titleInput).toBeVisible();
	});

	test('can type a title on a subtotal item', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		const titleInput = page.getByLabel('Sub-calculation title');
		await titleInput.fill('Quarter total');
		await expect(titleInput).toHaveValue('Quarter total');
	});

	test('subtotal title shows in breadcrumb after navigating in', async ({
		page,
	}) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		const titleInput = page.getByLabel('Sub-calculation title');
		await titleInput.fill('Quarter total');
		// Blur the input so the global state updates and the breadcrumb reflects the title
		await titleInput.press('Tab');
		await expect(page.getByText('Quarter total')).toBeVisible();
	});

	test('sub-calculation title input updates the breadcrumb', async ({
		page,
	}) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		const subTitleInput = page.getByLabel('Sub-calculation title');
		await subTitleInput.fill('My sub-calc');
		// Blur the input so the global state updates and the breadcrumb reflects the title
		await subTitleInput.press('Tab');
		await expect(page.getByText('My sub-calc')).toBeVisible();
	});
});
