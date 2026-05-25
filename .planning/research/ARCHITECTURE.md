# Architecture Patterns

**Domain:** Client-side bill splitting web app
**Researched:** 2026-05-25
**Confidence:** HIGH (well-understood domain; constraints fully specified in PROJECT.md)

## Recommended Architecture

Single-page application with a unidirectional data flow. No backend. All state lives in the browser; computation is pure functions over that state. The UI is a thin layer that renders derived totals from a single source of truth.

```
┌─────────────────────────────────────────┐
│               UI Layer                  │
│  (Screens: People → Items → Charges →   │
│   Summary)                              │
└────────────────┬────────────────────────┘
                 │ user events
                 ▼
┌─────────────────────────────────────────┐
│            State Store                  │
│  people[], items[], assignments{},      │
│  tipConfig, taxConfig                   │
└────────────────┬────────────────────────┘
                 │ state snapshot
                 ▼
┌─────────────────────────────────────────┐
│         Calculation Engine              │
│  (pure functions — no side effects)     │
│  subtotals → shared splits →            │
│  tip/tax → per-person totals            │
└────────────────┬────────────────────────┘
                 │ results{}
                 ▼
┌─────────────────────────────────────────┐
│          Summary / Share Layer          │
│  Renders final totals; formats share    │
│  text for clipboard / native share      │
└─────────────────────────────────────────┘
```

---

## Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| **State Store** | Single source of truth for all user input (people, items, assignments, tip/tax config). Owns all mutations. | UI Layer (reads + dispatches); Calculation Engine (provides snapshot) |
| **UI Layer** | Renders current state; captures user input; navigates between screens. Zero calculation logic. | State Store (dispatch events); Calculation Engine (reads derived results) |
| **Calculation Engine** | Pure functions that take a state snapshot and return per-person breakdowns. No I/O. | Receives state from Store; returns results to UI/Summary |
| **Summary / Share Layer** | Formats final totals as human-readable text; triggers clipboard copy or native share sheet. | Receives results from Calculation Engine; calls browser Web Share API |

### What Each Component Does NOT Do

- State Store does not compute totals — that is the Calculation Engine's job.
- Calculation Engine does not mutate state or call APIs.
- UI Layer does not implement any math — it only reads computed results.
- Summary Layer does not store anything persistently (v1 explicitly has no persistence).

---

## Data Model

### Core Entities

```typescript
// A person at the table
type Person = {
  id: string;        // uuid or short random id
  name: string;
};

// A line item from the receipt
type Item = {
  id: string;
  name: string;
  price: number;     // always in dollars (float); rounding handled at output time
};

// Who ordered what
// itemId → personId[] (one or more people sharing this item)
type Assignments = Record<string, string[]>;

// Tip and tax are parallel structures
type ChargeConfig = {
  method: "amount" | "percent";   // how the user entered the value
  value: number;                  // the raw input value
  splitMethod: "equal" | "proportional";
};

// Top-level application state
type BillState = {
  people: Person[];
  items: Item[];
  assignments: Assignments;
  tip: ChargeConfig;
  tax: ChargeConfig;
};
```

### Derived / Computed Shape (Calculation Engine output)

```typescript
type PersonResult = {
  personId: string;
  name: string;
  itemSubtotal: number;      // sum of items assigned (shared items divided)
  tipShare: number;
  taxShare: number;
  total: number;             // itemSubtotal + tipShare + taxShare
};

type BillResult = {
  grandTotal: number;        // sum of all item prices + tip + tax (cross-check)
  perPerson: PersonResult[];
  roundingAdjustment: number; // cents redistributed to prevent penny gaps
};
```

---

## Data Flow

### Input Phase (stepwise, user drives forward)

```
User names people
        ↓
User adds receipt items + prices
        ↓
User assigns each item to one or more people
        ↓
User sets tip (amount or %, split method)
        ↓
User sets tax (amount or %, split method)
        ↓
Calculation Engine runs (triggered reactively or on demand)
        ↓
Summary screen shows per-person totals
        ↓
User copies/shares summary text
```

### Calculation Flow (inside Calculation Engine)

```
1. For each item:
   - Find assignees from Assignments map
   - Divide item.price evenly among assignees
   - Accumulate into each person's itemSubtotal

2. Compute bill subtotal = sum(item.price for all items)

3. Compute tip amount:
   - If method=percent: tip = subtotal * (value/100)
   - If method=amount: tip = value

4. Compute tax amount (same logic as tip)

5. Distribute tip across people:
   - If splitMethod=equal: each person gets tip / people.length
   - If splitMethod=proportional: each person gets tip * (itemSubtotal / subtotal)

6. Same distribution for tax.

7. Sum each person: total = itemSubtotal + tipShare + taxShare

8. Rounding correction:
   - Computed grand total = sum of all person totals
   - Expected grand total = subtotal + tip + tax
   - Difference (±1–2 cents) assigned to the person with the highest total
```

### Rounding Strategy

Distribute in cents (integer arithmetic internally, display as dollars). The "largest remainder" or "banker's rounding" approach is standard for this domain. The critical invariant is: `sum(person.total) == grandTotal` to the cent. This must be enforced as a unit-testable assertion in the Calculation Engine.

---

## Screen / Navigation Structure

The app has a linear flow with the ability to go back:

```
[People Screen]
  → add/remove people by name
  → can reorder (drag or up/down)

[Items Screen]
  → add/edit/remove line items (name + price)

[Assign Screen]
  → for each item, tap which people share it
  → "all" shortcut assigns everyone

[Charges Screen]
  → tip: preset buttons (15/18/20%) or custom field
  → tip split method toggle (equal / proportional)
  → tax: enter amount or percentage
  → tax split method toggle (equal / proportional)

[Summary Screen]
  → per-person totals (read-only)
  → copy/share button
```

Navigation is linear but not strictly wizard-locked — users need to go back (e.g., add a person they forgot, fix an item price). All screens read from the same state store, so edits to earlier steps automatically propagate to summary.

---

## Patterns to Follow

### Pattern 1: Pure Calculation Engine

**What:** Extract all math into functions that take state and return results with no side effects.

**When:** Always. This is the most important architectural decision for this app.

**Why:** The math is the hard part (rounding, proportional splits, shared-item division). Pure functions are trivially unit-testable. UI bugs stay in the UI; math bugs stay in the math — they don't tangle.

```typescript
// Good — pure, testable
function calculateBill(state: BillState): BillResult { ... }

// Bad — math inside a React component
function SummaryComponent({ state }) {
  const total = state.items.reduce(...) * (1 + tipPercent); // don't do this
}
```

### Pattern 2: Single State Atom

**What:** All mutable app state in one top-level object, passed down or accessed via context/store.

**When:** Always for this app size.

**Why:** Avoids synchronization bugs between independently managed pieces of state. When the state is one object, the calculation engine always sees a consistent snapshot. This is especially important because changing who shares an item affects every downstream calculation.

### Pattern 3: Optimistic In-Place Editing

**What:** Edits to items/people/assignments update state immediately; summary recalculates in real time.

**When:** For all fields.

**Why:** Users at a restaurant table need instant feedback. Showing "$0.00" until a "Calculate" button is pressed creates unnecessary friction and confusion.

### Pattern 4: Integer Arithmetic for Money

**What:** Store and compute all money values as integers in cents internally; convert to dollars only for display.

**When:** All internal calculations.

**Why:** Floating point arithmetic on dollars causes penny errors. `0.1 + 0.2 !== 0.3` in JavaScript. `10 + 20 = 30` in integer cents. This is the single most common source of incorrect totals in bill splitting apps.

```typescript
// Bad
const total = 12.50 + 8.75; // may produce 21.249999...

// Good
const totalCents = 1250 + 875; // 2125, then display as (2125/100).toFixed(2)
```

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Calculated State in the Store

**What:** Storing computed values (per-person totals) in the state store alongside source data.

**Why bad:** Creates a synchronization problem — source data and derived data can diverge if a mutation path forgets to recompute. This is subtle and produces wrong totals silently.

**Instead:** Derive totals freshly from source state every render. For this app's data size (< 20 items, < 20 people), recalculating on every state change is imperceptibly fast.

### Anti-Pattern 2: Floating Point Dollar Arithmetic

**What:** Using `number` in dollars (e.g., `12.99`) for all internal math.

**Why bad:** Floating point representation errors accumulate and produce outputs like "$21.99 + $8.01 = $30.000000000000004", which then rounds incorrectly.

**Instead:** Integer cents internally; format for display only at the boundary (see Pattern 4).

### Anti-Pattern 3: Per-Screen Local State for Items/People

**What:** Keeping item list state inside the Items screen component, people state inside the People screen component.

**Why bad:** When the user navigates back and edits, the assignment screen still references stale person IDs. Cross-screen consistency requires a single shared store.

**Instead:** All mutable data in the single state atom (Pattern 2).

### Anti-Pattern 4: Blocking Linear Navigation

**What:** Wizard UI that prevents going back to earlier steps once you advance.

**Why bad:** Users constantly discover they forgot someone or misread a price. Forcing them to restart is a table-side UX disaster.

**Instead:** Back navigation is always available; all screens are always consistent with the current state.

---

## Suggested Build Order

Dependencies flow from data model outward to UI. Build in this order:

```
1. Data model + types
   (Person, Item, Assignments, ChargeConfig, BillState)
   — No dependencies. Foundation for everything.

2. Calculation Engine (pure functions + unit tests)
   (subtotals, shared splits, tip/tax distribution, rounding)
   — Depends only on types. Test thoroughly before any UI exists.
   — This is the highest-risk component (math correctness). Validate early.

3. State Store (holds BillState, exposes mutations)
   (addPerson, removePerson, addItem, assignItem, setTip, setTax)
   — Depends on types. Wraps mutations to keep them consistent.

4. People Screen
   — First screen, no upstream dependencies within the app.
   — Depends on State Store.

5. Items Screen
   — Depends on State Store (reads people list for context, adds items).

6. Assign Screen
   — Depends on both people[] and items[] from State Store.
   — Most complex UI: mapping items to sets of people.

7. Charges Screen (tip/tax config)
   — Depends on State Store. No dependency on Assign Screen.

8. Summary Screen + Share
   — Depends on Calculation Engine + State Store.
   — Integrates all data; triggers share sheet.
```

The Calculation Engine (step 2) should be built and fully tested before any screen is written. This ensures the core math is verified before UI is layered on top.

---

## Scalability Considerations

This is a single-session, no-persistence tool. Scalability concerns are minimal and scoped to UX limits:

| Concern | Practical limit | Notes |
|---------|----------------|-------|
| Number of people | ~20 before UI becomes unwieldy | No technical limit; calculation is O(n) |
| Number of items | ~30 before list becomes hard to scroll | No technical limit |
| Rounding correctness | Always exact | Integer cents + explicit rounding correction guarantees this |
| Performance | Instant at these data sizes | Recalculating on every keystroke is fine; no debounce needed |
| State persistence | None in v1 | Intentional. Refreshing the page resets the bill — acceptable for table-side use |

---

## Sources

- PROJECT.md constraint: "No backend required for v1 — purely client-side calculations"
- Domain knowledge: integer money arithmetic, pure calculation engine patterns, unidirectional data flow (established patterns in React/Svelte/Vue ecosystems)
- Rounding strategy: "largest remainder method" is standard in payroll and billing software for penny-accurate splits
- Confidence: HIGH — this is a well-understood problem domain with clear constraints specified in PROJECT.md
