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
					ink: { value: 'black' },
					paper: { value: 'white' },
					muted: { value: '#f9fafb' },        // read-only field background
					border: { value: '{colors.ink}' },
					primary: { value: '#008cff' },
					error: { value: 'red' },
					errorBg: { value: '#fee2e2' },       // error input background
					errorLineBg: { value: '#fff5f5' },   // error line background
					toggleActive: { value: '#34c759' },  // toggle on
					toggleInactive: { value: '#d1d1d6' }, // toggle off
				},
				fonts: {
					joscelyn: { value: 'Joscelyn, serif' },
					body: { value: "'Libre Caslon Text', serif" },
				},
				fontSizes: {
					s: { value: '0.875rem' }, // 14px — labels, small UI
					m: { value: '1.25rem' },  // 20px — body, buttons, fields
					l: { value: '1.375rem' }, // 22px — emphasis
					xl: { value: '2rem' },    // 32px — headings
				},
				spacing: {
					tiny: { value: '0.125rem' }, // 2px
					xs: { value: '0.25rem' },    // 4px
					sm: { value: '0.5rem' },     // 8px
					md: { value: '0.75rem' },    // 12px
					lg: { value: '1rem' },       // 16px
					xl: { value: '1.25rem' },    // 20px
					'2xl': { value: '1.5rem' },  // 24px
					'3xl': { value: '2rem' },    // 32px
					'4xl': { value: '3rem' },    // 48px
					'5xl': { value: '4rem' },    // 64px
				},
				borderWidths: {
					thin: { value: '1px' },
					medium: { value: '2px' },
					thick: { value: '3px' },
					heavy: { value: '4px' },
				},
				radii: {
					sm: { value: '4px' },
					md: { value: '8px' },
					lg: { value: '16px' },
					full: { value: '9999px' },
				},
				sizes: {
					field: { value: '6rem' },
				},
			},
		},
	},
	outdir: 'dist/styled-system',
});
