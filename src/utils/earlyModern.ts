/**
 * Normalize user input to standard lowercase Roman numeral form.
 * Steps: lowercase, u→v, j→i.
 */
export function normalizeEarlyModernInput(input: string): string {
	return input.toLowerCase().replace(/u/g, 'v').replace(/j/g, 'i');
}

/** Step 1: expand subtractive pairs to additive form (ix→viiii, iv→iiii). */
function expandSubtractivePairs(roman: string): string {
	return roman.replace(/ix/g, 'viiii').replace(/iv/g, 'iiii');
}

/** Step 2: in every contiguous run of i/j chars, replace the last i with j. */
function applyJRule(roman: string): string {
	return roman.replace(/[ij]+/g, m => {
		const allI = m.replace(/j/g, 'i');
		return allI.slice(0, -1) + 'j';
	});
}

/**
 * Step 3: uppercase l/c/d/m only while no i/j/v/x has yet appeared left-to-right.
 * Once a small numeral (i/j/v/x) is seen, subsequent l/c/d/m stay lowercase.
 * e.g. ccvij → CCvij, xcvij → xcvij, mcmxciiij → MCMxciiij
 */
function applyConditionalUppercase(roman: string): string {
	let seenSmall = false;
	return roman.replace(/[ijvxlcdm]/g, c => {
		if ('ijvx'.includes(c)) {
			seenSmall = true;
			return c;
		}
		return seenSmall ? c : c.toUpperCase();
	});
}

/**
 * Format a canonical (integerToRoman) lowercase Roman numeral string
 * into early modern accounting style.
 */
export function formatEarlyModernOutput(roman: string): string {
	return applyConditionalUppercase(applyJRule(expandSubtractivePairs(roman)));
}
