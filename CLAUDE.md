<!-- GSD:project-start source:PROJECT.md -->
## Project

**Expense Splitter**

A mobile-first web app that splits restaurant bills fairly among friends. It handles the messy reality of shared appetizers, different tip preferences, and tax calculations — used right at the table when the check arrives.

**Core Value:** Accurately split any bill in under a minute, so nobody overpays and nobody has to do mental math.

### Constraints

- **Platform**: Mobile-first web app (responsive, works on any phone browser)
- **Backend**: None — all logic runs client-side
- **Tech stack**: Open — let research determine best fit
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
### Core Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| React | 19.2.x | UI component library | Industry standard for interactive UIs; React 19 ships `useActionState`, ref-as-prop, and automatic compiler memoization. No server needed — pairs perfectly with the client-only constraint. |
| TypeScript | 6.0 | Type safety | Official React recommendation. Catches the category of bugs this app is most vulnerable to: off-by-one rounding errors, wrong field names on bill/person/item objects. Use `.tsx` throughout. |
| Vite | 6.x (latest) | Build tool & dev server | Sub-second HMR, first-class React + TypeScript templates, native ES modules in dev, Rollup-based production output. The de-facto standard for new React projects in 2025. Zero-config for this use case. |
### State Management
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| React built-ins: `useReducer` + Context | (built into React 19) | App-wide bill state | This app has one cohesive state object (people, items, assignments, tip/tax config). `useReducer` centralises all mutations — `ADD_PERSON`, `ADD_ITEM`, `ASSIGN_ITEM`, `SET_TIP` — in a single pure function that is trivially testable without mocking. Context distributes state to all screens. No external library needed. |
### Styling
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Tailwind CSS | 4.3 | Utility-first styling | v4 ships a Vite-native plugin (`@tailwindcss/vite`) — zero PostCSS config, one import line, auto-detects content paths. Mobile-first by default (unprefixed = mobile, `md:` = tablet+). CSS-first config via `@theme {}` replaces `tailwind.config.js`. 3.78x faster full builds, 8.8x faster incremental vs v3. Correct tool for a UI-heavy app built under time pressure. |
### Math / Calculation Utilities
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| None (plain JS) | — | Arithmetic | Bill splitting is simple arithmetic. Do not introduce `decimal.js` or `big.js` for v1. Use integer-cent arithmetic: store all amounts as cents (integers), convert to dollars only at display time. This eliminates floating-point rounding bugs entirely without a dependency. |
### Share / Copy Feature
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Web Share API (native) with Clipboard API fallback | (browser built-in) | Share summary to others | `navigator.share()` triggers the native OS share sheet on iOS/Android — no library needed, no permissions beyond a user gesture. Fallback to `navigator.clipboard.writeText()` for desktop. Both are available in all modern mobile browsers. Zero bundle cost. |
### Testing
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Vitest | 3.x (latest) | Unit + integration tests | Native Vite integration — shares the same config, same module resolution, same transform pipeline. No separate Jest config. `describe/it/expect` API is Jest-compatible. Essential for this project: the reducer and calculation functions must be unit-tested with exact cent values to prevent rounding bugs from shipping. |
| @testing-library/react | latest | Component tests | Standard for testing React UI from the user's perspective (click, type, assert text). Avoids testing implementation details. |
### Deployment
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Vercel or Netlify | (platform) | Static hosting | Both offer zero-config deployment for Vite builds (`npm run build` → `dist/`). No backend to manage. Free tier handles any expected traffic for v1. Pick Vercel for the `vercel --prod` CLI convenience; pick Netlify for drag-and-drop deploy. Either works identically for a static SPA. |
## Alternatives Considered
| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Framework | React 19 + Vite | Next.js | Next.js adds SSR/RSC complexity with no benefit for a fully client-side app. No server = no reason for Next.js. |
| Framework | React 19 + Vite | SvelteKit | Svelte is excellent but the ecosystem, hiring pool, and tooling are smaller. React is the correct default for a new app with no specific Svelte requirement. |
| Styling | Tailwind CSS v4 | shadcn/ui | shadcn/ui is a component layer on top of Tailwind + Radix. Useful for dashboards and data-heavy apps; overkill for a focused single-purpose tool with custom mobile UX. Build primitives directly. |
| Styling | Tailwind CSS v4 | CSS Modules | More verbose, requires leaving JSX to read styles, no built-in responsive utilities. |
| State | useReducer + Context | Zustand | Adds a dependency. Not justified until state grows across independently-updating slices. |
| State | useReducer + Context | Redux Toolkit | Extreme overkill. Adds 30KB+ for a calculation app. |
| Math | Integer cents (plain JS) | decimal.js | Unnecessary dependency. Integer arithmetic solves floating-point for money with zero cost. |
| Testing | Vitest | Jest | Jest requires separate babel/transform config in a Vite project. Vitest shares the same pipeline — zero extra configuration. |
## Installation
# Scaffold project
# Tailwind CSS v4 with Vite plugin
# Testing
## Sources
- React 19 stable release: https://react.dev/versions (React 19.2.1, Dec 2025)
- React 19 features: https://react.dev/blog/2024/12/05/react-19
- React TypeScript guidance: https://react.dev/learn/typescript
- React state management patterns: https://react.dev/learn/managing-state
- React derived state (no-Effect pattern): https://react.dev/learn/you-might-not-need-an-effect
- Tailwind CSS v4 release: https://tailwindcss.com/blog/tailwindcss-v4
- Tailwind v4 installation (Vite): https://tailwindcss.com/docs/installation
- Tailwind v4 responsive design: https://tailwindcss.com/docs/responsive-design
- TypeScript 6.0: https://www.typescriptlang.org/
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
