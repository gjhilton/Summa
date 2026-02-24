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
					ink: { value: '#111827' },
					paper: { value: 'white' },
					muted: { value: '#f9fafb' },
					border: { value: '#d1d5db' },
					primary: { value: '#1e40af' },
					primaryBg: { value: '#dbeafe' },
					error: { value: '#ef4444' },
					errorBg: { value: '#fee2e2' },
					errorText: { value: '#991b1b' },
					errorLineBg: { value: '#fff5f5' },
					divider: { value: '#000000' },
				},
				fontSizes: {
					s: { value: '0.75em' },
					m: { value: '1rem' },
					l: { value: '1.25rem' },
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
				sizes: {
					field: { value: '5rem' },
				},
			},
		},
	},
	outdir: 'dist/styled-system',
});
