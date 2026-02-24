Below is a **machine-optimized implementation brief for Claude**.

It is structured for:

* Deterministic execution
* Minimal ambiguity
* Clear sequencing
* Reduced interpretation overhead
* Strict invariants
* Explicit failure conditions

This is not prose documentation.
It is an execution contract.

---

# SUMMA — CLAUDE EXECUTION SPEC

## GLOBAL RULES

1. Use TypeScript everywhere.
2. Use functional React components only.
3. No class components.
4. No external Roman numeral libraries.
5. No floating point arithmetic.
6. All conversions must be pure functions.
7. All display components must be stateless.
8. All state must live in a single container: `CalculationData`.
9. Do not implement UI until all utility tests pass.
10. Do not infer behavior not specified here.

---

# EXECUTION ORDER (MANDATORY)

You MUST follow this order:

1. Initialize project
2. Implement currency utilities
3. Implement Roman utilities
4. Implement early modern utilities
5. Write and pass all unit tests
6. Define TypeScript state types
7. Implement stateless UI components
8. Implement state container
9. Write integration tests
10. Verify build + lint clean

Do not reorder.

---

# 1. PROJECT INITIALIZATION

Create:

* Vite
* React
* TypeScript
* Vitest

Install:

* PandaCSS
* ESLint
* Prettier

Copy config from sibling project `Sharpie`:

* vite config
* Panda config
* ESLint config
* Prettier config

Do not modify copied configuration unless compilation fails.

---

# 2. DIRECTORY STRUCTURE (REQUIRED)

```
src/
  components/
  state/
  utils/
  types/
  tests/
```

No additional architectural layers.

---

# 3. CURRENCY UTILITIES (FIRST)

File: `utils/currency.ts`

## Required Functions

```ts
lsdToPence(l: number, s: number, d: number): number
penceToLsd(total: number): { l: number; s: number; d: number }
```

## Constants

* 1 pound = 240 pence
* 1 shilling = 12 pence

## Rules

* All inputs must be integers ≥ 0
* Throw error if negative
* Throw error if non-integer

## Tests Required

* Zero values
* Large values
* Boundary transitions (12d → 1s, 20s → 1l)
* Invalid input throws

Do not proceed until tests pass.

---

# 4. ROMAN UTILITIES

File: `utils/roman.ts`

## Allowed Characters

`i v x l c d m` (lowercase only internally)

Uppercase allowed in input but normalize to lowercase.

## Required Functions

```ts
romanToInteger(input: string): number
integerToRoman(value: number): string
isValidRoman(input: string): boolean
```

## Validation Rules

* Empty string → invalid (handled externally)
* Reject characters outside roman set
* Reject illegal subtractive combinations
* Reject:

  * vv
  * ll
  * dd
* Allow:

  * additive forms (iiii)
  * subtractive forms (iv)
* Must support early modern input variant:

  * iiij

## Parsing Algorithm

Use left-to-right scan:

If next value > current value → subtract
Else → add

Do not use regex-only validation.

## integerToRoman Rules

* Generate canonical subtractive Roman form internally.
* Example:

  * 4 → iv
  * 9 → ix

Early modern formatting handled separately.

## Tests Required

* Additive forms
* Subtractive forms
* Mixed forms
* Invalid sequences
* Large values
* Edge cases (1, 4, 9, 40, 90, 400, 900)

Do not proceed until all tests pass.

---

# 5. EARLY MODERN UTILITIES

File: `utils/earlyModern.ts`

## Required Functions

```ts
normalizeEarlyModernInput(input: string): string
formatEarlyModernOutput(roman: string): string
```

---

## Input Normalization

Steps in order:

1. Convert to lowercase
2. Replace:

   * u → v
   * j → i

No other transformations.

---

## Output Formatting

Input: canonical Roman (from integerToRoman)

Apply:

1. Replace:

   * iv → iiij
2. For every contiguous sequence of `i`,
   replace last `i` with `j`.

Examples:

i → j
ii → ij
iii → iij
xi → xj
ix → jx

---

## Output Casing Rules

Lowercase:

* i, j, v, x

Uppercase:

* L, C, D, M

Apply casing after transformations.

---

## Tests Required

* u/j normalization
* iv replacement
* i → j rule
* casing rule
* edge cases

Do not proceed until all tests pass.

---

# 6. TYPE DEFINITIONS

File: `types/calculation.ts`

Define strict interfaces.

Calculation must always contain ≥ 2 lines.

Each line must contain:

* error flag
* literal strings
* normalized Roman strings
* integer values
* pence values
* total pence
* operation (currently "+", constant)

No optional fields.

---

# 7. UI COMPONENTS (STATELESS ONLY)

Components:

* Button
* InputField
* Field
* Line
* Total
* Calculation

Rules:

* No business logic inside components
* No conversion logic
* No total calculation
* Pure props → JSX

InputField:

* Accept string
* Show error state via prop
* Allow empty string

Line:

* If any field error → visual error state

---

# 8. STATE CONTAINER

File: `state/CalculationData.tsx`

This is the only stateful component.

## Responsibilities

* Store array of LineState
* Handle all conversions
* Handle validation
* Compute totals
* Exclude error lines from grand total

## Required Callbacks

```ts
updateField(lineId: string, field: "l" | "s" | "d", value: string): void
addLine(): void
removeLine(lineId: string): void
resetCalculation(): void
```

---

## Recalculation Pipeline (MANDATORY ORDER)

On field update:

1. Update literal
2. If empty → value = 0
3. Normalize early modern input
4. Validate Roman
5. If invalid:

   * set line.error = true
   * stop further processing
6. Convert Roman → integer
7. Convert integer → pence
8. Compute line total
9. Recompute grand total
10. Convert grand total:

    * pence → lsd
    * lsd → roman
    * roman → early modern

All recalculation must be synchronous.

---

# 9. RESET RULE

After reset:

* Exactly 2 empty lines
* No errors
* Total = 0
* No residual state

---

# 10. INTEGRATION TESTS

Test:

* Multi-line summation
* Removal of line
* Reset behavior
* Error line exclusion
* Empty line handling

---

# 11. FAILURE CONDITIONS

Implementation is invalid if:

* Any floating point arithmetic used
* Any external Roman library used
* Any state exists outside CalculationData
* UI component performs conversion
* Tests below 95% coverage
* TypeScript errors exist
* ESLint errors exist
* Build fails

---

# 12. COMPLETION CRITERIA

All of the following must be true:

* All unit tests pass
* All integration tests pass
* `npm run build` succeeds
* `npm run lint` passes
* `npm run test` passes
* App runs locally without console warnings
* App deploys to GitHub Pages successfully
