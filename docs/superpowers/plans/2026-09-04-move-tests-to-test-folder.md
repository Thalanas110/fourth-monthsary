# Move Tests to Test Folder Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move every test out of `src/` into a root `test/` tree with source-mirroring ownership and keep the tests included in Vitest and TypeScript verification.

**Architecture:** Organize tests under `test/` using the same domain folders as `src/` (`test/data` and `test/hooks`) while keeping the app-level test at the root. Configure Vitest to discover only the dedicated test tree and extend TypeScript’s checked files to include it. Use the existing `@/*` alias so tests import production modules consistently from any test location.

**Tech Stack:** React 19, TypeScript, Vite, Vitest 3.

---

### Task 1: Establish the dedicated test boundary

**Files:**
- Modify: `vite.config.ts`
- Modify: `tsconfig.json`

- [x] **Step 1: Configure Vitest discovery**

  Change the Vite config import to `defineConfig` from `vitest/config` and add a `test.include` glob covering JavaScript and TypeScript test files below `test/`.

- [x] **Step 2: Include relocated tests in TypeScript checking**

  Change `tsconfig.json`’s `include` list from only `src` to `src` and `test`.

- [x] **Step 3: Verify the configuration edits**

  Run: `npm run typecheck`

  Expected: exit code 0.

### Task 2: Relocate tests by ownership

**Files:**
- Delete: `src/App.test.tsx`
- Create: `test/App.test.tsx`
- Delete: `src/data/poems.test.ts`
- Create: `test/data/poems.test.ts`
- Delete: `src/hooks/use-favorite-poems.test.ts`
- Create: `test/hooks/use-favorite-poems.test.ts`
- Delete: `src/hooks/use-toast-message.test.ts`
- Create: `test/hooks/use-toast-message.test.ts`

- [x] **Step 1: Move the application test**

  Preserve its assertions and update its production import to `@/App`.

- [x] **Step 2: Move the data test**

  Preserve its assertions and update its production import to `@/data/poems`.

- [x] **Step 3: Move the hook tests**

  Preserve both test bodies and update imports to `@/hooks/use-favorite-poems` and `@/hooks/use-toast-message`.

- [x] **Step 4: Confirm no tests remain under `src/`**

  Run: `rg --files src -g '*test*' -g '*spec*'`

  Expected: no output.

### Task 3: Verify the relocated test architecture

**Files:**
- Verify: `test/`
- Verify: `vite.config.ts`
- Verify: `tsconfig.json`

- [x] **Step 1: Run the full test suite**

  Run: `npm test`

  Expected: all four test files and all four tests pass with zero failures.

- [x] **Step 2: Run type checking**

  Run: `npm run typecheck`

  Expected: exit code 0.

- [x] **Step 3: Run the production build**

  Run: `npm run build`

  Expected: exit code 0 and a successful Vite build.

- [x] **Step 4: Inspect the final diff and status**

  Run: `git diff -- vite.config.ts tsconfig.json src test` and `git status --short`

  Expected: the four test files appear as moves into `test/`, configuration contains the dedicated test boundary, and the pre-existing `package-lock.json` modification remains untouched.
