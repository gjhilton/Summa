import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': resolve(__dirname, '..'),
			'@components': resolve(__dirname, '../components'),
			'@state': resolve(__dirname, '../state'),
			'@utils': resolve(__dirname, '../utils'),
			'@generated': resolve(__dirname, '../../dist/styled-system'),
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./src/config/vitest.setup.ts'],
		exclude: [
			'**/node_modules/**',
			'**/dist/**',
			'**/.{idea,git,cache,output,temp}/**',
		],
		coverage: {
			provider: 'v8',
			reportsDirectory: './dist/coverage',
			reporter: ['text', 'json', 'html'],
			exclude: [
				'node_modules/**',
				'dist/**',
				'src/config/**',
				'dist/styled-system/**',
				'**/main.tsx',
			],
			thresholds: {
				lines: 80,
				functions: 80,
				branches: 80,
				statements: 80,
			},
		},
	},
});
