# Research Summary: Expense Splitter

**Synthesized:** 2026-05-25
**Sources:** STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md

---

## Recommended Stack

| Layer | Choice | Version | Rationale |
|-------|--------|---------|-----------|
| Framework | React + TypeScript | 19.2.x / 6.0 | Industry standard; TS catches the exact category of bugs this app is vulnerable to (wrong field names, type mismatches in calculations) |
| Build | Vite | 6.x | Sub-second HMR, zero-config for React+TS, native ES modules |
| Styling | Tailwind CSS | 4.3 | Mobile-first by default, Vite-native plugin, no PostCSS config needed |
| State | useReducer + Context | (built-in) | Single state atom pattern; centralizes all mutations as pure, testable functions. No external library needed for this complexity. |
| Math | Integer cents (plain JS) | — | Store all money as integers; eliminates floating-point rounding bugs entirely |
| Share | Web Share API + Clipboard fallback | (browser) | Native OS share sheet on mobile; zero dependencies |
| Testing | Vitest + Testing Library | 3.x | Native Vite integration; Jest-compatible API |
| Deploy | Vercel or Netlify | — | Zero-config static hosting; free tier sufficient |

**Do NOT use:** Next.js (no server needed), Redux/Zustand (overkill), decimal.js (integer cents sufficient), CSS Modules (more verbose for responsive mobile).

---

## Table Stakes Features

1. Add people by name
2. Add line items with prices
3. Assign items to one or more people (shared = split evenly among assignees)
4. Tax entry (amount or percentage) with split method toggle
5. Tip entry (15/18/20/25% presets + custom) with split method toggle
6. Per-person total summary with penny-perfect rounding
7. Totals must sum exactly to the bill (largest remainder method)
8. Mobile-optimized input (inputmode="decimal", large touch targets)

## Key Differentiators

- **Proportional tip/tax split** — "I only got a salad, why do I pay the same tip?" Most valuable differentiator.
- **Copy/share summary** — paste into group chat so everyone sees what they owe.
- **Even-split shortcut** — for groups that don't care about per-item fairness. Low cost to add.

## Anti-Features (Do NOT Build)

- User accounts / authentication
- Receipt OCR / photo scan
- Payment integration (Venmo/CashApp)
- Persistent history / saved splits
- Debt tracking across bills
- Multi-currency support

---

## Architecture

**Pattern:** Single-page app with unidirectional data flow. Four components:

```
UI Layer → State Store → Calculation Engine → Summary/Share Layer
```

**Critical architectural decisions:**
1. **Pure Calculation Engine** — all math in pure functions, no side effects, fully unit-testable. Built and tested BEFORE any UI.
2. **Single State Atom** — one BillState object (people, items, assignments, tip/tax config). No per-screen local state.
3. **Integer Cents** — all money stored as integers internally. Display formatting at the boundary only.
4. **Derived, never stored** — totals are computed fresh from source state, never stored in state.

**Data model:**
- Person: `{ id, name }`
- Item: `{ id, name, priceCents }`
- Assignments: `Record<itemId, personId[]>` (explicit sharer lists, NOT boolean isShared)
- ChargeConfig: `{ method, value, splitMethod }`

**Navigation:** Linear flow (People → Items → Assign → Charges → Summary) with back navigation always available.

---

## Top Pitfalls to Guard Against

| # | Pitfall | Severity | When to Address |
|---|---------|----------|-----------------|
| P1 | Float arithmetic on money | Critical | Core calculation phase |
| P2 | Rounding remainder (cents don't add up) | Critical | Core calculation phase |
| P3 | Proportional split with $0 subtotal person | Critical | Tip/tax calculation |
| P4 | Shared items need explicit sharer list, not boolean | Critical | Data model design |
| P5 | Storing derived state (computed totals in state) | High | State architecture |
| P6 | Mobile keyboard covering inputs | High | Input UI phase |
| P8 | Web Share API needs clipboard fallback | High | Share feature |
| P11 | Person names as identifiers (need UUIDs) | High | Data model design |
| P12 | Price input validation gaps | Medium | Item entry UI |
| P14 | Tip-on-tax ambiguity | Medium | Tip calculation |
| P15 | iOS input font-size zoom | Medium | CSS/styling |

---

## Recommended Build Order

```
1. Data model + TypeScript types (foundation)
2. Calculation Engine + unit tests (highest risk — validate early)
3. State Store (useReducer + Context)
4. People Screen
5. Items Screen
6. Assign Screen (most complex UI)
7. Charges Screen (tip/tax config)
8. Summary Screen + Share
```

The Calculation Engine must be complete and tested before any UI is built. This isolates the highest-risk component (math correctness) and prevents cascading rewrites.

---

## Open Questions

1. When proportional split is selected and a person has $0 personal subtotal, do they owe $0 tip or an equal share? (Product decision needed)
2. Include "even split" shortcut in v1? (PROJECT.md value prop is accuracy — could undercut it)
3. Tip calculated on pre-tax or post-tax subtotal? (Default: pre-tax, US standard)

---

## Confidence Assessment

| Area | Level |
|------|-------|
| Stack choices | HIGH |
| Feature landscape | MEDIUM-HIGH |
| Architecture patterns | HIGH |
| Pitfall identification | HIGH |
| Version numbers (Vite/Vitest) | MEDIUM |
