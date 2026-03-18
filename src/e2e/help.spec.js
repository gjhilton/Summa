import { test, expect } from '@playwright/test';
import { goto } from '../config/playwright/helpers/test-helpers.js';

// ─── Navigation ───────────────────────────────────────────────────────────────

test.describe('help screen navigation', () => {
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

	test('back button from help lands on main screen, not splash', async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: /help/i }).click();
		await page.getByRole('button', { name: /back/i }).click();
		await expect(page.getByRole('button', { name: 'get started' })).not.toBeVisible();
	});
});

// ─── Section headings ─────────────────────────────────────────────────────────

test.describe('help screen section headings', () => {
	test.beforeEach(async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: /help/i }).click();
	});

	test('shows "Getting started" heading', async ({ page }) => {
		await expect(page.getByRole('heading', { name: 'Getting started' })).toBeVisible();
	});

	test('shows "Historical note" heading', async ({ page }) => {
		await expect(page.getByRole('heading', { name: 'Historical note' })).toBeVisible();
	});

	test('shows "Organising items" heading', async ({ page }) => {
		await expect(page.getByRole('heading', { name: 'Organising items' })).toBeVisible();
	});

	test('shows "Explanations" heading', async ({ page }) => {
		await expect(page.getByRole('heading', { name: 'Explanations' })).toBeVisible();
	});

	test('shows "Advanced features" heading', async ({ page }) => {
		await expect(page.getByRole('heading', { name: 'Advanced features' })).toBeVisible();
	});

	test('shows "Extended items" heading', async ({ page }) => {
		await expect(page.getByRole('heading', { name: 'Extended items' })).toBeVisible();
	});

	test('shows "Subtotal items" heading', async ({ page }) => {
		await expect(page.getByRole('heading', { name: 'Subtotal items' })).toBeVisible();
	});

	test('shows "Export and load" heading', async ({ page }) => {
		await expect(page.getByRole('heading', { name: 'Export and load' })).toBeVisible();
	});

	test('shows "About Summa" heading', async ({ page }) => {
		await expect(page.getByRole('heading', { name: 'About Summa' })).toBeVisible();
	});
});

// ─── Getting Started content ──────────────────────────────────────────────────

test.describe('Getting Started section', () => {
	test.beforeEach(async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: /help/i }).click();
	});

	test('explains li/s/d field labels for pounds, shillings and pence', async ({ page }) => {
		// Each label is in a <strong> tag; match the surrounding text instead
		await expect(page.getByText(/pounds \(librae\)/i)).toBeVisible();
		await expect(page.getByText(/shillings \(solidi\)/i)).toBeVisible();
		await expect(page.getByText(/pence \(denarii\)/i)).toBeVisible();
	});

	test('mentions invalid Roman numeral input causes error', async ({ page }) => {
		await expect(page.getByText(/not a valid Roman numeral/i)).toBeVisible();
	});

	test('mentions the undo button', async ({ page }) => {
		await expect(page.getByText(/undo.*button appears/i)).toBeVisible();
	});

	test('mentions automatic save', async ({ page }) => {
		await expect(page.getByText(/saved automatically/i)).toBeVisible();
	});

	// Screen samples
	test('screen sample: item row with title "Bookes" renders', async ({ page }) => {
		// BlockTitle renders the title as a readonly input value, not as text content
		await expect(page.locator('input[value="Bookes"]').first()).toBeVisible();
	});

	test('screen sample: error item with invalid field renders', async ({ page }) => {
		// The error sample has an input showing "3s" (an invalid Roman numeral)
		await expect(page.locator('input[value="3s"]')).toBeVisible();
	});

	test('screen sample: AddItemBar shows "+ item" button', async ({ page }) => {
		await expect(page.getByRole('button', { name: '+ item' }).first()).toBeVisible();
	});

	test('screen sample: undo button renders in sample', async ({ page }) => {
		// On the help screen there is no real calculator header, so "undo" appears only in the sample
		await expect(page.getByRole('button', { name: 'undo', exact: true })).toBeVisible();
	});
});

// ─── Historical Note content ──────────────────────────────────────────────────

test.describe('Historical Note section', () => {
	test.beforeEach(async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: /help/i }).click();
	});

	test('explains u/v and i/j interchangeability', async ({ page }) => {
		await expect(page.getByText(/u and v/i)).toBeVisible();
		await expect(page.getByText(/i and j/i)).toBeVisible();
	});

	test('explains 2=ij, 3=iij, 4=iiij early modern style', async ({ page }) => {
		await expect(page.getByText(/2 is ij/)).toBeVisible();
		await expect(page.getByText(/4 is iiij/)).toBeVisible();
	});

	test('mentions £1 = 240d and 1s = 12d conversion', async ({ page }) => {
		await expect(page.getByText(/£1 = 240d/)).toBeVisible();
		await expect(page.getByText(/1s = 12d/)).toBeVisible();
	});
});

// ─── Organising Items content ─────────────────────────────────────────────────

test.describe('Organising Items section', () => {
	test.beforeEach(async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: /help/i }).click();
	});

	test('mentions Delete, Duplicate and Clear buttons', async ({ page }) => {
		await expect(page.getByText(/Delete, Duplicate and Clear/)).toBeVisible();
	});

	test('screen sample: item row with drag handle renders', async ({ page }) => {
		await expect(page.getByRole('button', { name: 'Drag to reorder' }).first()).toBeVisible();
	});

	test('screen sample: action strip renders with Delete/Duplicate/Clear buttons', async ({
		page,
	}) => {
		// The second Organising sample renders with desktopVisible=true so buttons are always shown
		await expect(page.getByRole('button', { name: 'Delete row' }).first()).toBeVisible();
		await expect(page.getByRole('button', { name: 'Duplicate row' }).first()).toBeVisible();
		await expect(page.getByRole('button', { name: 'Clear item' }).first()).toBeVisible();
	});
});

// ─── Explanations section ─────────────────────────────────────────────────────

test.describe('Explanations section', () => {
	test.beforeEach(async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: /help/i }).click();
	});

	test('"Explanations are currently enabled" shows when show-working is on', async ({ page }) => {
		// goto() disables show-working; navigate to help then enable via the sample toggle
		await page.getByRole('switch', { name: /show working/i }).click();
		await expect(page.getByText(/Explanations are currently enabled/)).toBeVisible();
	});

	test('"Explanations are currently disabled" shows when show-working is off', async ({ page }) => {
		// goto() already leaves show-working off
		await expect(page.getByText(/Explanations are currently disabled/)).toBeVisible();
	});

	test('screen sample: ExplanationRow renders with calculation breakdown', async ({ page }) => {
		// The sample explanation row shows: (3 × 12d = 36d) + 6d = 42d
		await expect(page.getByText(/3 × 12/)).toBeVisible();
	});

	test('screen sample: "show working" toggle switch renders in sample', async ({ page }) => {
		await expect(page.getByRole('switch', { name: /show working/i })).toBeVisible();
	});

	test('toggling show-working in help → back → main shows working annotations', async ({
		page,
	}) => {
		// goto() disables show-working; click the toggle in the help Explanations sample
		await page.getByRole('switch', { name: /show working/i }).click();
		await page.getByRole('button', { name: /back/i }).click();
		// The "explain calculations" toggle on main screen should now be ON
		await expect(
			page.getByRole('switch', { name: /explain calculations/i })
		).toHaveAttribute('aria-checked', 'true');
	});
});

// ─── Advanced Features section ────────────────────────────────────────────────

test.describe('Advanced Features section', () => {
	test.beforeEach(async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: /help/i }).click();
	});

	test('"Advanced features are currently disabled" shows by default', async ({ page }) => {
		await expect(page.getByText(/Advanced features are currently disabled/)).toBeVisible();
	});

	test('"Advanced features are currently enabled" shows when toggled on', async ({ page }) => {
		await page.getByRole('switch', { name: /advanced/i }).click();
		await expect(page.getByText(/Advanced features are currently enabled/)).toBeVisible();
	});

	test('screen sample: "advanced" toggle switch renders in sample', async ({ page }) => {
		await expect(page.getByRole('switch', { name: /advanced/i })).toBeVisible();
	});

	test('screen sample: AddItemBar with extended and subtotal buttons renders', async ({ page }) => {
		// The Advanced section sample shows AddItemBar with advanced=true (all buttons)
		await expect(page.getByRole('button', { name: /extended/i }).first()).toBeVisible();
		await expect(page.getByRole('button', { name: /subtotal/i }).first()).toBeVisible();
	});

	test('toggling advanced in help and returning to main shows advanced item buttons', async ({
		page,
	}) => {
		await page.getByRole('switch', { name: /advanced/i }).click();
		await page.getByRole('button', { name: /back/i }).click();
		await expect(page.getByRole('button', { name: /extended/i })).toBeVisible();
	});
});

// ─── Extended Items content ───────────────────────────────────────────────────

test.describe('Extended Items section', () => {
	test.beforeEach(async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: /help/i }).click();
	});

	test('explains quantity × unit price calculation', async ({ page }) => {
		await expect(page.getByText(/quantity multiplied by a unit price/i)).toBeVisible();
	});

	test('screen sample: ItemExtended with title "Bookes" renders', async ({ page }) => {
		await expect(page.locator('input[value="Bookes"]').first()).toBeVisible();
	});

	test('screen sample: ItemExtended shows quantity "iiij"', async ({ page }) => {
		await expect(page.locator('input[value="iiij"]')).toBeVisible();
	});
});

// ─── Subtotal Items content ───────────────────────────────────────────────────

test.describe('Subtotal Items section', () => {
	test.beforeEach(async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: /help/i }).click();
	});

	test('explains edit button to enter sub-calculation', async ({ page }) => {
		await expect(page.getByText(/tap.*edit.*to enter/i)).toBeVisible();
	});

	test('explains done button to return', async ({ page }) => {
		await expect(page.getByText(/done.*to return/i)).toBeVisible();
	});

	test('explains breadcrumb trail navigation', async ({ page }) => {
		await expect(page.getByText(/breadcrumb trail/i)).toBeVisible();
	});

	test('explains undo is local to each level', async ({ page }) => {
		await expect(page.getByText(/undo is local/i)).toBeVisible();
	});

	test('screen sample: ItemSubTotal "Bookes" renders with edit button', async ({ page }) => {
		await expect(page.getByText('Bookes (3 items)')).toBeVisible();
		await expect(page.getByRole('button', { name: 'edit' })).toBeVisible();
	});

	test('screen sample: BreadcrumbNav renders with "Summary" and "Bookes" crumbs', async ({
		page,
	}) => {
		await expect(page.getByRole('button', { name: 'Summary' })).toBeVisible();
	});
});

// ─── Export and Load content ──────────────────────────────────────────────────

test.describe('Export and Load section', () => {
	test.beforeEach(async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: /help/i }).click();
	});

	test('mentions .summa.json file format', async ({ page }) => {
		await expect(page.getByText(/.summa.json/)).toBeVisible();
	});

	test('mentions top level only — not inside sub-calculation', async ({ page }) => {
		await expect(page.getByText(/top level/i)).toBeVisible();
		await expect(page.getByText(/not while inside a sub-calculation/i)).toBeVisible();
	});

	test('screen sample: export and load buttons render', async ({ page }) => {
		// On help screen there is no real calculator, so these are purely the sample buttons
		await expect(page.getByRole('button', { name: 'export', exact: true })).toBeVisible();
		await expect(page.getByRole('button', { name: 'load', exact: true })).toBeVisible();
	});
});

// ─── About Summa content ──────────────────────────────────────────────────────

test.describe('About Summa section', () => {
	test('shows GitHub issues link', async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: /help/i }).click();
		await expect(page.getByRole('link', { name: /GitHub issues/i })).toBeVisible();
	});
});

// ─── Footer ───────────────────────────────────────────────────────────────────

test.describe('help screen footer', () => {
	test.beforeEach(async ({ page }) => {
		await goto(page);
		await page.getByRole('button', { name: /help/i }).click();
	});

	test('footer is visible on help screen', async ({ page }) => {
		await expect(page.locator('footer')).toBeVisible();
	});

	test('footer does not show a help button (prevents infinite loop)', async ({ page }) => {
		// ScreenFooter only renders help button when onHelp prop is passed;
		// HelpScreen passes no onHelp, so no help button in the help footer.
		// (There is a back button in the header, but no help button in the footer.)
		// We need to check the footer specifically:
		const footer = page.locator('footer');
		await expect(footer.getByRole('button', { name: /help/i })).not.toBeVisible();
	});

	test('footer shows version and copyright text', async ({ page }) => {
		await expect(page.locator('footer').getByText(/Summa v/)).toBeVisible();
		await expect(page.locator('footer').getByText(/copyright/i)).toBeVisible();
	});
});
