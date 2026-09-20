# Song player and lyrics design

## Context

The protected song detail page currently renders a browser-native audio element, while the song data has an empty `body` field. The local ignored `public/songs.md` contains the authored lyrics. The first song should display those lyrics alongside a deliberately designed player without exposing the Markdown source file in version control.

## Visual direction

Use an Industrial listening-console direction for the player itself. The player uses warm black `#0B0C0A`, amber `#FFB800` as its only signal color, DM Mono for all player text, flat 1px borders, tabular numerals, and no rounded corners or decorative shadows. This creates a clear, unexpected console-like object inside the softer lantern-room reading experience.

The differentiator is an amber playhead rail: the transport progress control and the lyric column share a visible amber alignment, making the player feel like one instrument rather than a separate audio widget followed by unrelated text.

## Data and rendering

- Copy the first song's authored lyrics from `public/songs.md` into the existing `body` field in `src/data/songs.ts`.
- Preserve lyric section labels and line breaks that help the reader follow the song; omit chord annotations and production notes from the reader-facing lyric body.
- Do not add the second song until a matching audio asset and song entry exist.
- Keep `public/songs.md` ignored and unchanged.
- Replace the direct native-controls presentation in `SongPage` with a focused `SongPlayer` component that receives the existing `Song` object.

## Player behavior

The component owns the audio element reference and playback state. It provides:

- Play/pause control with an accessible label and pressed state.
- A keyboard-operable seek range with current time and duration.
- Metadata for the current song and author.
- A responsive lyric section rendered with preserved whitespace.
- A graceful duration/loading state when metadata has not loaded.
- Reduced-motion-safe transitions and focus-visible states.

The audio element remains in the DOM for native media semantics, but the visible transport is controlled by the component so the player can follow the approved visual system consistently.

## Error handling

If the audio source cannot load, retain the song title and lyrics and show a concise playback-unavailable message rather than hiding the reading experience. If the lyric body is empty, omit the lyric panel without inventing copy.

## Verification

- Add component tests for lyric rendering, play/pause state, seek updates, and accessible control labels.
- Update song-page tests to assert the lyrics are visible after access is granted.
- Run the full Vitest suite, TypeScript typecheck, production build, and `git diff --check`.
