# Requirements: Expense Splitter

**Defined:** 2026-05-25
**Core Value:** Accurately split any bill in under a minute, so nobody overpays and nobody has to do mental math.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### People Management

- [ ] **PEOPLE-01**: User can add people to the bill by entering a name
- [ ] **PEOPLE-02**: User can edit or remove a person from the bill
- [ ] **PEOPLE-03**: Each person has a stable UUID so renaming doesn't break assignments

### Item Entry

- [ ] **ITEMS-01**: User can add line items with a name and price
- [ ] **ITEMS-02**: User can edit or delete items after adding
- [ ] **ITEMS-03**: Price input validates and handles typos, commas, and missing decimals gracefully

### Assignment

- [ ] **ASSIGN-01**: User can assign each item to one or more specific people
- [ ] **ASSIGN-02**: Shared items split evenly among all assigned people
- [ ] **ASSIGN-03**: "Everyone" shortcut assigns an item to all people with one tap

### Tip & Tax

- [ ] **CHARGE-01**: User can select tip percentage (15%, 18%, 20%) or enter a custom amount
- [ ] **CHARGE-02**: User can enter tax as a dollar amount or percentage
- [ ] **CHARGE-03**: User can toggle between equal and proportional split for tip and tax
- [ ] **CHARGE-04**: Tip is calculated on pre-tax subtotal (US standard)

### Summary & Output

- [ ] **SUMMARY-01**: User sees a per-person breakdown showing what each person owes
- [ ] **SUMMARY-02**: All per-person totals sum exactly to the bill total (penny-perfect rounding)
- [ ] **SUMMARY-03**: User can copy or share the summary via native share sheet or clipboard
- [ ] **SUMMARY-04**: Running subtotal display shows each person's tab as items are added

### UX & Polish

- [ ] **UX-01**: All inputs are mobile-optimized (decimal keyboard, large touch targets, 16px+ font)
- [ ] **UX-02**: Linear step-by-step navigation with back button to fix earlier entries
- [ ] **UX-03**: Dark mode support for dim restaurant lighting
- [ ] **UX-04**: Even-split shortcut bypasses per-item entry for groups that want simple N-way split

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Advanced Input

- **INPUT-01**: Receipt photo upload with OCR to auto-populate items
- **INPUT-02**: Item quick-add with common item suggestions

### Payments & Sharing

- **PAY-01**: Venmo/CashApp deep links for payment requests
- **PAY-02**: Save and share splits via unique URL
- **PAY-03**: History of past splits

### Advanced Splitting

- **SPLIT-01**: Unequal item splits (by fraction or percentage per person)
- **SPLIT-02**: "Someone's not paying" mode (one person covers another)
- **SPLIT-03**: Multi-currency support

### Installation

- **PWA-01**: Progressive Web App with manifest and service worker for installability

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| User accounts / authentication | Creates friction at the table; no one signs up to split a bill |
| Backend / database | Pure client-side calculation tool; no persistence needed for v1 |
| Expense categories / tags | Adds cognitive load with no benefit in restaurant context |
| Debt tracking across bills | Different product (Splitwise territory) |
| Analytics / spending reports | Not relevant for at-the-table use case |
| Native mobile app (iOS/Android) | Responsive web covers the use case with zero friction |
| Group management / recurring groups | Single-session, ad-hoc groups only |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| PEOPLE-01 | Phase 5 | Pending |
| PEOPLE-02 | Phase 5 | Pending |
| PEOPLE-03 | Phase 2 | Pending |
| ITEMS-01 | Phase 6 | Pending |
| ITEMS-02 | Phase 6 | Pending |
| ITEMS-03 | Phase 6 | Pending |
| ASSIGN-01 | Phase 7 | Pending |
| ASSIGN-02 | Phase 3 | Pending |
| ASSIGN-03 | Phase 7 | Pending |
| CHARGE-01 | Phase 8 | Pending |
| CHARGE-02 | Phase 8 | Pending |
| CHARGE-03 | Phase 8 | Pending |
| CHARGE-04 | Phase 3 | Pending |
| SUMMARY-01 | Phase 9 | Pending |
| SUMMARY-02 | Phase 3 | Pending |
| SUMMARY-03 | Phase 9 | Pending |
| SUMMARY-04 | Phase 9 | Pending |
| UX-01 | Phase 10 | Pending |
| UX-02 | Phase 10 | Pending |
| UX-03 | Phase 10 | Pending |
| UX-04 | Phase 10 | Pending |

**Coverage:**
- v1 requirements: 21 total (note: original count of 20 was a typo — there are 21 requirements across 6 categories)
- Mapped to phases: 21
- Unmapped: 0

---
*Requirements defined: 2026-05-25*
*Last updated: 2026-05-25 after roadmap creation*
