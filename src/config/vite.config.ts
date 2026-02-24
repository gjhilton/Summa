import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
	base: '/Summa/',
	root: resolve(__dirname, '../..'),
	plugins: [react()],
	css: {
		postcss: resolve(__dirname, 'postcss.config.cjs'),
	},
	server: {
		port: 8080,
		strictPort: true,
		fs: {
			allow: ['..'],
		},
	},
	build: {
		outDir: resolve(__dirname, '../../dist'),
		emptyOutDir: true,
	},
	resolve: {
		alias: {
			'@generated': resolve(__dirname, '../generated'),
		},
	},
});
