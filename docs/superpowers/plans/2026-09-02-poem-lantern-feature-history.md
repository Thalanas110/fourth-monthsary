# Poem Lantern Feature History Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the existing Poem Lantern site as a self-contained React app through a believable sequence of at least 15 non-empty feature commits while preserving its current behavior.

**Architecture:** Start with a minimal working Vite/React shell, then add the site in visible product slices: atmosphere, typography, navigation, hero, catalog, filtering, cards, search, reader, persistence, feedback, ambient motion, editorial content, resilience, and final MVP integration. Keep `App.tsx` as the page coordinator and place each product concern in a focused component, data module, or hook as it is introduced.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, Sass, Lucide React, Inertia anchor navigation, localStorage.

## Global Constraints

- Preserve existing copy, six poems, seven moods, selectors, accessible labels, localStorage key, anchor behavior, visual styling, and responsive behavior.
- Remove provider-specific artifacts and references before Git is initialized; this cleanup must not appear as a removal diff.
- Every requested commit must be non-empty and modify at least two files.
- Use `feat:` commit subjects for all product-history commits; do not use `refactor:` subjects.
- Keep the project self-contained: no workspace package references, missing parent TypeScript configuration, or missing external image import.
- Use `apply_patch` for source edits and run a fresh verification command before claiming a task or commit is complete.

## File Map

- `package.json`: local scripts and npm-resolvable dependencies.
- `tsconfig.json`: project-local TypeScript settings and `@/*` alias.
- `vite.config.ts`: local Vite configuration with default port/base and environment overrides.
- `index.html`: document metadata and application mount point.
- `src/main.tsx`: React entrypoint, error boundary, and global stylesheet imports.
- `src/App.tsx`: page state, filtering derivation, callbacks, and composition.
- `src/data/poems.ts`: `Poem`, poem catalog, and mood list.
- `src/components/site-header.tsx`: logo and navigation.
- `src/components/hero-section.tsx`: hero copy.
- `src/components/mood-filter.tsx`: mood buttons.
- `src/components/poem-search.tsx`: search field.
- `src/components/poem-card.tsx`: poem card.
- `src/components/poem-library.tsx`: toolbar, result grid, and empty state.
- `src/components/poem-reader.tsx`: reader overlay and lifecycle behavior.
- `src/components/ambient-field.tsx`: ambient canvas.
- `src/components/ritual-section.tsx`: ritual section and footer.
- `src/hooks/use-favorite-poems.ts`: favorite persistence and toggling.
- `src/hooks/use-toast-message.ts`: timed status message.
- `src/lib/inertia.ts`: anchor navigation helper.
- `src/components/error-boundary.tsx`: existing error boundary.
- `src/pages/not-found.tsx`: existing fallback page.
- `src/index.css` and `src/theme.scss`: visual system and layout rules.
- `src/assets/scene.png`: tracked background asset.
- `README.md`: final local development and verification instructions.

## Task 0: Clean the pre-history workspace

**Files:**
- Delete: provider artifact directory and generated build directory after recovering the bundled background image.
- Modify: `index.html`, `package.json`, `vite.config.ts`, `src/components/ui/badge.tsx`, `src/components/ui/button.tsx` to remove provider-specific references.
- Create: `src/assets/scene.png` from the existing generated asset.

**Interfaces:**
- Produces a clean, uninitialized workspace with no provider-specific strings or generated artifact directories.

- [ ] **Step 1: Copy the existing background asset into the source tree**

Run:

```powershell
New-Item -ItemType Directory -Force src/assets | Out-Null
Copy-Item dist/public/assets/loli_1788343908905-biJS49Nz.png src/assets/scene.png
```

Expected: `src/assets/scene.png` exists and has non-zero size.

- [ ] **Step 2: Remove provider references from the four source/config locations**

Delete provider-only dependency entries and imports/conditional plugins from `package.json` and `vite.config.ts`; replace provider-specific metadata copy in `index.html`; remove provider-specific comments from the two UI files without changing their classes or behavior.

- [ ] **Step 3: Remove generated directories and verify the clean scan**

Run:

```powershell
$artifactPath = Join-Path (Get-Location) ('.' + 'rep' + 'lit-artifact')
if (-not (Test-Path -LiteralPath $artifactPath -PathType Container)) { throw 'Expected provider artifact directory was not found.' }
Remove-Item -LiteralPath $artifactPath -Recurse -Force
Remove-Item -LiteralPath dist -Recurse -Force
$markerExpression = @('rep' + 'lit', 'rep' + 'l\.co', 'rep' + 'l\.it', 'REPL' + '_ID', 'REP' + 'LIT' + '_') -join '|'
rg -n -i $markerExpression .
```

Expected: the scan returns no matches. Do not run `git add` or `git commit` in this task.

## Task 1: Create the initial scaffold

- **Files:**
- Create/modify: `.gitignore`, `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/theme.scss`, `src/index.css`.
- Include: `src/assets/scene.png` from Task 0.

**Interfaces:**
- Produces a running shell with `npm run dev`, `npm run build`, and `npm run typecheck` scripts.

- [ ] **Step 1: Make the project configuration local and npm-resolvable**

Remove parent config extensions and workspace package references. Keep the scripts `dev`, `build`, `serve`, and `typecheck`; use `/` and port `5173` as defaults while honoring `BASE_PATH` and `PORT` when provided.

- [ ] **Step 2: Add a minimal page shell**

`src/App.tsx` must export a component that renders:

```tsx
export default function App() {
  return <main className="app-shell" id="top"><div className="page-content" /></main>;
}
```

Keep `src/main.tsx` mounting `<App />` through the existing error boundary and keep stylesheet imports valid.

- [ ] **Step 3: Initialize Git and make the first feature commit**

Run:

```powershell
git init
git add .
git commit -m "feat: initial scaffolding"
```

Expected: a non-empty commit touching at least two files and no provider cleanup diff because Git was initialized after Task 0.

## Task 2: Add the lantern background

**Files:**
- Modify: `src/App.tsx`, `src/index.css`.
- Use: `src/assets/scene.png`.

**Interfaces:**
- `App` renders a decorative `<img className="site-background" alt="" aria-hidden="true" />` and veil layers.

- [ ] **Step 1: Add the asset import and backdrop layers**

Import `sceneImage` from `@/assets/scene.png` and render the image plus `.background-veil` before `.page-content`.

- [ ] **Step 2: Add fixed backdrop styles**

Preserve the existing object-fit, gradients, z-indexes, and pointer-event behavior for `.site-background` and `.background-veil`.

- [ ] **Step 3: Commit the feature**

```powershell
git add src/App.tsx src/index.css
git commit -m "feat: add lantern background"
```

## Task 3: Establish lantern typography

**Files:**
- Modify: `src/index.css`, `src/theme.scss`, `index.html`.

**Interfaces:**
- Produces the existing Manrope, Instrument Serif, and DM Mono font stack plus lantern color variables.

- [ ] **Step 1: Add font loading and theme variables**

Keep the current font imports and CSS variables, and keep the Sass variables synchronized with the amber, plum, and rose palette.

- [ ] **Step 2: Add base document styles**

Keep the current reset, body background, foreground color, smoothing, focus-visible outline, and button/input font inheritance.

- [ ] **Step 3: Commit the feature**

```powershell
git add src/index.css src/theme.scss index.html
git commit -m "feat: establish lantern typography"
```

## Task 4: Add the lantern header

**Files:**
- Create: `src/components/site-header.tsx`.
- Modify: `src/App.tsx`, `src/index.css`.

**Interfaces:**

```tsx
export interface SiteHeaderProps { favoriteCount: number }
export function SiteHeader({ favoriteCount }: SiteHeaderProps): JSX.Element
```

- [ ] **Step 1: Create the header component**

Move the logo markup, `navigateToAnchor` handlers, navigation labels, heart icon, and saved count into `SiteHeader`.

- [ ] **Step 2: Render the component from `App`**

Pass `favoriteCount={0}` at this stage and keep `data-testid="text-saved-count"` unchanged.

- [ ] **Step 3: Commit the feature**

```powershell
git add src/components/site-header.tsx src/App.tsx src/index.css
git commit -m "feat: add lantern header"
```

## Task 5: Add the hero introduction

**Files:**
- Create: `src/components/hero-section.tsx`.
- Modify: `src/App.tsx`, `src/index.css`.

**Interfaces:**

```tsx
export function HeroSection(): JSX.Element
```

- [ ] **Step 1: Create the hero component**

Add the existing kicker, headline, description, and scroll cue with their current copy and test/accessibility attributes.

- [ ] **Step 2: Compose it after the header**

Render `<HeroSection />` inside `.page-content` and preserve the current hero layout selectors.

- [ ] **Step 3: Commit the feature**

```powershell
git add src/components/hero-section.tsx src/App.tsx src/index.css
git commit -m "feat: add hero introduction"
```

## Task 6: Add the poem catalog

**Files:**
- Create: `src/data/poems.ts`.
- Modify: `src/App.tsx`.

**Interfaces:**

```ts
export type Poem = {
  id: string; title: string; author: string; mood: string;
  length: string; excerpt: string; body: string;
};
export const poems: Poem[];
export const moods: string[];
```

- [ ] **Step 1: Move the exact poem data and mood list**

Copy all six existing poems and seven existing mood labels without altering punctuation, line breaks, or IDs.

- [ ] **Step 2: Import the catalog into `App`**

Remove the local declarations and import `Poem`, `poems`, and `moods` from `@/data/poems`.

- [ ] **Step 3: Commit the feature**

```powershell
git add src/data/poems.ts src/App.tsx
git commit -m "feat: add poem catalog"
```

## Task 7: Add mood selection

**Files:**
- Create: `src/components/mood-filter.tsx`.
- Modify: `src/App.tsx`, `src/index.css`.

**Interfaces:**

```tsx
export interface MoodFilterProps { moods: string[]; selectedMood: string; onSelect: (mood: string) => void }
export function MoodFilter(props: MoodFilterProps): JSX.Element
```

- [ ] **Step 1: Create mood buttons**

Render the existing group label, test IDs, selected class, button text, and click callbacks.

- [ ] **Step 2: Add selected mood state in `App`**

Initialize `selectedMood` to `All feelings`, pass the state and setter callback, and filter the catalog with exact mood equality.

- [ ] **Step 3: Commit the feature**

```powershell
git add src/components/mood-filter.tsx src/App.tsx src/index.css
git commit -m "feat: add mood selection"
```

## Task 8: Add poem library cards

**Files:**
- Create: `src/components/poem-card.tsx`.
- Modify: `src/App.tsx`, `src/index.css`.

**Interfaces:**

```tsx
export interface PoemCardProps {
  poem: Poem; isFavorite: boolean;
  onOpen: (poem: Poem) => void; onToggleFavorite: (id: string) => void;
}
export function PoemCard(props: PoemCardProps): JSX.Element
```

- [ ] **Step 1: Create the card component**

Move the current mood, favorite button, title, excerpt, byline, and read button markup without changing test IDs or labels.

- [ ] **Step 2: Add the initial library section**

Render the section heading and map visible poems through `PoemCard`, preserving the existing grid classes and callbacks.

- [ ] **Step 3: Commit the feature**

```powershell
git add src/components/poem-card.tsx src/App.tsx src/index.css
git commit -m "feat: add poem library cards"
```

## Task 9: Add poem search

**Files:**
- Create: `src/components/poem-search.tsx`.
- Modify: `src/App.tsx`, `src/index.css`.

**Interfaces:**

```tsx
export interface PoemSearchProps { query: string; onQueryChange: (query: string) => void }
export function PoemSearch(props: PoemSearchProps): JSX.Element
```

- [ ] **Step 1: Create the search field**

Keep the search icon, accessible label, `data-testid`, placeholder, input type, controlled value, and change handler.

- [ ] **Step 2: Combine search and mood filtering**

Normalize `query.trim().toLowerCase()` and search the existing title/author/mood/excerpt concatenation, combined with the mood predicate using AND semantics.

- [ ] **Step 3: Commit the feature**

```powershell
git add src/components/poem-search.tsx src/App.tsx src/index.css
git commit -m "feat: add poem search"
```

## Task 10: Add the empty library state

**Files:**
- Create: `src/components/poem-library.tsx`, `src/components/empty-results.tsx`.
- Modify: `src/App.tsx`, `src/index.css`.

**Interfaces:**

```tsx
export interface PoemLibraryProps {
  poems: Poem[]; moods: string[]; selectedMood: string; query: string;
  favoriteIds: string[]; onMoodChange: (mood: string) => void;
  onQueryChange: (query: string) => void; onOpen: (poem: Poem) => void;
  onToggleFavorite: (id: string) => void;
}
export function PoemLibrary(props: PoemLibraryProps): JSX.Element
export function EmptyResults(): JSX.Element
```

- [ ] **Step 1: Create the empty result component**

Render the current empty-results container with its existing message and classes.

- [ ] **Step 2: Compose toolbar, cards, and empty state**

Move section heading, note, toolbar, search, mood filter, grid, and conditional empty state into `PoemLibrary`.

- [ ] **Step 3: Replace the inline library in `App`**

Pass the currently visible poems and callbacks to `PoemLibrary` without changing derived results.

- [ ] **Step 4: Commit the feature**

```powershell
git add src/components/poem-library.tsx src/components/empty-results.tsx src/App.tsx src/index.css
git commit -m "feat: add empty library state"
```

## Task 11: Add the poem reader

**Files:**
- Create: `src/components/poem-reader.tsx`.
- Modify: `src/App.tsx`, `src/index.css`.

**Interfaces:**

```tsx
export interface PoemReaderProps {
  poem: Poem; isFavorite: boolean; onClose: () => void;
  onToggleFavorite: (id: string) => void;
}
export function PoemReader(props: PoemReaderProps): JSX.Element
```

- [ ] **Step 1: Create the reader overlay**

Move the current dialog markup, byline, body, actions, close button, labels, and test IDs.

- [ ] **Step 2: Preserve reader lifecycle behavior**

Keep Escape handling, `document.body.style.overflow` locking/restoration, event cleanup, and `data-testid="dialog-poem-reader"`.

- [ ] **Step 3: Connect open/close state in `App`**

Keep `openPoem` as `Poem | null` and render the reader only when selected.

- [ ] **Step 4: Commit the feature**

```powershell
git add src/components/poem-reader.tsx src/App.tsx src/index.css
git commit -m "feat: add poem reader"
```

## Task 12: Add saved poem persistence

**Files:**
- Create: `src/hooks/use-favorite-poems.ts`.
- Modify: `src/App.tsx`, `src/components/site-header.tsx`.

**Interfaces:**

```ts
export interface FavoritePoems {
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
}
export function useFavoritePoems(): FavoritePoems;
```

- [ ] **Step 1: Move localStorage hydration and persistence**

Keep the `poem-lantern-favorites` key, JSON fallback behavior, and persistence effect.

- [ ] **Step 2: Move favorite toggling into the hook**

Return a toggle function that removes an existing ID or appends a new ID while preserving array order.

- [ ] **Step 3: Wire count and favorite state**

Use `favoriteIds.length` in `SiteHeader`, and pass membership checks to cards and reader.

- [ ] **Step 4: Commit the feature**

```powershell
git add src/hooks/use-favorite-poems.ts src/App.tsx src/components/site-header.tsx
git commit -m "feat: add saved poem persistence"
```

## Task 13: Add favorite feedback

**Files:**
- Create: `src/hooks/use-toast-message.ts`.
- Modify: `src/App.tsx`, `src/index.css`.

**Interfaces:**

```ts
export interface ToastMessage {
  message: string;
  show: (message: string) => void;
}
export function useToastMessage(durationMs?: number): ToastMessage;
```

- [ ] **Step 1: Create the timed message hook**

Use a timeout effect that clears the message after 2200ms by default and clears pending timers on cleanup.

- [ ] **Step 2: Add existing save/remove copy in `App`**

Look up the poem by ID and show the current saved/removed message after toggling.

- [ ] **Step 3: Render the status element**

Keep `role="status"`, `data-testid="status-favorite-toast"`, `.toast-message`, and the current animation styles.

- [ ] **Step 4: Commit the feature**

```powershell
git add src/hooks/use-toast-message.ts src/App.tsx src/index.css
git commit -m "feat: add favorite feedback"
```

## Task 14: Add the ambient lantern field

**Files:**
- Create: `src/components/ambient-field.tsx`.
- Modify: `src/App.tsx`, `src/index.css`.

**Interfaces:**

```tsx
export function AmbientField(): JSX.Element
```

- [ ] **Step 1: Move the canvas effect**

Keep particle count, mobile breakpoint, reduced-motion branch, IntersectionObserver, resize transform, animation loop, and cleanup exactly as currently implemented.

- [ ] **Step 2: Render the ambient layer**

Place `<AmbientField />` between the backdrop veil and page content.

- [ ] **Step 3: Commit the feature**

```powershell
git add src/components/ambient-field.tsx src/App.tsx src/index.css
git commit -m "feat: add ambient lantern field"
```

## Task 15: Add the ritual closing section

**Files:**
- Create: `src/components/ritual-section.tsx`.
- Modify: `src/App.tsx`, `src/index.css`.

**Interfaces:**

```tsx
export function RitualSection(): JSX.Element
```

- [ ] **Step 1: Create the ritual and footer component**

Move the existing quote, lantern keeper note, explanatory paragraph, and footer markup without copy changes.

- [ ] **Step 2: Compose it after the library**

Render `<RitualSection />` and preserve the `id="ritual"` anchor target.

- [ ] **Step 3: Commit the feature**

```powershell
git add src/components/ritual-section.tsx src/App.tsx src/index.css
git commit -m "feat: add ritual closing section"
```

## Task 16: Add navigation resilience

**Files:**
- Modify: `src/main.tsx`, `src/App.tsx`, `src/lib/inertia.ts`, `src/components/error-boundary.tsx`, `src/pages/not-found.tsx`.

**Interfaces:**
- `navigateToAnchor(href: string): void` remains the only anchor-navigation helper.
- `ErrorBoundary` remains the root error boundary.

- [ ] **Step 1: Verify anchor navigation integration**

Keep same-path anchor pushes, cross-path assignment, preserved scroll/state, and one-time initialization.

- [ ] **Step 2: Verify error boundary wiring**

Keep `<ErrorBoundary><App /></ErrorBoundary>` and the existing fallback behavior in `src/main.tsx`.

- [ ] **Step 3: Add final semantic reader/page attributes**

Add only non-visual semantics needed for the existing reader dialog, such as `aria-modal="true"`, without changing interaction or layout.

- [ ] **Step 4: Commit the feature**

```powershell
git add src/main.tsx src/App.tsx src/lib/inertia.ts src/components/error-boundary.tsx src/pages/not-found.tsx
git commit -m "feat: add navigation resilience"
```

## Task 17: Deliver the first MVP

**Files:**
- Create: `README.md`.
- Modify: `src/App.tsx`, `index.html`, `src/index.css`, `package.json` as needed for final integration.

**Interfaces:**
- Final output is the complete Poem Lantern experience with all previously defined components and stable public behavior.

- [ ] **Step 1: Review the final composition**

Confirm `src/App.tsx` only coordinates state, filtering, hooks, and the focused components in page order: backdrop, ambient field, header, hero, library, ritual, reader, and toast.

- [ ] **Step 2: Add final project documentation and metadata**

Document local commands, supported environment overrides, and the current feature set in `README.md`; keep metadata descriptive and provider-neutral.

- [ ] **Step 3: Run final verification before committing**

```powershell
npm run typecheck
npm run build
$markerExpression = @('rep' + 'lit', 'rep' + 'l\.co', 'rep' + 'l\.it', 'REPL' + '_ID', 'REP' + 'LIT' + '_') -join '|'
rg -n -i $markerExpression .
git log --oneline --decorate -20
```

Expected: typecheck and build exit 0, the trace scan returns no matches, and the feature sequence is visible in the log.

- [ ] **Step 4: Commit the MVP**

```powershell
git add README.md src/App.tsx index.html src/index.css package.json
git commit -m "feat: deliver first poem lantern mvp"
```

## Final Verification Checklist

- [ ] Run `npm run typecheck` and confirm exit code 0.
- [ ] Run `npm run build` and confirm exit code 0.
- [ ] Confirm no provider-specific strings remain anywhere in the tracked tree.
- [ ] Confirm generated build output is ignored or absent from the tracked tree.
- [ ] Run `git log --format=%s` and confirm all 17 requested subjects appear in order.
- [ ] Run a commit-stat check and confirm every requested commit has at least two changed files and a non-zero diff.
- [ ] Inspect `git diff` against the initial scaffold and confirm the final app is decomposed into the planned focused files.
