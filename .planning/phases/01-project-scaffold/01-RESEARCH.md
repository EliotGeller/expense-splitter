# Phase 1: Project Scaffold - Research

**Researched:** 2026-05-25
**Domain:** Vite + React + TypeScript + Tailwind CSS v4 + Vitest project initialization
**Confidence:** HIGH

---

## Summary

Phase 1 establishes the entire technical foundation the remaining nine phases build on. It is a pure "scaffold and wire" phase with no application requirements — success means the dev server runs, tests execute, Tailwind renders, and CI/CD deploys on push.

The stack is fully locked by CLAUDE.md: React 19, TypeScript 6, Vite 6, Tailwind CSS v4 with the `@tailwindcss/vite` plugin, and Vitest 3. All packages were verified against the npm registry on 2026-05-25 — versions are current. No external state libraries, math libraries, or backend is involved.

The key integration decisions that are non-obvious: Tailwind v4 uses a Vite plugin approach (zero PostCSS config, one CSS `@import` line); Vitest shares the Vite config file rather than a separate Jest config; and Vercel requires a `vercel.json` rewrite rule for SPA deep-linking to work correctly on refresh. Missing any of these three will cause silent failures that are painful to debug later.

**Primary recommendation:** Scaffold with `npm create vite@latest . -- --template react-ts`, layer in Tailwind v4 and Vitest configuration immediately, then push to GitHub and connect to Vercel before writing any application code.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| UI rendering | Browser / Client | — | Pure SPA; no SSR tier exists |
| State management | Browser / Client | — | `useReducer` + Context, no server |
| Build / bundling | CDN / Static | — | Vite produces `dist/` for static hosting |
| Hot module replacement | CDN / Static (dev) | — | Vite dev server handles HMR |
| Testing | Local toolchain | — | Vitest runs in Node via jsdom |
| Deployment pipeline | CDN / Static | — | Vercel static hosting, auto-detected |
| CSS compilation | CDN / Static (build) | — | Tailwind v4 Vite plugin generates CSS at build time |

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react | 19.2.6 | UI component library | Locked in CLAUDE.md; industry standard for interactive UIs |
| react-dom | 19.2.6 | DOM renderer for React | Required companion to React |
| typescript | 6.0.3 | Type safety across all source | Locked in CLAUDE.md; catches off-by-one and field-name bugs |
| vite | 8.0.14 | Build tool and dev server | Locked in CLAUDE.md; sub-second HMR, native ES modules |
| @vitejs/plugin-react | 6.0.2 | React Fast Refresh + JSX transform | Official Vite plugin for React; enables HMR for components |
| tailwindcss | 4.3.0 | Utility-first CSS | Locked in CLAUDE.md; v4 ships with Vite-native plugin |
| @tailwindcss/vite | 4.3.0 | Vite plugin for Tailwind v4 | Replaces PostCSS pipeline entirely; zero config |

### Testing

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| vitest | 4.1.7 | Test runner | All unit and integration tests; shares Vite config |
| @testing-library/react | 16.3.2 | Component testing utilities | Testing React components from the user's perspective |
| @testing-library/user-event | 14.6.1 | User interaction simulation | Simulating realistic keyboard and mouse events |
| @testing-library/jest-dom | 6.9.1 | DOM assertion matchers | `toBeInTheDocument()`, `toHaveTextContent()`, etc. |
| jsdom | 29.1.1 | Browser-like DOM in Node | Required environment for rendering components in Vitest |
| @vitest/coverage-v8 | 4.1.7 | V8 coverage reporting | Optional; add if coverage reports needed |

### Type Definitions

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @types/react | 19.2.15 | TypeScript types for React | Always — enables JSX type checking |
| @types/react-dom | 19.2.3 | TypeScript types for ReactDOM | Always — required with @types/react |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @tailwindcss/vite plugin | PostCSS + tailwindcss | v4 no longer needs PostCSS; adding it creates unnecessary complexity |
| jsdom environment | happy-dom | jsdom is more complete; happy-dom is faster but missing some APIs |
| @vitejs/plugin-react | @vitejs/plugin-react-swc | SWC variant is faster but adds a Rust binary dependency; not worth it for this project size |

**Installation (production dependencies):**
```bash
npm create vite@latest expense-splitter -- --template react-ts
cd expense-splitter
npm install
```

**Installation (Tailwind CSS v4):**
```bash
npm install tailwindcss @tailwindcss/vite
```

**Installation (testing devDependencies):**
```bash
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

**Version verification:** All versions above confirmed via `npm view <pkg> version` against the npm registry on 2026-05-25. `@types/react` and `@types/react-dom` ship in the `react-ts` Vite template.

---

## Package Legitimacy Audit

> slopcheck was not available in this environment — all packages tagged `[ASSUMED]` for age/download columns. Packages verified against npm registry and confirmed to have authoritative source repos.

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| react | npm | ~13 yrs | Very high | github.com/facebook/react | [ASSUMED] | Approved — flagship Facebook/Meta project |
| react-dom | npm | ~13 yrs | Very high | github.com/facebook/react | [ASSUMED] | Approved — same repo as react |
| typescript | npm | ~13 yrs | Very high | github.com/microsoft/TypeScript | [ASSUMED] | Approved — Microsoft official |
| vite | npm | ~5 yrs | High | github.com/vitejs/vite | [ASSUMED] | Approved — Evan You / vitejs org |
| @vitejs/plugin-react | npm | ~4 yrs | High | github.com/vitejs/vite-plugin-react | [ASSUMED] | Approved — vitejs official |
| tailwindcss | npm | ~7 yrs | Very high | github.com/tailwindlabs/tailwindcss | [ASSUMED] | Approved — Tailwind Labs official |
| @tailwindcss/vite | npm | ~1 yr | High | github.com/tailwindlabs/tailwindcss | [ASSUMED] | Approved — same repo as tailwindcss |
| vitest | npm | ~3 yrs | High | github.com/vitest-dev/vitest | [ASSUMED] | Approved — vitest-dev official |
| @testing-library/react | npm | ~7 yrs | Very high | github.com/testing-library/react-testing-library | [ASSUMED] | Approved — testing-library official |
| @testing-library/user-event | npm | ~7 yrs | High | github.com/testing-library/user-event | [ASSUMED] | Approved — testing-library official |
| @testing-library/jest-dom | npm | ~7 yrs | Very high | github.com/testing-library/jest-dom | [ASSUMED] | Approved — testing-library official |
| jsdom | npm | ~14 yrs | Very high | github.com/jsdom/jsdom | [ASSUMED] | Approved — jsdom org, long history |
| @vitest/coverage-v8 | npm | ~3 yrs | High | github.com/vitest-dev/vitest | [ASSUMED] | Approved — vitest-dev official |
| @types/react | npm | ~10 yrs | Very high | github.com/DefinitelyTyped/DefinitelyTyped | [ASSUMED] | Approved — DefinitelyTyped standard |
| @types/react-dom | npm | ~10 yrs | Very high | github.com/DefinitelyTyped/DefinitelyTyped | [ASSUMED] | Approved — DefinitelyTyped standard |

No postinstall scripts detected for any of these packages (verified via `npm view <pkg> scripts.postinstall`).

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

*slopcheck was unavailable at research time — all packages above are tagged `[ASSUMED]`. All are from established organizations with years of history and are standard in the React ecosystem. The planner should treat these as high-confidence despite the `[ASSUMED]` tag.*

---

## Architecture Patterns

### System Architecture Diagram

```
[Developer writes .tsx/.ts]
        |
        v
[Vite dev server (port 5173)]
   |            |
   |-- @vitejs/plugin-react  (JSX transform, Fast Refresh)
   |-- @tailwindcss/vite     (scans source, injects CSS)
        |
        v
[Browser] <--- HMR WebSocket --- [Vite HMR runtime]
        |
        v
[npm run build]
        |
        v
[dist/] ---- assets/, index.html
        |
        v
[Vercel] ---- CDN edge, SPA rewrite rule
```

### Recommended Project Structure

```
expense-splitter/
├── public/                  # Static assets (favicon, etc.)
├── src/
│   ├── assets/              # Images, fonts (imported by components)
│   ├── components/          # Reusable UI components (Phase 5+)
│   ├── store/               # useReducer + Context (Phase 4)
│   ├── engine/              # Pure calculation functions (Phase 3)
│   ├── types/               # TypeScript type definitions (Phase 2)
│   ├── App.tsx              # Root component, routing shell
│   ├── main.tsx             # React DOM entry point
│   └── index.css            # Global styles — @import "tailwindcss" here
├── index.html               # Vite HTML entry (root-level, not in src/)
├── vite.config.ts           # Vite + Tailwind plugin + Vitest test config
├── tsconfig.json            # Root TypeScript config (references app + node)
├── tsconfig.app.json        # App-specific TS config (strict, isolatedModules)
├── tsconfig.node.json       # Node/Vite config TS settings
├── vercel.json              # SPA rewrite rule for Vercel
└── src/setupTests.ts        # Vitest setup — jest-dom matchers, cleanup
```

### Pattern 1: Tailwind v4 Vite Plugin Integration

**What:** Single-line CSS import + Vite plugin replaces the entire PostCSS pipeline
**When to use:** Always — v4 eliminates `tailwind.config.js` and PostCSS config for Vite projects

```typescript
// Source: https://tailwindcss.com/docs/installation/using-vite [CITED]
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
})
```

```css
/* src/index.css — the entire Tailwind import */
/* Source: https://tailwindcss.com/docs/installation/using-vite [CITED] */
@import "tailwindcss";
```

### Pattern 2: Vitest + React Testing Library Setup

**What:** Unified test config in `vite.config.ts` with jsdom environment and jest-dom matchers
**When to use:** Always — shared config means zero duplication between dev and test pipelines

```typescript
// Source: https://vitest.dev/config/ + testing-library community docs [CITED + ASSUMED]
// src/setupTests.ts
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

afterEach(() => {
  cleanup()
})
```

```json
// tsconfig.app.json — add vitest/globals to types
{
  "compilerOptions": {
    "types": ["vite/client", "vitest/globals"]
  }
}
```

### Pattern 3: Vercel SPA Rewrite

**What:** A `vercel.json` that rewrites all paths to `index.html` so React Router (or manual navigation) works on direct URL load
**When to use:** Required for any SPA on Vercel — without it, a page refresh on any non-root URL returns a 404

```json
// Source: https://vercel.com/docs/frameworks/frontend/vite [CITED]
// vercel.json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Anti-Patterns to Avoid

- **Keeping the default Vite scaffold's demo CSS:** The scaffold ships with `App.css` and `index.css` containing demo styles. Delete demo styles immediately and replace `index.css` with `@import "tailwindcss"` as the only content. Leaving demo styles causes confusing conflicts with Tailwind classes.
- **Mixing exports in `.tsx` files:** Vite React Fast Refresh only works when a `.tsx` file exports React components exclusively. Exporting a utility function or hook from the same file breaks HMR for that file's consumers. Keep non-component exports in `.ts` files.
- **Skipping the `vercel.json` rewrite:** Vercel auto-detects Vite and sets build/output correctly, but does NOT add the SPA rewrite rule automatically. Forgetting it means every URL except `/` returns 404 when reloaded directly.
- **Installing PostCSS or `autoprefixer` for Tailwind v4:** These were required in v3 but are not needed in v4 with the Vite plugin. Adding them adds confusion with no benefit.
- **Using `@import "tailwindcss/base"` style v3 directives:** Tailwind v4 uses a single `@import "tailwindcss"` — the old v3 `@tailwind base/components/utilities` directives do not apply.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| TypeScript JSX compilation | Custom babel/esbuild transforms | `@vitejs/plugin-react` | Handles JSX transform, Fast Refresh, React compiler — deep edge cases in transform order |
| CSS utility generation | Custom PostCSS pipeline | `@tailwindcss/vite` | v4 plugin handles content scanning, CSS-first config, incremental rebuilds |
| Test environment setup | Manual JSDOM bootstrap | `vitest` + `jsdom` env setting | Handles module mocking, global injection, async test lifecycle |
| DOM assertion matchers | Custom `expect().toHave*` matchers | `@testing-library/jest-dom` | Covers accessibility-aware assertions, handles async rendering, escape hatches for all common DOM assertions |
| SPA deployment config | Custom server redirect logic | `vercel.json` rewrites | One declarative rule; roll-your-own breaks on CDN edge cases |

**Key insight:** This is a scaffold phase — every "don't hand-roll" item is an officially documented integration point. Following the official paths gives identical results in a fraction of the time.

---

## Common Pitfalls

### Pitfall 1: `@testing-library/jest-dom` matchers not recognized by TypeScript

**What goes wrong:** `toBeInTheDocument()` and similar matchers cause TypeScript errors even though tests pass at runtime.
**Why it happens:** The jest-dom types aren't in scope unless explicitly added to `tsconfig.app.json` types or referenced via the `src/setupTests.ts` import.
**How to avoid:** Add `"types": ["vitest/globals"]` to `tsconfig.app.json` and ensure `import '@testing-library/jest-dom'` is in `setupTests.ts`. The import side-effectually extends `expect`.
**Warning signs:** TypeScript error "Property 'toBeInTheDocument' does not exist on type 'Matchers<...>'"

### Pitfall 2: Tailwind classes not applying in the browser

**What goes wrong:** You add `className="text-red-500"` to a component and the text stays black.
**Why it happens:** Either (a) the `@import "tailwindcss"` line is missing from `index.css`, or (b) `index.css` is not imported in `src/main.tsx`.
**How to avoid:** Confirm `src/main.tsx` has `import './index.css'` and that `index.css` starts with `@import "tailwindcss"`. Both must be present.
**Warning signs:** DevTools shows no Tailwind-generated CSS at all; the app renders but unstyled.

### Pitfall 3: Vite scaffold template version drift

**What goes wrong:** Running `npm create vite@latest` without `--template react-ts` creates a Vanilla JS project or prompts interactively, potentially picking the wrong template.
**Why it happens:** Vite's interactive prompt defaults to Vanilla. In a non-interactive CI environment the prompt can hang.
**How to avoid:** Always pass `-- --template react-ts` to skip the prompt and get TypeScript + React: `npm create vite@latest <name> -- --template react-ts`.
**Warning signs:** Generated project has `.jsx` files instead of `.tsx`; no `tsconfig.json` is generated.

### Pitfall 4: Vercel 404 on all non-root URLs

**What goes wrong:** After deploying, navigating to `/people` or any non-root path returns a 404.
**Why it happens:** Vercel serves static files and does not know to route all paths through `index.html` for a SPA unless told explicitly.
**How to avoid:** Commit `vercel.json` with the rewrites rule before the first deployment. Verify by navigating directly to a non-root URL after deploy.
**Warning signs:** Root URL (`/`) works fine; any deeper path returns 404 from Vercel.

### Pitfall 5: HMR full-page reload instead of component swap

**What goes wrong:** Editing a component causes a full browser reload instead of a fast in-place update.
**Why it happens:** `@vitejs/plugin-react` requires a file to export only React components (PascalCase) for Fast Refresh to work. Exporting utilities, hooks, or constants from the same `.tsx` file breaks the HMR boundary.
**How to avoid:** Keep non-component exports (hooks, utilities, constants) in separate `.ts` files. Components go in `.tsx` files that export only components.
**Warning signs:** Browser tab refreshes fully on every save; Vite console shows "full reload" instead of "hmr update".

---

## Code Examples

### Smoke test for the scaffold (verifies everything is wired up)

```typescript
// Source: testing-library docs + Vitest docs [ASSUMED — standard pattern]
// src/App.test.tsx
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App scaffold', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(document.body).toBeInTheDocument()
  })
})
```

### main.tsx entry point pattern

```typescript
// Source: Vite react-ts template [CITED: vite.dev/guide/]
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### index.css — the entire file content at scaffold time

```css
/* Source: https://tailwindcss.com/docs/installation/using-vite [CITED] */
@import "tailwindcss";
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind v3 with `tailwind.config.js` + PostCSS | Tailwind v4 with `@tailwindcss/vite` plugin + CSS-first `@theme {}` | Tailwind v4 (Jan 2025) | Zero PostCSS config; `tailwind.config.js` eliminated; `@tailwind` directives replaced by `@import "tailwindcss"` |
| Separate `jest.config.js` for tests | `test:` block inside `vite.config.ts` | Vitest 1.0 (2023) | Single config file; same module resolution; no babel setup |
| `@tailwind base/components/utilities` directives | `@import "tailwindcss"` single import | Tailwind v4 | Simpler, CSS-spec compliant |
| `<TypescriptReference types="vitest" />` triple-slash | Add `"vitest/globals"` to tsconfig types array | Vitest 1.x+ | Cleaner; no magic comment needed |

**Deprecated/outdated:**
- `tailwind.config.js`: Fully replaced by CSS-first `@theme {}` in v4; do not create this file
- `postcss.config.js` for Tailwind: Not needed with `@tailwindcss/vite`; adding it causes conflicts
- `@tailwind base`, `@tailwind components`, `@tailwind utilities` CSS directives: v3 only; use `@import "tailwindcss"` in v4

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | All packages in the Package Legitimacy Audit are from established, trustworthy organizations | Package Legitimacy Audit | Low — all verified to have authoritative source repos from known orgs (Meta, Microsoft, Evan You, Tailwind Labs, vitest-dev, testing-library) |
| A2 | Download volumes listed as "Very high" / "High" reflect actual npm weekly download counts | Package Legitimacy Audit | Low — these are major packages; the relative claim is well established |
| A3 | `@testing-library/jest-dom` import in setupTests.ts is sufficient to extend Vitest's expect without explicit `expect.extend(matchers)` call | Code Examples | Low — this is the documented approach for jest-dom >=6.x; if it fails, explicit extend is a one-line fix |

---

## Open Questions

1. **Deployment target: Vercel vs Netlify**
   - What we know: CLAUDE.md lists both as acceptable; Vercel CLI (`vercel --prod`) is installed locally (v54.4.1)
   - What's unclear: Which platform the user prefers for this project
   - Recommendation: Default to Vercel since the CLI is already installed; the rewrite rule is identical for both. Planner can note Netlify as an alternative with a `_redirects` file instead.

2. **GitHub repository existence**
   - What we know: The project directory is not currently a git repo (per environment context)
   - What's unclear: Whether the user already has a remote repo, or if the planner should include `git init` + `gh repo create` tasks
   - Recommendation: Include git initialization and GitHub repo creation as explicit tasks in the plan; treat it as absent.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Vite, npm, all tooling | Yes | v26.0.0 | — |
| npm | Package installation | Yes | 11.12.1 | — |
| Vercel CLI | Deployment pipeline | Yes | 54.4.1 | Netlify drag-and-drop or `netlify-cli` |
| Git | Version control, CI/CD trigger | Unknown | Unknown | `git init` task in plan |
| GitHub repo | Vercel/Netlify CI integration | Unknown | — | `gh repo create` task in plan |

**Missing dependencies with no fallback:** None that block execution.

**Missing dependencies with fallback:**
- Git / GitHub repo: Unknown state — plan must include initialization steps.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.7 |
| Config file | `vite.config.ts` (test block) — Wave 0 creates this |
| Quick run command | `npm test` |
| Full suite command | `npm test -- --run` |

### Phase Requirements → Test Map

This phase has no functional requirements (pure scaffold). The single test is a smoke test verifying the scaffold wires together correctly.

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SCAFFOLD-SMOKE | App renders without crashing | unit (smoke) | `npm test -- --run src/App.test.tsx` | No — Wave 0 |

### Sampling Rate

- **Per task commit:** `npm test -- --run`
- **Per wave merge:** `npm test -- --run`
- **Phase gate:** Full suite green before marking phase complete

### Wave 0 Gaps

- [ ] `src/App.test.tsx` — smoke test for scaffold
- [ ] `src/setupTests.ts` — jest-dom matchers + cleanup
- [ ] Vitest test block in `vite.config.ts` — environment: jsdom, globals: true, setupFiles

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | — (no auth in scaffold) |
| V3 Session Management | No | — (no sessions) |
| V4 Access Control | No | — (no access control) |
| V5 Input Validation | No | — (no user input in scaffold) |
| V6 Cryptography | No | — (no crypto) |

This phase introduces no user-facing features or data handling. The only security-relevant decision is the `vercel.json` rewrite rule — it is permissive by design (routes all paths to `index.html`). No ASVS requirements apply to a project scaffold phase.

---

## Sources

### Primary (HIGH confidence)

- `https://tailwindcss.com/docs/installation/using-vite` — Tailwind v4 Vite integration steps (verified via WebFetch 2026-05-25)
- `https://vercel.com/docs/frameworks/frontend/vite` — Vercel Vite deployment, SPA rewrite requirement (verified via WebFetch 2026-05-25)
- npm registry — All package versions confirmed via `npm view <pkg> version` and `npm view <pkg> dist-tags.latest time.modified` on 2026-05-25

### Secondary (MEDIUM confidence)

- `https://vitest.dev/config/` — Vitest configuration options (referenced via WebSearch + WebFetch)
- `https://vitest.dev/blog/vitest-3-2.html` — Vitest 3.2 release notes (verified via WebFetch 2026-05-25)
- `https://vite.dev/guide/` — Vite scaffold command and project structure (referenced via WebFetch)

### Tertiary (LOW confidence)

- Community guides on Vitest + @testing-library/react setup — cross-verified across multiple DEV Community and Medium articles; pattern is consistent but not from official sources

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified on npm registry against official repos
- Architecture: HIGH — Tailwind v4 + Vercel integration verified via official docs
- Pitfalls: MEDIUM — HMR and jest-dom issues verified from official Vite/Vitest sources; Tailwind CSS issues from official docs

**Research date:** 2026-05-25
**Valid until:** 2026-06-25 (30 days — stack is stable, Tailwind v4 just released minor version)
