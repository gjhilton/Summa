/**
 * Normalize user input to standard lowercase Roman numeral form.
 * Steps: lowercase, u→v, j→i.
 */
export function normalizeEarlyModernInput(input: string): string {
	return input.toLowerCase().replace(/u/g, 'v').replace(/j/g, 'i');
}

/**
 * Format a canonical (integerToRoman) lowercase Roman numeral string
 * into early modern accounting style.
 *
 * Rules:
 * 1. Replace iv → iiij
 * 2. In every contiguous run of i/j chars, replace the last i with j
 * 3. Uppercase l/c/d/m only while no lowercase i/j/v/x has yet appeared;
 *    once a small numeral is seen, all subsequent l/c/d/m stay lowercase.
 *    e.g. ccvij → CCvij, xcvij → xcvij, mcmxciiij → MCMxciiij
 */
export function formatEarlyModernOutput(roman: string): string {
	// Step 1: expand iv to iiij
	let result = roman.replace(/iv/g, 'iiij');

	// Step 2: for every contiguous run of i/j, replace last i with j
	result = result.replace(/[ij]+/g, m => {
		const allI = m.replace(/j/g, 'i');
		return allI.slice(0, -1) + 'j';
	});

	// Step 3: uppercase l/c/d/m only if no lowercase i/j/v/x has preceded them
	let seenLowercase = false;
	result = result.replace(/[ijvxlcdm]/g, c => {
		if ('ijvx'.includes(c)) {
			seenLowercase = true;
			return c;
		}
		if (!seenLowercase) return c.toUpperCase();
		return c;
	});

	return result;
}
