import { test, expect } from '@playwright/test';
import {
	goto,
	enterValue,
	getTotalField,
	getField,
	openLoadModal,
	loadFile,
} from '../config/playwright/helpers/test-helpers.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SIMPLE_FIXTURE = path.resolve(__dirname, 'fixtures/simple.summa.json');

test.describe('localStorage persistence', () => {
	test('values entered persist after page reload', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'v'); // 5d
		await page.reload();
		await expect(getField(page, 'd', 0)).toHaveValue('v');
	});

	test('grand total persists after page reload', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'v');
		await enterValue(page, 1, 'd', 'iij');
		await page.reload();
		await expect(getTotalField(page, 'd')).toHaveValue('viij');
	});

	test('loading a file and reloading keeps the loaded state', async ({ page }) => {
		await goto(page);
		await openLoadModal(page);
		await loadFile(page, SIMPLE_FIXTURE);
		// simple.summa.json has 5s + 7s = 12s
		// Wait for the modal to close and state to be rendered before reloading
		await expect(page.getByText('Load calculation')).not.toBeVisible();
		await expect(getTotalField(page, 's')).toHaveValue('xij');
		await page.reload();
		await expect(getTotalField(page, 's')).toHaveValue('xij');
	});

	test('clearing state and reloading shows empty state', async ({ page }) => {
		await goto(page);
		await enterValue(page, 0, 'd', 'v');
		// Clear via confirm dialog
		page.once('dialog', d => d.accept());
		await page.getByRole('button', { name: 'clear', exact: true }).click();
		await page.reload();
		await expect(getTotalField(page, 'd')).toHaveValue('');
	});
});
