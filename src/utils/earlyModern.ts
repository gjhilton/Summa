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
 * 3. Apply casing: l→L, c→C, d→D, m→M; i, j, v, x stay lowercase
 */
export function formatEarlyModernOutput(roman: string): string {
	// Step 1: expand iv to iiij
	let result = roman.replace(/iv/g, 'iiij');

	// Step 2: for every contiguous run of i/j, replace last i with j
	result = result.replace(/[ij]+/g, m => {
		const allI = m.replace(/j/g, 'i');
		return allI.slice(0, -1) + 'j';
	});

	// Step 3: apply uppercase to l, c, d, m
	result = result.replace(/[lcdm]/g, c => c.toUpperCase());

	return result;
}
