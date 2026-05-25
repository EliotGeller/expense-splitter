---
phase: 01-project-scaffold
plan: 01
subsystem: infra
tags: [react, typescript, vite, tailwindcss, vitest, testing-library, scaffold]

# Dependency graph
requires: []
provides:
  - Vite 8 + React 19 + TypeScript project scaffold at project root
  - Tailwind CSS v4 wired via @tailwindcss/vite plugin (zero PostCSS)
  - Vitest 4 configured in vite.config.ts with jsdom and jest-dom matchers
  - Clean App component rendering "Expense Splitter" heading with Tailwind classes
  - Smoke test (App scaffold / renders without crashing) passing
  - Production build (dist/) confirmed working
  - vercel.json SPA rewrite rule for deployment
affects: [02-project-scaffold, 03-bill-engine, 04-state-management, 05-ui-components, all-phases]

# Tech tracking
tech-stack:
  added:
    - react@19.x
    - react-dom@19.x
    - typescript@6.x
    - vite@8.x
    - "@vitejs/plugin-react@6.x"
    - tailwindcss@4.3.x
    - "@tailwindcss/vite@4.3.x"
    - vitest@4.x
    - "@testing-library/react@16.x"
    - "@testing-library/user-event@14.x"
    - "@testing-library/jest-dom@6.x"
    - jsdom@29.x
  patterns:
    - Tailwind v4 single @import "tailwindcss" in index.css (no PostCSS, no tailwind.config.js)
    - Vitest test block inside vite.config.ts (not a separate jest/vitest config file)
    - Integer-cent arithmetic for money (established as future pattern; not yet implemented)
    - tsx files export React components only (no mixed utility exports — HMR Fast Refresh rule)
    - Mobile-first Tailwind classes (unprefixed = mobile, md: = tablet+)

key-files:
  created:
    - vite.config.ts
    - tsconfig.json
    - tsconfig.app.json
    - tsconfig.node.json
    - index.html
    - src/main.tsx
    - src/App.tsx
    - src/index.css
    - src/setupTests.ts
    - src/App.test.tsx
    - vercel.json
    - package.json
  modified: []

key-decisions:
  - "Added /// <reference types='vitest/config' /> to vite.config.ts — required for TypeScript to accept the test block without a build error (Rule 3 auto-fix)"
  - "vercel.json SPA rewrite rule committed alongside scaffold — avoids 404 on non-root URLs after deploy"
  - "Removed erasableSyntaxOnly and verbatimModuleSyntax from tsconfig.app.json to match Pattern map canonical config; kept strict: true"

patterns-established:
  - "Pattern: Tailwind v4 uses @import 'tailwindcss' in index.css — no PostCSS, no tailwind.config.js"
  - "Pattern: Vitest config lives inside vite.config.ts as a test: {} block — no separate config file"
  - "Pattern: tsx files export React components only — utility functions go in .ts files"
  - "Pattern: setupTests.ts imports @testing-library/jest-dom as side-effect to extend expect globally"

requirements-completed: []

# Metrics
duration: 15min
completed: 2026-05-25
---

# Phase 01 Plan 01: Project Scaffold Summary

**Vite 8 + React 19 + TypeScript + Tailwind CSS v4 + Vitest scaffold with passing smoke test and production build verified**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-05-25T11:33:00Z
- **Completed:** 2026-05-25T11:36:00Z
- **Tasks:** 2
- **Files modified:** 14 (11 created, 3 deleted)

## Accomplishments

- Full Vite + React 19 + TypeScript project scaffold at project root (preserving .planning/ and CLAUDE.md)
- Tailwind CSS v4 wired via @tailwindcss/vite Vite plugin — no PostCSS config, single @import line
- Vitest configured with jsdom environment and jest-dom matchers; 1 smoke test passes
- Clean App component renders "Expense Splitter" heading with Tailwind utility classes
- Production build (npm run build) produces dist/ without TypeScript errors
- vercel.json SPA rewrite rule committed for future deployment

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold Vite project and install all dependencies** - `9408ccf` (chore)
2. **Task 2: Configure Tailwind, Vitest, and create clean App component with smoke test** - `3fd5b0c` (feat)

## Files Created/Modified

- `vite.config.ts` - Vite config with react(), tailwindcss() plugins and Vitest test block
- `tsconfig.json` - Project references aggregator pointing to tsconfig.app.json and tsconfig.node.json
- `tsconfig.app.json` - App TS config with strict: true, jsx: react-jsx, types: vite/client + vitest/globals
- `tsconfig.node.json` - Node/Vite layer TS config
- `index.html` - Root HTML entry with title "Expense Splitter", div#root, script src/main.tsx
- `src/main.tsx` - React DOM entry point with StrictMode, imports ./index.css and App
- `src/App.tsx` - Clean root component: Tailwind-styled div with "Expense Splitter" h1
- `src/index.css` - Single line: @import "tailwindcss" (Tailwind v4 entry point)
- `src/setupTests.ts` - afterEach cleanup, @testing-library/jest-dom side-effect import
- `src/App.test.tsx` - Smoke test: describe('App scaffold') / renders without crashing
- `vercel.json` - SPA rewrite rule (source: /(.*) -> destination: /index.html)
- `package.json` - All production and dev dependencies
- `eslint.config.js` - Vite scaffold ESLint config
- `.gitignore` - Ignores node_modules, dist, editor dirs

## Decisions Made

- Added `/// <reference types="vitest/config" />` to vite.config.ts: TypeScript raised an error on the `test` block during `npm run build` (`tsc -b`) because vite's UserConfigExport type doesn't include test. The triple-slash reference pulls in Vitest's augmented type, resolving the error without changing any runtime behavior.
- Used tsconfig.app.json fields from PATTERNS.md rather than the newer scaffold output: the new scaffold uses `erasableSyntaxOnly` and `verbatimModuleSyntax` which are newer TS features. The PATTERNS.md reference was more conservative and aligned with the research document's recommended config. `strict: true` is enforced per CLAUDE.md.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added vitest/config type reference to vite.config.ts**
- **Found during:** Task 2 (Configure Tailwind, Vitest)
- **Issue:** `npm run build` failed with TS2769: "test does not exist in type 'UserConfigExport'" — TypeScript didn't know about Vitest's augmented config type
- **Fix:** Added `/// <reference types="vitest/config" />` at the top of vite.config.ts — standard documented approach for Vitest + Vite co-located config
- **Files modified:** vite.config.ts
- **Verification:** `npm run build` succeeds without TypeScript errors; Vitest tests still pass
- **Committed in:** 3fd5b0c (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 3 - blocking build error)
**Impact on plan:** Required for production builds to pass. No scope creep. Standard Vitest documented pattern.

## Issues Encountered

- TypeScript strict checking of vite.config.ts failed on the test block (Vitest's `test:` config key) during `tsc -b` — resolved by adding the `/// <reference types="vitest/config" />` triple-slash directive. This is the documented solution per Vitest docs.

## User Setup Required

None - no external service configuration required for the scaffold phase.

## Next Phase Readiness

- Dev server (`npm run dev`) ready on port 5173 with HMR
- All tests pass (`npx vitest run` — 1 test, 0 failures)
- Production build succeeds (`npm run build` produces dist/)
- Tailwind CSS classes present in App component (visual verification on dev server)
- Foundation ready for Phase 01 Plan 02 (deployment pipeline / GitHub + Vercel setup)

---
*Phase: 01-project-scaffold*
*Completed: 2026-05-25*
