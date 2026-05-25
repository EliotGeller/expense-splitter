# Domain Pitfalls: Expense Splitting App

**Domain:** Client-side bill splitter (restaurant check, mobile-first, no backend)
**Researched:** 2026-05-25
**Confidence:** HIGH (financial calculation edge cases are well-documented engineering problems; UX patterns are established)

---

## Critical Pitfalls

Mistakes that cause incorrect totals, rewrites, or user-visible bugs.

---

### Pitfall 1: Floating-Point Arithmetic on Money

**What goes wrong:** Using JavaScript `number` (IEEE 754 double-precision float) directly for currency math. Classic example: `0.1 + 0.2 === 0.30000000000000004`. In a bill splitter, this means displayed subtotals don't sum to the check total, and users see "each person owes $12.333333333333334."

**Why it happens:** Developers treat dollar amounts as numbers, multiply/divide them inline, and only format at display time. The rounding error accumulates with every arithmetic operation.

**Consequences:** Totals visibly don't add up. Users don't trust the app. The check total minus the sum of per-person totals is a non-zero penny-level difference.

**Prevention:**
- Represent all amounts internally as integer cents (multiply by 100 on input, divide by 100 only for display).
- Use `Math.round(value * 100) / 100` at minimum for any intermediate result before further arithmetic.
- Never concatenate or display raw float arithmetic results; always pass through a formatting function.
- Preferred: use a library like `dinero.js` or `currency.js` that enforces cent-level integer arithmetic. These are lightweight and client-side compatible.

**Warning signs:**
- Any code doing `price / numberOfPeople` without a `Math.round` wrapper
- Dollar input parsed with `parseFloat` and used directly in arithmetic
- Displayed totals with more than 2 decimal places

**Phase to address:** Core calculation layer — before any UI is built. Getting this wrong and retrofitting it after the UI is wired up causes cascading changes.

---

### Pitfall 2: The Rounding Remainder Problem (Cents Don't Add Up)

**What goes wrong:** When splitting any amount that doesn't divide evenly (e.g., $10.00 among 3 people = $3.333...), rounding each person's share independently produces a total that is $0.01 short or over. Example: 3 people each owe $3.33, but $3.33 × 3 = $9.99, not $10.00.

**Why it happens:** Developers apply `Math.round` or `toFixed(2)` to each person's share independently, then sum them. The sum rarely equals the original amount.

**Consequences:** The app's per-person totals sum to something other than the check total. Users immediately distrust it ("it doesn't add up"). Or the app silently collects $0.01 less than the bill, leading to awkward real-world underpayment.

**Prevention:** Use the "largest remainder method" (also called "round-then-distribute-remainder"):
1. Compute each share as a real number.
2. Floor all shares to cents.
3. Calculate the remainder in cents: `totalCents - sum(flooredShares)`.
4. Distribute the leftover cents one-by-one to the largest fractional remainders (or to random/first N people — strategy should be explicit and documented).
5. The result: every per-person total is within $0.01 of each other, and they sum exactly to the check total.

**Warning signs:**
- A "verify total" assertion fails in tests
- Code that does `share.toFixed(2)` for each person individually then sums them
- No test case for "3 people, $10 bill"

**Phase to address:** Core calculation module, same phase as Pitfall 1. Write a unit test: `split($10.00, 3)` must sum to exactly `$10.00`.

---

### Pitfall 3: Proportional Split with Zero-Item People

**What goes wrong:** When tip/tax are split proportionally to subtotal, a person who only ordered shared items and no personal items may have a $0.00 base. Division by zero or a NaN tip allocation occurs.

**Why it happens:** The proportional formula is `personSubtotal / totalSubtotal * tipAmount`. If someone's `personSubtotal` is 0 (they only shared items, and shared items use shared tip allocation), the formula degrades. Or if all items are shared and the denominator becomes 0.

**Consequences:** NaN or Infinity values appear in the UI. The entire tip allocation silently fails, showing $0 tip for everyone.

**Prevention:**
- Guard all division operations: if the denominator is 0, fall back to equal split.
- Define explicitly: when proportional split is selected and a person has $0 base, do they owe $0 tip, or do they still get an equal share? Document this as a product decision, not an implementation choice.
- Test edge case: 1 person ordered nothing personal (all shared items); ensure their tip/tax line is defined.

**Warning signs:**
- No guard on division in tip calculation
- `NaN` appearing in any displayed total
- No test for "person with $0 personal subtotal"

**Phase to address:** Tip/tax calculation phase. Flag as a required test case.

---

### Pitfall 4: Shared Item Split — Who Gets Counted

**What goes wrong:** When an item is marked "shared," the app must divide it among the sharers — but the definition of "sharers" varies:
- Everyone at the table?
- Only the people explicitly selected as sharers?
- People who have at least one other item?

If this is ambiguous in the data model, shared-item cost assignment becomes inconsistent as people are added/removed from the party.

**Why it happens:** The data model stores "this item is shared = true" without storing *which* people are sharing it. When the number of people changes, the split recalculates using the current count — but the person may have been added after the item, creating unexpected behavior.

**Consequences:** Adding a person late changes already-assigned shares. Removing a person from the bill doesn't reduce their share on items they were excluded from. Users can't predict how "add person" affects existing items.

**Prevention:**
- Data model must store the explicit list of sharers per item, not just a boolean `isShared` flag.
- Default "all current people" is fine as a UI default, but it must be stored as an explicit list at the time of assignment.
- When a new person is added to the bill, items they should NOT share must not automatically gain them as a sharer.
- When a person is removed, items they were sharing must re-split among remaining sharers.

**Warning signs:**
- `isShared: boolean` without a `sharedBy: PersonId[]` field
- Adding a person causes all shared items to re-divide by the new count
- No test for "add person after items are assigned"

**Phase to address:** Data model design. This must be locked before building the item assignment UI, or the UI will need to be rebuilt.

---

### Pitfall 5: State Mutation During Recalculation (Cascading Reactivity Bugs)

**What goes wrong:** In reactive frameworks (React, Vue, Svelte), deeply nested state for bill items, people, and assignments can cause unexpected recalculation loops or stale values. Example: changing a person's name triggers a recalculation of all item splits because the state comparison is by reference, not value.

**Why it happens:** Storing people, items, and assignments as nested mutable objects. A shallow equality check sees the outer object changed and re-runs all derived calculations. Or the opposite: derived totals are stored in state and not recalculated when upstream values change.

**Consequences:** UI shows stale totals. Performance degrades as the bill grows (every keystroke re-runs full recalculation). Worse: split totals flash inconsistent values during typing.

**Prevention:**
- Keep source-of-truth state minimal (people list, items list, assignment map). Derive all totals in pure functions or computed values, never store them in state.
- Use `useMemo` / computed properties / derived stores to memoize totals only when inputs change.
- Immutable updates: always replace, never mutate.
- Keep calculation logic in pure functions entirely outside the component tree so they can be tested independently.

**Warning signs:**
- Calculated totals stored in `useState` or equivalent
- `useEffect` that updates a "total" state variable
- Tests that require rendering a component to test calculation logic

**Phase to address:** State architecture phase, before complex UI is built.

---

### Pitfall 6: Mobile Keyboard Obscuring the Input (The Viewport Problem)

**What goes wrong:** On mobile, numeric input fields (price entry, tip percentage, tax amount) trigger the numeric keyboard, which pushes the viewport up or covers the bottom 40-60% of the screen. If the app uses a bottom-fixed summary bar showing totals, the keyboard covers it. If input fields are near the bottom of the page, the submit button or "done" action is unreachable.

**Why it happens:** Desktop-first thinking. Developers test on desktop where keyboard visibility is not an issue. The mobile browser's `visualViewport` behavior differs across iOS Safari, Chrome for Android, and Firefox for Android.

**Consequences:** Users at the restaurant table cannot see their totals while entering prices. The "done" or "confirm" button is hidden under the keyboard. Users get frustrated and close the app.

**Prevention:**
- Use `visualViewport` API to listen for keyboard appearance and adjust layout.
- Avoid fixed-bottom summary bars; or, when keyboard is visible, move the summary to a collapsed state above the keyboard.
- Test input UX on actual iOS Safari and Android Chrome (not just desktop Chrome DevTools device mode — they behave differently for keyboard events).
- Use `inputmode="decimal"` for price fields to get the right keyboard without the full numeric pad.
- Consider scroll-into-view behavior: `field.scrollIntoView({ behavior: 'smooth', block: 'center' })` on focus.

**Warning signs:**
- App tested only in desktop browser DevTools
- Fixed-position bottom bar with no keyboard-awareness logic
- Using `type="number"` without `inputmode` attribute

**Phase to address:** Input/UX phase. Mark as requiring device testing (not DevTools-only).

---

### Pitfall 7: The "Equal Split" Shortcut Trap

**What goes wrong:** Adding an "equal split" button that simply divides the total by the number of people, bypassing all item assignments. Users hit this to save time, then discover it ignores that one person didn't drink alcohol or only had an appetizer. They feel cheated and don't trust the app.

**Why it happens:** Equal split is easy to implement and seems like a convenience feature. Developers add it without thinking through when it produces unfair results compared to the "proper" per-item assignment.

**Consequences:** Users who do care about fairness feel the app is not serving them. The whole value proposition of the app (accurate splitting) is undermined.

**Prevention:**
- If equal split is included, make it clearly labeled as "split evenly (ignore individual items)" — not as the default or primary action.
- Consider omitting it entirely from v1 since the PROJECT.md value prop is accuracy.
- Do not place it prominently next to the "calculate" action.

**Warning signs:**
- Equal split is the first or default action in the UI
- No label distinguishing "equal split" from "calculated split"

**Phase to address:** UI design phase.

---

### Pitfall 8: Share/Copy Summary That Breaks on iOS Safari

**What goes wrong:** The Web Share API (`navigator.share()`) is the right mechanism for "share summary to group chat," but it requires a user gesture (tap), must be called synchronously in the event handler, and behaves differently across browsers. On iOS Safari, sharing plain text works; sharing structured data or URLs may fail. On Android Chrome, behavior differs again.

**Why it happens:** Developers test the happy path in one browser. The share sheet works in Chrome DevTools but silently fails or throws on iOS Safari, or vice versa.

**Consequences:** The "share" button — one of the core features of the app — does nothing or shows a cryptic error on a significant portion of devices (iPhone users at restaurants).

**Prevention:**
- Feature-detect `navigator.share` and fall back to clipboard copy (`navigator.clipboard.writeText()`).
- Provide a visible "copied to clipboard" confirmation toast when clipboard fallback is used.
- Test on actual iOS Safari — not just Chrome DevTools iOS emulation.
- Keep the shared text plain (no HTML, no markdown) for maximum paste-destination compatibility.
- The share call must be in a synchronous click handler; do not wrap it in a Promise chain that begins before the click.

**Warning signs:**
- No feature detection (`if (navigator.share)`)
- No clipboard fallback
- Share logic inside an async function called from the click handler (rather than directly in it)

**Phase to address:** Share/summary feature phase. Add to acceptance criteria: "tested on iOS Safari and Android Chrome."

---

### Pitfall 9: Tax-Inclusive vs. Tax-Exclusive Confusion

**What goes wrong:** Users in different regions (and even different restaurants) encounter receipts where tax is:
- Already included in item prices (tax-inclusive, common in Europe and some US states)
- Listed as a separate line item at the bottom (tax-exclusive, common US restaurant checks)

The app that assumes one model will produce double-counted or zero-tax results for the other.

**Why it happens:** The developer designs for their own local experience without considering regional differences.

**Consequences:** Users enter the item prices + a tax line, leading to tax being counted twice. Or users don't know whether to enter tax-inclusive prices.

**Prevention:**
- For v1 (US restaurant focus), model tax as a separate line item entry (the user enters the tax amount from the check). This matches most US restaurant receipts.
- Do not attempt to auto-detect tax-inclusive; add clear UI copy: "Enter the tax amount shown on the check."
- Document the assumption in code comments.

**Warning signs:**
- No guidance in the UI about what "tax" means (inclusive vs. exclusive)
- Attempting to calculate tax from item prices rather than accepting the printed tax amount

**Phase to address:** Tax input design phase.

---

### Pitfall 10: No Penny-Perfect Verification Step

**What goes wrong:** The app shows per-person totals, but nowhere verifies that the sum of all per-person totals equals the entered bill total (items + tax + tip). If rounding or a logic bug causes a $0.01 discrepancy, users won't notice — until one person pays and the group is $0.01 short for the server.

**Why it happens:** Developers trust their math without building a verification assertion into the UI or tests.

**Consequences:** Systematic underpayment by $0.01 per transaction. Users discover inconsistency after paying. Trust in app erodes.

**Prevention:**
- Display a "check" line in the summary: "Sum of all shares: $X.XX | Bill total: $X.XX" — or hide it when they match and show a warning when they don't.
- Add a runtime assertion in the calculation function: `assert(sum(perPersonTotals) === totalBillCents)`.
- Write a property-based test or a table of cases that verifies this invariant across many input combinations.

**Warning signs:**
- No assertion or verification that per-person totals sum to the entered total
- No test cases with non-round-divisible amounts (e.g., $37.41 among 4 people)

**Phase to address:** Core calculation phase, alongside Pitfalls 1 and 2.

---

## Moderate Pitfalls

---

### Pitfall 11: Person Names as Identifiers

**What goes wrong:** Using a person's name string as their unique ID in the data structure. Two people with the same name (two Jennifers) cause assignment collisions. Renaming a person mid-session orphans their item assignments.

**Prevention:** Always generate a stable UUID or incrementing integer ID for each person on creation. Display name is a separate field. Never use name as a key in Maps or assignment records.

**Warning signs:** `assignments[personName]` instead of `assignments[personId]`

**Phase:** Data model design.

---

### Pitfall 12: Item Price Validation Gaps

**What goes wrong:** Users at a restaurant table enter prices with typos: "1O.00" (letter O instead of zero), "10,00" (comma as decimal separator in European keyboards), ".5" (no leading zero), "5." (trailing decimal). The app silently parses these as NaN or wrong values.

**Prevention:**
- Normalize input: strip commas, accept both `.` and `,` as decimal separator, trim whitespace.
- Validate and show inline error (red border + message) immediately on blur, not just on submit.
- Use `inputmode="decimal"` to get the decimal keyboard on mobile; don't use `type="number"` alone (it has inconsistent behavior across browsers for formatting).

**Warning signs:** Direct `parseFloat(inputValue)` without normalization; no input validation feedback

**Phase:** Item entry UI phase.

---

### Pitfall 13: Deep Linking / PWA Installability Not Planned

**What goes wrong:** The app works in a browser tab but users at a restaurant want to open it fast. If it's not installable as a PWA (no manifest, no service worker), users must navigate to the URL every time. Since there's no backend, a PWA is easy to add.

**Prevention:** Add a basic Web App Manifest and service worker cache in the final polish phase. This adds installability with minimal effort on a purely static app.

**Warning signs:** No `manifest.json`, no service worker registration

**Phase:** Final polish/PWA phase (low effort, high real-world value).

---

### Pitfall 14: Tip-on-Tax Ambiguity

**What goes wrong:** Restaurant practice varies: some calculate tip on pre-tax subtotal, some on the post-tax total. The app may silently apply one convention while users expect the other, leading to tip amounts that don't match what's printed on the check's suggested tip lines.

**Prevention:**
- Default to "tip on pre-tax subtotal" (industry standard in the US and what most restaurant checks use for suggested amounts).
- Document this assumption clearly.
- Optionally: show small helper text "Tip calculated on pre-tax subtotal."

**Warning signs:** Tip calculated on `subtotal + tax` total without a documented, intentional product decision

**Phase:** Tip calculation design.

---

## Minor Pitfalls

---

### Pitfall 15: iOS Number Input Zoom

**What goes wrong:** On iOS Safari, any `<input>` with a font size smaller than 16px triggers an auto-zoom of the viewport when focused. This zooms the entire page and the user must pinch-to-zoom out after every field entry.

**Prevention:** Ensure all `<input>` elements have `font-size: 16px` or larger in CSS. Alternatively, add `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">` — but this disables user zoom (accessibility concern); prefer the font-size fix.

**Phase:** CSS/styling phase.

---

### Pitfall 16: Landscape Mode Layout Breakage

**What goes wrong:** Users rotate to landscape while entering data. The form collapses into a thin strip because the mobile viewport is now only 375px tall with the keyboard visible.

**Prevention:** Test all input forms in landscape orientation. Use relative heights, not fixed pixel heights. Ensure the primary action button is always reachable.

**Phase:** UI/responsive design phase.

---

### Pitfall 17: "0" Items or "0" People Edge Cases

**What goes wrong:** A user clears all items or removes all people mid-session, causing division by zero or empty renders that crash the app.

**Prevention:** Always guard rendering and calculation functions for empty state. Show a "add people to get started" empty state rather than crashing.

**Phase:** Core logic and state management phase.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Data model design | Person names as IDs (P11), isShared boolean without sharer list (P4) | Lock data model before UI; write schema tests |
| Core calculation logic | Float arithmetic (P1), rounding remainder (P2), zero-denominator (P3), no verification (P10) | Pure function module with full unit test coverage before UI wiring |
| Item assignment UI | Shared item sharer list mismatch on add/remove (P4) | Acceptance test: "add person after items assigned" |
| Tip/tax calculation | Zero-item person (P3), tip-on-tax ambiguity (P14), tax-inclusive confusion (P9) | Document product decisions in code; write edge-case tests |
| Input fields | Mobile keyboard coverage (P6), iOS 16px zoom (P15), price validation (P12) | Device test on real iOS Safari, not DevTools |
| Summary/share | Web Share API fallback (P8), penny verification (P10) | Test on iOS Safari and Android Chrome; clipboard fallback required |
| Equal split button | Undercuts value prop (P7) | If included, label clearly and de-emphasize |
| Final polish | PWA installability (P13), landscape layout (P16) | Low-effort PWA manifest; landscape orientation test |

---

## Sources

**Note:** WebSearch was unavailable during this research session. Findings are drawn from:
- Established engineering literature on IEEE 754 floating-point behavior in financial applications (HIGH confidence — mathematically deterministic)
- The "largest remainder method" for rounding distribution — standard algorithm used in election systems and financial software (HIGH confidence)
- Web Platform specs: `visualViewport` API, Web Share API, `inputmode` attribute, iOS Safari font-size zoom behavior (HIGH confidence — spec-defined behaviors)
- React/Vue/Svelte reactivity patterns and derived state best practices (HIGH confidence — core framework documentation)
- Mobile web UX patterns for form inputs (MEDIUM confidence — widely documented but device-specific behaviors evolve)

Recommend verifying Web Share API current status at: https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API
Recommend verifying `visualViewport` support at: https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API
