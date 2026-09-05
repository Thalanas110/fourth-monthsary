# Component Organization Implementation Plan

> **For inline implementation:** This refactor is being executed in the current workspace without subagents or worktrees.

**Goal:** Organize the existing React components into the `errors`, `main`, and `poems` categories without changing runtime behavior.

**Architecture:** Preserve each component's export and responsibility while moving files with history-preserving renames. Update all absolute imports and tests to use the new category paths; no barrel files or API changes are needed.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Git.

---

### Task 1: Lock the component map

**Files:**
- Create: `test/components/component-organization.test.ts`
- Read: `src/components/errors/`, `src/components/main/`, `src/components/poems/`

- [ ] **Step 1: Write the structural test**

  Assert that every component belongs to exactly one category and that the old root-level component paths are absent.

- [ ] **Step 2: Run the structural test and verify it fails**

  Run `npm.cmd test -- test/components/component-organization.test.ts` and confirm it fails because the files are still at the component root.

### Task 2: Move components by responsibility

**Files:**
- Move: `src/components/error-boundary.tsx` -> `src/components/errors/error-boundary.tsx`
- Move: `src/components/ambient-field.tsx` -> `src/components/main/ambient-field.tsx`
- Move: `src/components/hero-section.tsx` -> `src/components/main/hero-section.tsx`
- Move: `src/components/ritual-section.tsx` -> `src/components/main/ritual-section.tsx`
- Move: `src/components/site-header.tsx` -> `src/components/main/site-header.tsx`
- Move: `src/components/empty-results.tsx` -> `src/components/poems/empty-results.tsx`
- Move: `src/components/mood-filter.tsx` -> `src/components/poems/mood-filter.tsx`
- Move: `src/components/poem-card.tsx` -> `src/components/poems/poem-card.tsx`
- Move: `src/components/poem-library.tsx` -> `src/components/poems/poem-library.tsx`
- Move: `src/components/poem-reader.tsx` -> `src/components/poems/poem-reader.tsx`
- Move: `src/components/poem-search.tsx` -> `src/components/poems/poem-search.tsx`

- [ ] **Step 1: Rename files into their categories**

  Use `git mv` so Git can preserve the existing file history.

- [ ] **Step 2: Update imports**

  Update `src/App.tsx`, `src/main.tsx`, `src/components/poems/poem-library.tsx`, and component tests to use `@/components/errors/...`, `@/components/main/...`, and `@/components/poems/...`.

### Task 3: Verify the refactor

**Files:**
- Verify: all moved component files and importers

- [ ] **Step 1: Run the structural test**

  Run `npm.cmd test -- test/components/component-organization.test.ts` and confirm it passes.

- [ ] **Step 2: Run the full checks**

  Run `npm.cmd run typecheck`, `npm.cmd test`, `npm.cmd run build`, and `git diff --check`.

- [ ] **Step 3: Audit the working tree**

  Confirm there are no stale root-level component files or broken import paths.
