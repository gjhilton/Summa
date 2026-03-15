/**
 * Test helper functions for Playwright E2E tests
 */

/**
 * Navigate to the Summa app base URL, bypassing the splash screen.
 * Sets summa_welcomed so the app starts on the main screen.
 * @param {import('@playwright/test').Page} page
 */
export async function goto(page) {
	// Load the page, clear all storage, set the welcome key so the app
	// starts on the main screen on reload. localStorage.clear() is enough
	// to reset state — no need to click Clear (which would pollute the undo stack).
	await page.goto('/');
	await page.evaluate(() => {
		localStorage.clear();
		localStorage.setItem('summa_welcomed', '1');
	});
	await page.reload();
	// showExplanation defaults to true; disable it so tests start with show working OFF
	const explainToggle = page.getByRole('switch', { name: /explain calculations/i });
	if ((await explainToggle.getAttribute('aria-checked')) === 'true') {
		await explainToggle.click();
	}
}

/**
 * Navigate to the Summa app on first visit (splash screen shown).
 * Does NOT set the welcome key, so the splash screen is shown.
 * @param {import('@playwright/test').Page} page
 */
export async function gotoSplash(page) {
	await page.goto('/');
	await page.evaluate(() => localStorage.clear());
	await page.reload();
}

const FIELD_LABELS = { l: 'li', s: 's', d: 'd' };

/**
 * Get an l/s/d input field by label for a given line index.
 * @param {import('@playwright/test').Page} page
 * @param {'l' | 's' | 'd'} field
 * @param {number} [lineIndex=0] - 0-based index among line items
 */
export function getField(page, field, lineIndex = 0) {
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
 * Enable explain calculations (show working) toggle.
 * @param {import('@playwright/test').Page} page
 */
export async function enableShowWorking(page) {
	await page.getByRole('switch', { name: /explain calculations/i }).click();
}

/**
 * Click the Advanced mode toggle to enable it.
 * @param {import('@playwright/test').Page} page
 */
export async function toggleAdvancedOptions(page) {
	await page.getByRole('switch', { name: /advanced mode/i }).click();
}

/**
 * Click the "extended" button to add a new extended item (requires advanced mode enabled).
 * @param {import('@playwright/test').Page} page
 */
export async function addExtendedItem(page) {
	await page.getByRole('button', { name: /extended/i }).click();
}

/**
 * Click the "subtotal" button to add a new subtotal item (requires advanced mode enabled).
 * @param {import('@playwright/test').Page} page
 */
export async function addSubtotalItem(page) {
	await page.getByRole('button', { name: /subtotal/i }).click();
}

/**
 * Click the "edit" link to navigate into a subtotal.
 * @param {import('@playwright/test').Page} page
 * @param {string} [title='Untitled'] - unused, kept for API compatibility
 */
export async function navigateIntoSubtotal(page, title = 'Untitled') {
	await page.getByRole('button', { name: 'edit' }).first().click();
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
 * Click the export button to open the save modal.
 * @param {import('@playwright/test').Page} page
 */
export async function openSaveModal(page) {
	await page.getByRole('button', { name: 'export', exact: true }).click();
}

/**
 * Click the load button to open the load modal.
 * @param {import('@playwright/test').Page} page
 */
export async function openLoadModal(page) {
	await page.getByRole('button', { name: 'load', exact: true }).first().click();
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
		// .last() because there may be multiple "save" buttons in the DOM.
		// The modal's button comes last.
		page.getByRole('button', { name: 'save', exact: true }).last().click(),
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
	// .last() because there are two "load" buttons in the DOM: one in the
	// header and one inside the modal. The modal's button comes last.
	await page
		.getByRole('button', { name: 'load', exact: true })
		.last()
		.click();
}

/**
 * Hover over a row to reveal the action buttons (delete/duplicate/clear).
 * @param {import('@playwright/test').Page} page
 * @param {number} [rowIndex=0] - 0-based index among line items
 */
export async function revealRowActions(page, rowIndex = 0) {
	await page.getByLabel('li', { exact: true }).nth(rowIndex).hover();
}

/**
 * Click the Delete row button for a given row (confirms the dialog).
 * @param {import('@playwright/test').Page} page
 * @param {number} [rowIndex=0]
 */
export async function clickDeleteRow(page, rowIndex = 0) {
	await revealRowActions(page, rowIndex);
	page.once('dialog', d => d.accept());
	await page.getByRole('button', { name: 'Delete row' }).nth(rowIndex).click();
}

/**
 * Click the Duplicate row button for a given row.
 * @param {import('@playwright/test').Page} page
 * @param {number} [rowIndex=0]
 */
export async function clickDuplicateRow(page, rowIndex = 0) {
	await revealRowActions(page, rowIndex);
	await page.getByRole('button', { name: 'Duplicate row' }).nth(rowIndex).click();
}

/**
 * Click the Clear item button for a given row (confirms the dialog).
 * @param {import('@playwright/test').Page} page
 * @param {number} [rowIndex=0]
 */
export async function clickClearRow(page, rowIndex = 0) {
	await revealRowActions(page, rowIndex);
	page.once('dialog', d => d.accept());
	await page.getByRole('button', { name: 'Clear item' }).nth(rowIndex).click();
}

/**
 * Click the undo button in the header.
 * @param {import('@playwright/test').Page} page
 */
export async function clickUndo(page) {
	await page.getByRole('button', { name: 'undo', exact: true }).click();
}
