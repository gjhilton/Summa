import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { version } = require('../../package.json') as { version: string };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': resolve(__dirname, '..'),
			'@generated': resolve(__dirname, '../generated'),
		},
	},
	define: {
		__APP_VERSION__: JSON.stringify(version),
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./src/config/vitest.setup.ts'],
		exclude: [
			'**/node_modules/**',
			'**/dist/**',
			'**/.{idea,git,cache,output,temp}/**',
			'**/e2e/**',
		],
		coverage: {
			provider: 'v8',
			reportsDirectory: './dist/coverage',
			reporter: ['text', 'json', 'html'],
			exclude: [
				'node_modules/**',
				'dist/**',
				'src/config/**',
				'src/generated/**',
				'**/main.tsx',
			],
			thresholds: {
				// 100% coverage required for all src/utils/ business-logic files.
				// dummyData.ts is excluded — it is a static fixture constant with no logic.
				'src/utils/calculationLogic.ts': {
					statements: 100,
					branches: 100,
					functions: 100,
					lines: 100,
				},
				'src/utils/currency.ts': {
					statements: 100,
					branches: 100,
					functions: 100,
					lines: 100,
				},
				'src/utils/displayLogic.ts': {
					statements: 100,
					branches: 100,
					functions: 100,
					lines: 100,
				},
				'src/utils/earlyModern.ts': {
					statements: 100,
					branches: 100,
					functions: 100,
					lines: 100,
				},
				'src/utils/errorText.ts': {
					statements: 100,
					branches: 100,
					functions: 100,
					lines: 100,
				},
				'src/utils/explanation.ts': {
					statements: 100,
					branches: 100,
					functions: 100,
					lines: 100,
				},
				'src/utils/features.ts': {
					statements: 100,
					branches: 100,
					functions: 100,
					lines: 100,
				},
				'src/utils/preferences.ts': {
					statements: 100,
					branches: 100,
					functions: 100,
					lines: 100,
				},
				'src/utils/roman.ts': {
					statements: 100,
					branches: 100,
					functions: 100,
					lines: 100,
				},
				'src/utils/serialisation.ts': {
					statements: 100,
					branches: 100,
					functions: 100,
					lines: 100,
				},
				'src/utils/storage.ts': {
					statements: 100,
					branches: 100,
					functions: 100,
					lines: 100,
				},
			},
		},
	},
});
