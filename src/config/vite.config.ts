import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createRequire } from 'module';
import { marked, Tokens } from 'marked';

const require = createRequire(import.meta.url);
const { version } = require('../../package.json') as { version: string };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

marked.use({
	renderer: {
		// Allow <kbd> through; strip all other raw HTML.
		html({ text }: Tokens.HTML | Tokens.Tag): string {
			return /^<\/?kbd>$/i.test(text.trim()) ? text : '';
		},
	},
});

const markdownPlugin: Plugin = {
	name: 'vite-plugin-markdown-to-html',
	transform(code, id) {
		if (!id.endsWith('.md')) return null;
		const html = marked.parse(code) as string;
		return { code: `export default ${JSON.stringify(html)};`, map: null };
	},
};

export default defineConfig({
	base: '/Summa/',
	root: resolve(__dirname, '../..'),
	plugins: [markdownPlugin, react()],
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
	define: {
		__APP_VERSION__: JSON.stringify(version),
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, '..'),
			'@generated': resolve(__dirname, '../generated'),
		},
	},
});
