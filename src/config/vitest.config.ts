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
		},
	},
});
