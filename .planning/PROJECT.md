# Expense Splitter

## What This Is

A mobile-first web app that splits restaurant bills fairly among friends. It handles the messy reality of shared appetizers, different tip preferences, and tax calculations — used right at the table when the check arrives.

## Core Value

Accurately split any bill in under a minute, so nobody overpays and nobody has to do mental math.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Add people to the bill by name
- [ ] Add items from the receipt with prices
- [ ] Assign items to specific people or mark as shared
- [ ] Shared items split evenly among selected sharers
- [ ] Tip calculation with preset percentages (15%, 18%, 20%) and custom option
- [ ] Tip split method: equal across everyone OR proportional to what they ordered
- [ ] Tax calculation: enter amount or percentage
- [ ] Tax split method: equal or proportional (same options as tip)
- [ ] Final summary showing each person's total
- [ ] Copy/share summary so everyone can see what they owe

### Out of Scope

- Receipt photo upload / OCR — high complexity, defer to v2
- Venmo/payment deep links — defer to v2
- Save and share past splits — defer to v2
- Split history — defer to v2
- User accounts / authentication — not needed for v1

## Context

- Mobile-first: used at the restaurant table on a phone when the check arrives
- Speed matters: needs to be fast and intuitive under social pressure
- Math edge cases: rounding errors across multiple people, proportional splits on shared items, ensuring totals add up to the actual bill
- No backend required for v1 — purely client-side calculations

## Constraints

- **Platform**: Mobile-first web app (responsive, works on any phone browser)
- **Backend**: None — all logic runs client-side
- **Tech stack**: Open — let research determine best fit

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Mobile-first web app | Used at the table on phones | — Pending |
| No backend for v1 | Pure calculation tool, no data persistence needed | — Pending |
| Even split for shared items | Simplicity — custom splits add complexity without much value | — Pending |
| Shareable summary | Users need to communicate totals to the group | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-25 after initialization*
