# Work Package Brief: Add `ItemWithQuantity`

## 0. Preliminary Refactor

* Rename the existing `Line` component to `Item`.
* Update all references; no functional changes.

---

## 1. New Item Type

* Introduce `ItemWithQuantity`.
* Creation via a new **“Add Item With Quantity”** button.
* `quantity` field defaults to `1` on creation.
* Internal implementation (subclass, variant, etc.) is at implementer’s discretion; **behavioural invariants below must be satisfied**.
* The visible field label for 'quantity' is '@' (not superscript), The ARIA labl is 'quantity'.
* The quantity is input in Roamn numerals as per other fields. The multiplied ite subtotal is output as Roamn numberals in the same was as totals.

---

## 2. Structure & Display

* Row fields (left → right): `[quantity] @ [l] [s] [d]`.
* Subtotal line displayed directly beneath input row.
* Subtotal row includes **all same columns** as input row, including `l`, `s`, `d`, and `Remove`.
* Columns must **align exactly** with the input row.
* Subtotal visually matches grand total **except not boldface**.
* Remove control on subtotal removes the entire item (row + subtotal).

---

## 3. Calculation Rules

* Compute base l/s/d value as for normal `Item`.
* Convert to pence.
* Multiply by `quantity`.
* Convert result back to normalized l/s/d.
* Subtotal is **always displayed**, even if `quantity = 1`.
* Multiplied subtotal is the line’s canonical value for:

  * Grand total
  * Any downstream calculations
  * Show Working display

---

## 4. Validation

* `quantity` must be a **strictly positive integer** (>0).
* Invalid `quantity` or l/s/d triggers **validation error**, following same behaviour as existing `Item`.
* Invalid `ItemWithQuantity` contributes to totals exactly as invalid `Item` currently does.

---

## 5. Show Working

* Follows **existing style** exactly.
* Only addition: a **quantity multiplier** at the start of calculation steps.
* Updates whenever regular `Item` calculations update.

---

## 6. Interaction & Updates

* Subtotal updates **following the same triggers/timing as existing `Item` rows** (live or on blur).
* Creation and removal behave identically to normal `Item` rows.
* UI/UX must be consistent with existing alignment, spacing, and styling conventions.
