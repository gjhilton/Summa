import { defineConfig } from '@pandacss/dev';

export default defineConfig({
	preflight: true,
	include: ['./src/**/*.{ts,tsx,jsx}'],
	exclude: [],
	jsxFramework: 'react',
	outdir: 'src/styled-system',
	globalCss: {
		body: {
			fontFamily: "'Libre Baskerville', serif",
		},
	},
});
