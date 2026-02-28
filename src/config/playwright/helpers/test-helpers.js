/**
 * Test helper functions for Playwright E2E tests
 */

/**
 * Navigate to the Summa app base URL.
 * @param {import('@playwright/test').Page} page
 */
export async function goto(page) {
	await page.goto('/');
}

/**
 * Get an l/s/d input field by label for a given line index.
 * @param {import('@playwright/test').Page} page
 * @param {'l' | 's' | 'd'} field
 * @param {number} [lineIndex=0] - 0-based index among line items
 */
export async function getField(page, field, lineIndex = 0) {
	const inputs = page.getByLabel(field, { exact: true });
	return inputs.nth(lineIndex);
}

/**
 * Type a value into a specific line's l/s/d field.
 * @param {import('@playwright/test').Page} page
 * @param {number} lineIndex - 0-based index
 * @param {'l' | 's' | 'd'} field
 * @param {string} value
 */
export async function enterValue(page, lineIndex, field, value) {
	const input = await getField(page, field, lineIndex);
	await input.fill(value);
}

/**
 * Click the Advanced options toggle to enable it.
 * @param {import('@playwright/test').Page} page
 */
export async function toggleAdvancedOptions(page) {
	await page.getByRole('switch', { name: /advanced options/i }).click();
}

/**
 * Click the "New subtotal item" button (requires advanced options enabled).
 * @param {import('@playwright/test').Page} page
 */
export async function addSubtotalItem(page) {
	await page.getByRole('button', { name: /new subtotal item/i }).click();
}

/**
 * Click the pencil (edit) button on a subtotal row identified by its title input value.
 * @param {import('@playwright/test').Page} page
 * @param {string} title - current title text (or empty string for untitled)
 */
export async function navigateIntoSubtotal(page, title) {
	await page.getByRole('button', { name: /edit subtotal/i }).first().click();
}

/**
 * Click a breadcrumb link by its visible text.
 * @param {import('@playwright/test').Page} page
 * @param {string} crumbText
 */
export async function navigateViaBreadcrumb(page, crumbText) {
	await page.getByRole('button', { name: crumbText }).click();
}
