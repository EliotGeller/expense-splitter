# Feature Landscape

**Domain:** Restaurant bill splitter (mobile-first, single-session, no backend)
**Researched:** 2026-05-25
**Confidence note:** Web search and WebFetch were unavailable. Findings are drawn from training-data knowledge of Splitwise, Tricount, Tab, Settle Up, Plates, and generic bill-splitter apps — products that are extensively documented. Confidence is MEDIUM-HIGH for table stakes (consensus is clear across all products); MEDIUM for differentiators (based on feature differentiation patterns observed in the market).

---

## Table Stakes

Features every user expects. Missing one = users abandon or distrust the product.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Add people by name | Core model — every splitter works this way | Low | No auth required; names are display labels only |
| Add line items with prices | Foundation of per-item splitting | Low | Input: name + dollar amount |
| Assign items to one or more people | The key split mechanic | Medium | Many-to-many: one item → N people |
| Shared item split (even among assignees) | Appetizers, bottles of wine are universally shared | Medium | Must handle fractional amounts and rounding |
| Tax entry and split | Every US restaurant check has tax | Low-Med | Enter amount OR percentage; must propagate correctly |
| Tip entry and split | Socially mandatory in US context | Low-Med | Preset percentages (15/18/20/25%) + custom; must be fast |
| Per-person total summary | The entire point of the tool | Low | Sum of items + proportional tax/tip share |
| Totals must add up exactly | Rounding errors destroy trust immediately | Med | Penny correction must be built in; see PITFALLS |
| Works on mobile without install | Used at the table; no one installs an app under social pressure | Low | PWA or plain responsive web; no app store barrier |
| Fast to use (under 60 seconds) | Social context — people are waiting | Med | UX/interaction design concern more than feature |

## Differentiators

Features that set a product apart. Not universally expected in the genre, but create real user value.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Proportional tip/tax split | "I only got a salad, why do I pay the same tip as the steak person?" — fair and defensible | Med | Tip/tax proportional to each person's item subtotal; requires correct calculation order |
| Equal tip/tax split toggle | Some groups prefer simplicity; toggle between proportional and equal | Low | Pair with proportional option — let group choose |
| "Someone's not paying" mode | One person covers another's share (e.g., couple treating a friend) | Med | Item reassignment or post-summary adjustment |
| Copy/share summary as text | Paste into group chat so everyone sees what they owe; reduces "wait what do I owe?" questions | Low | Clipboard API; formatted text summary |
| Rounding transparency | Show each person exactly why they owe X.XX — builds trust | Med | Optional "show breakdown" detail view |
| Item quick-add (common items) | Speed: add "Burger $14" in one tap via predictive/history | High | Requires local state or history; skip for v1 |
| Split item unequally | E.g., one person takes 2 slices of a pizza, another takes 1 | High | Percentage or fraction input per person; complex UX |
| Handle one person paying for everyone | Common: one card goes down, others owe them | Low | Just the summary output — who owes whom |
| "Even split" shortcut | Skip per-item entry entirely — just divide total N ways | Low | Valid alternative flow for groups that don't care about fairness |
| Subtotal running display | Show each person's running tab as items are added | Low | Keeps everyone honest; reduces end-of-meal surprises |
| Multi-currency support | Useful for international travel | High | Out of scope for v1; adds conversion complexity |
| Dark mode | Usability in dim restaurant lighting | Low | CSS-level concern; do it |
| Keyboard navigation / numeric keypad | Critical on mobile — default number inputs are clunky | Med | `inputmode="decimal"` on price fields; custom numpad if needed |
| Undo / edit items after adding | Mistakes happen; correcting should be instant | Low-Med | In-memory state; must support edit and delete |

## Anti-Features

Features to deliberately NOT build — they add complexity, maintenance burden, or distract from the core use case.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| User accounts / authentication | Creates friction at the worst moment (at the table). No one signs up to split a bill. | Stateless session; names are just labels |
| Receipt OCR / photo scan | High complexity, unreliable on crumpled restaurant receipts, requires backend or paid API | Manual entry is fast enough for a dinner check |
| Payment integration (Venmo/CashApp deep links) | Adds complexity, third-party dependencies, and app-store / OAuth friction | Show the summary; let people pay how they want |
| Persistent history / saved splits | Requires backend or device storage; meaningful scope expansion | Stateless is fine for v1; share summary via text |
| Group management / recurring groups | Splitwise territory; wrong product | Single-session, ad-hoc groups only |
| Expense categories / tags | Adds cognitive load with no benefit in restaurant context | Single receipt, no categorization needed |
| Debt tracking across multiple bills | Out of scope; that is Splitwise | Focus: one bill, settle now |
| Split by percentage (custom weights) | Rare need, complex UX, invites arguments | Even split among sharers is sufficient |
| Analytics / spending reports | Not relevant for at-the-table use case | — |
| Native app (iOS/Android) | Requires distribution pipeline, updates, installs | Responsive web covers the use case with zero friction |

## Feature Dependencies

```
Add people
  └── Assign items to people (requires people to exist)
        └── Shared item split (requires multi-person assignment)
              └── Per-person subtotal
                    └── Proportional tip/tax split (requires per-person subtotal)
                    └── Final summary (requires subtotal + tip + tax shares)
                          └── Copy/share summary (requires final summary)

Add line items
  └── Assign items to people
  └── Per-person subtotal

Tip entry
  └── Tip split method (equal vs proportional)
  └── Final summary

Tax entry
  └── Tax split method (equal vs proportional)
  └── Final summary
```

## MVP Recommendation

### Must ship (v1 table stakes + highest-value differentiators)

1. Add people by name
2. Add line items with name + price
3. Assign items to one or more people (shared = split evenly among assignees)
4. Edit and delete items after adding (undo mistakes)
5. Tax entry: dollar amount or percentage
6. Tip entry: 15/18/20/25% presets + custom
7. Tip and tax split method: toggle equal vs proportional
8. Per-person totals with rounding correction (totals must sum exactly to bill)
9. Copy/share summary as formatted text
10. Mobile-optimized numeric input (inputmode="decimal", large touch targets)

### Include but not primary (adds polish without much complexity)

- Subtotal running display per person
- Dark mode (CSS, minimal effort)
- Even-split shortcut (skip per-item entry entirely for groups that want simplicity)

### Defer to v2

- Receipt OCR
- Payment deep links (Venmo/CashApp)
- Persistent history / saved splits
- User accounts
- Unequal item splits (by fraction/percentage)
- "Someone's not paying" / cover-another-person flow
- Multi-currency

## Key Insight: Two Distinct User Flows

This is not obvious from the feature list alone. There are two fundamentally different use patterns:

1. **Itemized flow** — enter each line item, assign to people. Most fair, more work.
2. **Even-split flow** — enter total, divide N ways. Fastest, least fair.

The product should support both but default to itemized (the harder, more valuable path). The even-split shortcut is a single "split evenly" button after entering the total — it costs almost nothing to add and handles a real subset of users.

## Sources

- Training-data knowledge of Splitwise (iOS/Android/web), Tricount, Tab, Settle Up, Plates — all well-documented products as of August 2025 knowledge cutoff.
- Note: Web search and WebFetch were unavailable during this research session. Confidence ratings reflect this limitation. Recommend spot-checking against current App Store reviews and competitor feature pages before finalizing roadmap.
