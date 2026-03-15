import { defineConfig } from '@pandacss/dev';

export default defineConfig({
	preflight: true,
	include: ['./src/**/*.{ts,tsx,jsx}'],
	exclude: [],
	jsxFramework: 'react',
	outdir: 'src/styled-system',
	theme: {
		extend: {
			tokens: {
				fonts: {
					joscelyn: { value: 'Joscelyn, serif' },
				},
			},
		},
	},
	globalCss: {
		body: {
			fontFamily: "'Libre Caslon Text', serif",
		},
	},
});
