import { defineConfig } from '@pandacss/dev';

export default defineConfig({
	preflight: true,
	include: ['./src/**/*.{ts,tsx}'],
	exclude: [],
	theme: {
		extend: {
			breakpoints: {
				desktop: '860px',
			},
			tokens: {
				colors: {
					error: { value: 'red' },
					ink: { value: 'black' },
					paper: { value: 'white' },
					primary: { value: '#008cff' },
					border: { value: '{colors.ink}' },
				},
				fontSizes: {
					s: { value: '0.875rem' },
					m: { value: '1.25rem' },
					l: { value: '1.375rem' },
					xl: { value: '2rem' },
				},
				spacing: {
					xs: { value: '0.25rem' },
					sm: { value: '0.5rem' },
					md: { value: '0.75rem' },
					lg: { value: '1rem' },
					xl: { value: '1.25rem' },
					'2xl': { value: '1.5rem' },
					'3xl': { value: '2rem' },
				},
				borderWidths: {
					thin: { value: '1px' },
					medium: { value: '2px' },
				},
				radii: {
					sm: { value: '4px' },
					md: { value: '8px' },
				},
			},
		},
	},
	outdir: 'dist/styled-system',
});
