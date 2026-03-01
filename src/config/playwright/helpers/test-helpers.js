/**
 * Test helper functions for Playwright E2E tests
 */

/**
 * Navigate to the Summa app base URL.
 * @param {import('@playwright/test').Page} page
 */
export async function goto(page) {
	// Load the page, clear all storage, reload to dismiss the first-visit
	// help screen, then click Clear to reset the default demo state so every
	// test starts with two empty lines.
	await page.goto('/');
	await page.evaluate(() => {
		localStorage.clear();
		localStorage.setItem('summa_visited', '1');
	});
	await page.reload();
	page.once('dialog', dialog => dialog.accept());
	await page.getByRole('button', { name: 'Clear', exact: true }).click();
}

const FIELD_LABELS = { l: 'pounds', s: 'shillings', d: 'pence' };

/**
 * Get an l/s/d input field by label for a given line index.
 * @param {import('@playwright/test').Page} page
 * @param {'l' | 's' | 'd'} field
 * @param {number} [lineIndex=0] - 0-based index among line items
 */
export async function getField(page, field, lineIndex = 0) {
	const label = FIELD_LABELS[field] ?? field;
	return page.getByLabel(label, { exact: true }).nth(lineIndex);
}

/**
 * Get the total row display span for a given l/s/d field (the last labelled element).
 * @param {import('@playwright/test').Page} page
 * @param {'l' | 's' | 'd'} field
 */
export function getTotalField(page, field) {
	const label = FIELD_LABELS[field] ?? field;
	return page.getByLabel(label, { exact: true }).last();
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
 * Enable show working toggle.
 * @param {import('@playwright/test').Page} page
 */
export async function enableShowWorking(page) {
	await page.getByRole('switch', { name: /show working/i }).click();
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
 * Click the subtotal title link to navigate into it.
 * The title defaults to "Untitled" for a freshly added subtotal.
 * @param {import('@playwright/test').Page} page
 * @param {string} [title='Untitled']
 */
export async function navigateIntoSubtotal(page, title = 'Untitled') {
	await page.getByRole('button', { name: title }).first().click();
}

/**
 * Click a breadcrumb link by its visible text.
 * @param {import('@playwright/test').Page} page
 * @param {string} crumbText
 */
export async function navigateViaBreadcrumb(page, crumbText) {
	await page.getByRole('button', { name: crumbText }).click();
}

/**
 * Get the Items count locator shown in the total row (only visible when show working is on).
 * @param {import('@playwright/test').Page} page
 */
export function getItemsCount(page) {
	return page.getByText(/^Items: \d+$/);
}

/**
 * Click the Save button to open the save modal.
 * @param {import('@playwright/test').Page} page
 */
export async function openSaveModal(page) {
	await page.getByRole('button', { name: 'Save', exact: true }).click();
}

/**
 * Click the Load button to open the load modal.
 * @param {import('@playwright/test').Page} page
 */
export async function openLoadModal(page) {
	await page.getByRole('button', { name: 'Load', exact: true }).click();
}

/**
 * Close the save modal by pressing Escape.
 * @param {import('@playwright/test').Page} page
 */
export async function closeSaveModal(page) {
	await page.keyboard.press('Escape');
}

/**
 * Close the load modal by pressing Escape.
 * @param {import('@playwright/test').Page} page
 */
export async function closeLoadModal(page) {
	await page.keyboard.press('Escape');
}

/**
 * Type a filename and click Save, intercepting the download.
 * @param {import('@playwright/test').Page} page
 * @param {string} filename - without extension
 * @returns {Promise<import('@playwright/test').Download>}
 */
export async function saveAs(page, filename) {
	await page.getByLabel('Filename').fill(filename);
	const [download] = await Promise.all([
		page.waitForEvent('download'),
		// .last() because there are two "Save" buttons in the DOM: one in the
		// header and one inside the modal. The modal's button comes last.
		page.getByRole('button', { name: 'Save', exact: true }).last().click(),
	]);
	return download;
}

/**
 * Set the file input in the load modal to the given absolute file path.
 * @param {import('@playwright/test').Page} page
 * @param {string} filePath - absolute path to fixture file
 */
export async function loadFile(page, filePath) {
	await page.getByLabel('Summa file').setInputFiles(filePath);
	// .last() because there are two "Load" buttons in the DOM: one in the
	// header and one inside the modal. The modal's button comes last.
	await page
		.getByRole('button', { name: 'Load', exact: true })
		.last()
		.click();
}
