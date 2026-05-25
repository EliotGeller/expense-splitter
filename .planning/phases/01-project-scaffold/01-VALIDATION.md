---
phase: 1
slug: project-scaffold
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-25
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | vite.config.ts (test block) |
| **Quick run command** | `npm test` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | — | — | N/A | smoke | `npm run dev -- --host 2>&1 &` | ❌ W0 | ⬜ pending |
| 01-01-02 | 01 | 1 | — | — | N/A | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| 01-01-03 | 01 | 1 | — | — | N/A | build | `npm run build` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/App.test.tsx` — smoke test for default App component
- [ ] `src/setupTests.ts` — testing-library/jest-dom imports and cleanup
- [ ] Vitest + @testing-library/react installed as devDependencies

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Tailwind classes render visually | SC-3 | Visual rendering requires browser | Open dev server, inspect element for Tailwind utility class styles |
| Vercel deployment succeeds | SC-4 | Requires cloud deploy + URL check | Push to main, verify production URL loads |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
