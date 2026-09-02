# Poem Lantern

Poem Lantern is a small, quiet library for finding a poem by feeling. The first MVP includes six poems, mood filtering, search, a full-screen reader, saved poems, and an ambient lantern field.

## Local development

```bash
npm install
npm run dev
```

The app uses port `5173` by default. Set `PORT` to use another port, or set `BASE_PATH` when serving it beneath a path.

## Verification

```bash
npm test
npm run typecheck
npm run build
```

Favorites are stored in the browser under `poem-lantern-favorites`. The page respects reduced-motion preferences and keeps its anchor navigation available without a backend.
