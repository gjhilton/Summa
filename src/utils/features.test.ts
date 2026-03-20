import { describe, it, expect } from 'vitest';
import { FEATURES } from '@/utils/features';

describe('FEATURES', () => {
	it('has persistCalculation as a boolean', () => {
		expect(typeof FEATURES.persistCalculation).toBe('boolean');
	});

	it('persistCalculation is false in test environment (VITE_PERSIST not set to "true")', () => {
		// In the test environment, VITE_PERSIST is not set, so this should be false
		expect(FEATURES.persistCalculation).toBe(false);
	});
});
