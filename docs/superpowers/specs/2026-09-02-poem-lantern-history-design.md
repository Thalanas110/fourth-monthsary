# Poem Lantern History and App Decomposition Design

## Goal

Preserve the existing Poem Lantern single-page experience while making the project self-contained and assembling it through focused, independently understandable product slices. Establish a clean Git history that starts at `feat: initial scaffolding` and reaches `feat: deliver first poem lantern mvp` through at least 15 meaningful feature commits.

## Constraints

- Existing visual styling, poem content, interactions, copy, and runtime behavior must remain unchanged unless required to make the local project run.
- The working tree must be cleaned of provider-specific artifacts and references before Git is initialized.
- The cleanup must not appear as a removal diff in any commit.
- Every commit in the requested sequence must be non-empty and modify at least two files.
- The final app must remain a Vite-powered React TypeScript app.
- Existing `data-testid` values, accessible labels, localStorage key, and anchor behavior must remain stable.

## Architecture

`src/App.tsx` will serve as the page coordinator as the site is assembled. It will retain page-level state and compose focused components rather than containing the implementation of every screen section.

The focused units are:

- `src/data/poems.ts`: `Poem` type, poem catalog, and mood options.
- `src/components/ambient-field.tsx`: canvas particles, visibility handling, resizing, reduced-motion behavior, and cleanup.
- `src/components/site-header.tsx`: logo, navigation links, and saved count.
- `src/components/hero-section.tsx`: hero copy and scroll cue.
- `src/components/poem-card.tsx`: poem metadata, favorite action, and read action.
- `src/components/poem-reader.tsx`: modal reader, close behavior, favorite action, and body-scroll locking.
- `src/components/ritual-section.tsx`: closing editorial section.
- `src/components/mood-filter.tsx`: mood selection controls.
- `src/components/poem-search.tsx`: search field and query updates.
- `src/components/poem-library.tsx`: library toolbar, result grid, and empty state composition.
- `src/hooks/use-favorite-poems.ts`: localStorage-backed favorite state and toggle behavior.
- `src/hooks/use-toast-message.ts`: timed status message state.
- `src/lib/inertia.ts`: existing anchor-navigation integration.

The missing external background import will be replaced with a tracked local image derived from the existing generated output. The Vite and TypeScript settings will be local to this project while retaining support for externally supplied port and base-path values.

## Data Flow and Invariants

`App` owns `selectedMood`, `query`, `openPoem`, and composition callbacks. It obtains favorite IDs and favorite actions from `useFavoritePoems`, and toast state from `useToastMessage`. It derives visible poems using the existing AND combination of mood and case-insensitive search matching against title, author, mood, and excerpt.

The following behaviors are invariants:

- Six poems and seven mood choices remain unchanged.
- Favorites continue to use the `poem-lantern-favorites` localStorage key.
- Favorite labels, icons, count, and toast copy remain consistent with the current state.
- The reader closes from its close control or Escape, locks body scrolling while open, and restores it on cleanup.
- Existing anchor navigation continues through `navigateToAnchor`.
- Responsive layout, reduced-motion handling, visual selectors, and test IDs remain stable.

## Commit Sequence

After the pre-history cleanup and Git initialization, create these feature commits:

1. `feat: initial scaffolding` — self-contained project setup, entrypoint, global styles, public metadata, and a working initial page.
2. `feat: add lantern background` — local background asset and atmospheric page backdrop.
3. `feat: establish lantern typography` — fonts, colors, theme variables, and base styling.
4. `feat: add lantern header` — logo, navigation, and saved-poem counter.
5. `feat: add hero introduction` — landing headline, description, and scroll cue.
6. `feat: add poem catalog` — poem types, six poems, and mood definitions.
7. `feat: add mood selection` — feeling filter controls and active states.
8. `feat: add poem library cards` — responsive poem card grid and read/save actions.
9. `feat: add poem search` — search input and combined filtering behavior.
10. `feat: add empty library state` — no-results message and library composition.
11. `feat: add poem reader` — full-screen reading view, close control, and poem body.
12. `feat: add saved poem persistence` — localStorage-backed favorites and saved count.
13. `feat: add favorite feedback` — save/remove toast messages and timed dismissal.
14. `feat: add ambient lantern field` — canvas particles, responsive density, and reduced-motion support.
15. `feat: add ritual closing section` — editorial closing message and footer.
16. `feat: add navigation resilience` — anchor navigation, error boundary, and fallback handling.
17. `feat: deliver first poem lantern mvp` — final integration, accessibility polish, metadata, and project documentation.

Every commit must modify at least two files. Feature commits will add or update the relevant component, data, style, or entrypoint files so the history shows the site being built. The final commit will include at least two related integration files.

## Error Handling and Verification

The existing error boundary remains wired through `src/main.tsx`. The existing fallback page and reusable UI components remain available unless a source reference becomes unnecessary after the decomposition. No error handling will be removed as part of the refactor.

Verification gates are:

- TypeScript check using the project script.
- Production build using the project script.
- Full-tree scan for provider-specific strings and generated artifacts.
- Git inspection confirming the requested commit subjects, at least 16 commits in the sequence, no empty commits, and no one-file commit.
- Final diff inspection confirming the application code is decomposed and the preserved behavior invariants remain represented.
