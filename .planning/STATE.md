# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-05-25)

**Core value:** Accurately split any bill in under a minute, so nobody overpays and nobody has to do mental math.
**Current focus:** Phase 1 — Project Scaffold

## Current Position

Phase: 1 of 10 (Project Scaffold)
Plan: 0 of TBD in current phase
Status: Ready to plan
Last activity: 2026-05-25 — Roadmap created, STATE.md initialized

Progress: [░░░░░░░░░░] 0%

## Performance Metrics

**Velocity:**
- Total plans completed: 0
- Average duration: —
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

**Recent Trend:**
- Last 5 plans: —
- Trend: —

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Stack: React 19 + TypeScript 6 + Vite 6 + Tailwind CSS 4 (from research)
- Math: All money stored as integer cents to eliminate floating-point bugs
- State: useReducer + Context single-atom pattern; no external state library
- Assignments: modeled as `Record<itemId, personId[]>` (not boolean isShared)
- Share: Web Share API with Clipboard fallback

### Pending Todos

None yet.

### Blockers/Concerns

- Open question: when proportional split is selected and a person has $0 personal subtotal, do they owe $0 tip or an equal share? Needs product decision before Phase 8.

## Deferred Items

| Category | Item | Status | Deferred At |
|----------|------|--------|-------------|
| *(none)* | | | |

## Session Continuity

Last session: 2026-05-25
Stopped at: Roadmap and STATE.md created. Ready to plan Phase 1.
Resume file: None
