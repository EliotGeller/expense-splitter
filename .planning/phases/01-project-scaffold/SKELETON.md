# Walking Skeleton -- Expense Splitter

**Phase:** 1
**Generated:** 2026-05-25

## Capability Proven End-to-End

A user can open the deployed app in a mobile browser, see the "Expense Splitter" heading styled with Tailwind CSS, confirming that the full build pipeline (Vite + React + TypeScript + Tailwind v4) and deployment target (Vercel) are wired end-to-end.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | React 19 + Vite 6 (SPA, no SSR) | Pure client-side app; no backend needed. Vite provides sub-second HMR and zero-config React support. |
| Data layer | None (client-side only) | All state lives in the browser via useReducer + Context. No database, no API. |
| Auth | None | No user accounts -- the app is a single-session calculator used at a restaurant table. |
| Deployment target | Vercel (static hosting) | Free tier, auto-deploys from GitHub, CLI already installed locally (v54.4.1). SPA rewrite via vercel.json. |
| Styling | Tailwind CSS v4 via @tailwindcss/vite plugin | Zero PostCSS config, CSS-first @theme{} config, mobile-first by default. |
| Testing | Vitest + @testing-library/react + jsdom | Shares Vite config; no separate Jest setup. Jest-dom matchers for DOM assertions. |
| Type system | TypeScript 6 (strict mode) | Catches rounding and field-name bugs. All money as integer cents. |
| Directory layout | Flat src/ with future feature folders (engine/, types/, store/, components/) | Phase 1 is minimal; subsequent phases add folders as capabilities grow. |

## Stack Touched in Phase 1

- [x] Project scaffold (Vite + React 19 + TypeScript 6 + Tailwind CSS v4 + Vitest)
- [x] Routing -- one real route (root `/`) renders the App component
- [ ] Database -- N/A (client-side only app, no database tier)
- [x] UI -- App component renders Tailwind-styled heading (proves CSS pipeline works)
- [x] Deployment -- running on Vercel production URL

## Out of Scope (Deferred to Later Slices)

- TypeScript domain types (Phase 2: Data Model)
- Calculation engine and integer-cent arithmetic (Phase 3)
- useReducer + Context state store (Phase 4)
- All screen-level UI: People, Items, Assignment, Charges, Summary (Phases 5-9)
- Mobile UX polish, dark mode, linear navigation (Phase 10)
- ESLint / Prettier configuration (not in v1 roadmap)
- CI pipeline beyond Vercel auto-deploy (not in v1 roadmap)

## Subsequent Slice Plan

Each later phase adds one vertical slice on top of this skeleton without altering its architectural decisions:

- Phase 2: TypeScript types and UUID-based Person model
- Phase 3: Pure calculation engine (bill math, rounding, shared item splitting)
- Phase 4: useReducer + Context state store wiring all screens to BillState
- Phase 5: People screen (add/edit/remove people)
- Phase 6: Items screen (add/edit/delete line items with price validation)
- Phase 7: Assignment screen (assign items to people, "Everyone" shortcut)
- Phase 8: Charges screen (tip/tax config with equal/proportional split)
- Phase 9: Summary and share (per-person breakdown, Web Share API)
- Phase 10: UX polish (dark mode, touch targets, linear nav, even-split shortcut)
