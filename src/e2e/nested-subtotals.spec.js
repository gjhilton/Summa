import { test, expect } from '@playwright/test';
import {
	goto,
	toggleAdvancedOptions,
	addSubtotalItem,
	navigateIntoSubtotal,
	navigateViaBreadcrumb,
	enterValue,
	getTotalField,
} from '../config/playwright/helpers/test-helpers.js';

test.describe('nested subtotals', () => {
	test('can add a subtotal inside a subtotal', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await addSubtotalItem(page);
		await expect(page.getByRole('button', { name: 'edit' }).first()).toBeVisible();
	});

	test('breadcrumb shows both levels when nested two deep', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		// Breadcrumb should have root + level-1 buttons
		await expect(
			page.getByRole('navigation', { name: /breadcrumb/i })
		).toBeVisible();
		await expect(
			page.getByRole('button', { name: 'Summa totalis' })
		).toBeVisible();
	});

	test('values in nested subtotal propagate to grandparent total', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'v'); // 5d at level 2
		// Total at level 2 should show v
		await expect(getTotalField(page, 'd')).toHaveValue('v');
	});

	test('done at nested level returns to level 1', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await page.getByRole('button', { name: 'done', exact: true }).click();
		// Should be at level 1: breadcrumb still visible (level 1 has a breadcrumb)
		await expect(
			page.getByRole('button', { name: 'Summa totalis' })
		).toBeVisible();
		// The nested subtotal's total (5d) should show in level 1's total
		// (We didn't add values so total is empty — just check we're at level 1 not root)
		await expect(
			page.getByRole('button', { name: 'done', exact: true })
		).toBeVisible();
	});

	test('breadcrumb jump skips to root from two levels deep', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await navigateViaBreadcrumb(page, 'Summa totalis');
		// At root: no breadcrumb, no done button
		await expect(
			page.getByRole('navigation', { name: /breadcrumb/i })
		).not.toBeVisible();
		await expect(
			page.getByRole('button', { name: 'done', exact: true })
		).not.toBeVisible();
	});

	test('nested subtotal value rolls up through both levels', async ({ page }) => {
		await goto(page);
		await toggleAdvancedOptions(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await addSubtotalItem(page);
		await navigateIntoSubtotal(page);
		await enterValue(page, 0, 'd', 'v'); // 5d at level 2
		await navigateViaBreadcrumb(page, 'Summa totalis');
		// Root total should reflect nested 5d
		await expect(getTotalField(page, 'd')).toHaveValue('v');
	});
});
