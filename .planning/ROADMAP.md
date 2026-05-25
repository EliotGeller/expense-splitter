# Roadmap: Expense Splitter

## Overview

From an empty Vite + React + TypeScript scaffold to a deployed, mobile-first bill-splitting app. The build order is deliberate: data model and pure calculation engine come first so the riskiest logic (math correctness) is validated before any UI is written. Each subsequent phase layers one complete capability on top of a working foundation, ending with UX polish that makes the app usable under real restaurant-table pressure.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Project Scaffold** - Vite + React + TypeScript project wired up, linted, tested, and deployed
- [ ] **Phase 2: Data Model** - TypeScript types and UUID-based data model established
- [ ] **Phase 3: Calculation Engine** - Pure calculation functions written and unit-tested before any UI
- [ ] **Phase 4: State Store** - useReducer + Context wiring the entire app to a single BillState atom
- [ ] **Phase 5: People Screen** - Users can add, edit, and remove people from the bill
- [ ] **Phase 6: Items Screen** - Users can add, edit, and delete line items with validated price input
- [ ] **Phase 7: Assignment Screen** - Users can assign items to one or more people with an "everyone" shortcut
- [ ] **Phase 8: Charges Screen** - Users can configure tip and tax with equal or proportional split methods
- [ ] **Phase 9: Summary & Share** - Users see a per-person breakdown and can share it
- [ ] **Phase 10: UX Polish** - Mobile optimizations, dark mode, linear navigation, and even-split shortcut

## Phase Details

### Phase 1: Project Scaffold

**Goal**: A working Vite + React + TypeScript project with Tailwind CSS, Vitest, and a zero-config deployment pipeline is established so every subsequent phase builds on a consistent, testable foundation.
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: (none — pure technical foundation)
**Success Criteria** (what must be TRUE):

  1. Running `npm run dev` serves the app locally with hot module reload
  2. Running `npm test` executes the Vitest suite and reports results
  3. Tailwind CSS classes render correctly in the browser
  4. Pushing to main triggers a successful Vercel/Netlify deployment

**Plans:** 1/2 plans executed
Plans:
**Wave 1**

- [x] 01-01-PLAN.md — Scaffold Vite project, install deps, configure Tailwind + Vitest, create clean App component with smoke test

**Wave 2** *(blocked on Wave 1 completion)*

- [ ] 01-02-PLAN.md — Create GitHub repo, deploy to Vercel, human-verify deployed app with Tailwind rendering

### Phase 2: Data Model

**Goal**: All TypeScript types and interfaces for the bill domain are defined, and the UUID-based Person model is established so renaming a person never breaks their item assignments.
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: PEOPLE-03
**Success Criteria** (what must be TRUE):

  1. Person, Item, Assignment, ChargeConfig, and BillState types are defined and exported
  2. Person IDs are UUIDs; renaming a person does not change their ID
  3. Assignment is modeled as `Record<itemId, personId[]>` (explicit sharer lists, not a boolean flag)
  4. All money values are typed as integer cents (no floating-point money types in the model)

**Plans**: TBD

### Phase 3: Calculation Engine

**Goal**: All bill-math functions are implemented as pure, side-effect-free functions and fully covered by unit tests — before any UI is built — so regressions in splitting logic are caught immediately.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: ASSIGN-02, CHARGE-04, SUMMARY-02
**Success Criteria** (what must be TRUE):

  1. Shared items split their cost evenly among all assigned people (integer cents, no fractions)
  2. Tip is calculated on the pre-tax subtotal (US standard), not the post-tax total
  3. All per-person totals sum exactly to the bill total — the largest-remainder method eliminates penny gaps
  4. Proportional tip/tax correctly handles the edge case where a person has a $0 personal subtotal
  5. The calculation engine has no imports from any UI module; it is independently unit-testable

**Plans**: TBD

### Phase 4: State Store

**Goal**: A single BillState atom managed by useReducer + Context provides the entire app with a shared, mutation-free state layer so each screen reads from and dispatches to one source of truth.
**Mode:** mvp
**Depends on**: Phase 3
**Requirements**: (none — technical enabler for all screen phases)
**Success Criteria** (what must be TRUE):

  1. All bill mutations (add person, add item, assign item, set tip, etc.) are dispatched as named actions
  2. No screen component stores derived totals in local state — all totals computed from BillState
  3. State persists correctly across screen navigation without resetting
  4. Reducer is a pure function and is unit-tested independently of any component

**Plans**: TBD

### Phase 5: People Screen

**Goal**: Users can build the list of people splitting the bill by adding, editing, and removing names before the rest of the bill entry begins.
**Mode:** mvp
**Depends on**: Phase 4
**Requirements**: PEOPLE-01, PEOPLE-02
**Success Criteria** (what must be TRUE):

  1. User can type a name and add a person to the bill with one action
  2. User can edit an existing person's name and the change appears immediately
  3. User can remove a person from the bill; their item assignments are cleaned up automatically
  4. The list is visible and scrollable when many people are added

**Plans**: TBD
**UI hint**: yes

### Phase 6: Items Screen

**Goal**: Users can build the receipt line-by-line by adding, editing, and deleting items with prices that are validated forgivingly on mobile keyboards.
**Mode:** mvp
**Depends on**: Phase 5
**Requirements**: ITEMS-01, ITEMS-02, ITEMS-03
**Success Criteria** (what must be TRUE):

  1. User can add a line item with a name and a price
  2. User can edit an item's name or price after adding it
  3. User can delete an item from the list
  4. Price input accepts commas, missing decimals, and leading/trailing spaces without error
  5. Invalid price input (letters, empty) shows a clear inline error and does not add the item

**Plans**: TBD
**UI hint**: yes

### Phase 7: Assignment Screen

**Goal**: Users can assign each item to the specific people who ordered it — or tap one shortcut to assign it to everyone — so the split reflects who actually ate what.
**Mode:** mvp
**Depends on**: Phase 6
**Requirements**: ASSIGN-01, ASSIGN-03
**Success Criteria** (what must be TRUE):

  1. User can tap one or more people's names to assign an item to them
  2. An item assigned to multiple people shows each person in the assignment list
  3. Tapping "Everyone" assigns the item to all current people in one action
  4. Unassigned items are visually distinguishable so users know to act on them

**Plans**: TBD
**UI hint**: yes

### Phase 8: Charges Screen

**Goal**: Users can configure tip and tax — choosing a percentage or custom amount and deciding whether the charge is split equally or proportional to what each person ordered.
**Mode:** mvp
**Depends on**: Phase 7
**Requirements**: CHARGE-01, CHARGE-02, CHARGE-03
**Success Criteria** (what must be TRUE):

  1. User can select a tip preset (15%, 18%, 20%) or enter a custom tip amount
  2. User can enter tax as a dollar amount or as a percentage of the subtotal
  3. User can toggle between "equal split" and "proportional split" for both tip and tax independently
  4. Changing the split method updates the per-person preview in real time

**Plans**: TBD
**UI hint**: yes

### Phase 9: Summary & Share

**Goal**: Users see a clear per-person breakdown of the full bill — with running subtotals visible as they work — and can share the summary with the group instantly.
**Mode:** mvp
**Depends on**: Phase 8
**Requirements**: SUMMARY-01, SUMMARY-03, SUMMARY-04
**Success Criteria** (what must be TRUE):

  1. User sees each person's name and their total amount owed on the summary screen
  2. Running per-person subtotals are visible while adding and assigning items (not just at the end)
  3. Tapping "Share" opens the native OS share sheet on mobile with a formatted text summary
  4. On desktop or browsers without Web Share API, tapping "Copy" copies the summary to the clipboard

**Plans**: TBD
**UI hint**: yes

### Phase 10: UX Polish

**Goal**: The app works correctly under real restaurant-table conditions: mobile keyboards don't obscure inputs, touch targets are large enough, dark mode reduces glare, navigation is linear with back support, and groups who don't need per-item fairness have a fast path.
**Mode:** mvp
**Depends on**: Phase 9
**Requirements**: UX-01, UX-02, UX-03, UX-04
**Success Criteria** (what must be TRUE):

  1. All price and number inputs use `inputmode="decimal"` and display at 16px+ so iOS does not zoom the viewport
  2. Every interactive element has a touch target of at least 44x44px
  3. Dark mode activates automatically from the OS preference and reduces background brightness noticeably
  4. A back button is accessible on every screen and returns the user to the previous step without losing data
  5. Tapping "Even split" on the People screen bypasses per-item entry and jumps directly to a simple N-way total split

**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Project Scaffold | 1/2 | In Progress|  |
| 2. Data Model | 0/TBD | Not started | - |
| 3. Calculation Engine | 0/TBD | Not started | - |
| 4. State Store | 0/TBD | Not started | - |
| 5. People Screen | 0/TBD | Not started | - |
| 6. Items Screen | 0/TBD | Not started | - |
| 7. Assignment Screen | 0/TBD | Not started | - |
| 8. Charges Screen | 0/TBD | Not started | - |
| 9. Summary & Share | 0/TBD | Not started | - |
| 10. UX Polish | 0/TBD | Not started | - |
