# Songs Detail Pages Design

**Date:** 2026-09-20
**Status:** Approved direction, awaiting written-spec review

## Context

The songs are currently rendered as one library section at `/songs/`, with each card embedding its audio player. The poems already establish a stronger reading flow: a library card leads to a dedicated, shareable detail route. Songs should use the same pattern while remaining hidden behind the existing seven-tap lantern unlock and monthsary password.

## Visual direction

Use the existing Organic reading-room language already established by the poem pages: warm earth-toned scene treatment, humanist serif titles, mono metadata, restrained borders, grain, and gentle motion. The detail page should feel like turning to a single page in the same private collection, not like opening a separate media dashboard.

The memorable interaction is a quiet “turn the page” transition expressed through the song card link and the detail page’s back-to-songs control. The route change remains a normal URL navigation so each song is shareable and reloadable.

## User experience

### Song library

- `/songs/` remains the song shelf shown after both access checks pass.
- Each song card shows the song type, duration/availability label, title, excerpt, and author.
- The embedded audio player is removed from the library card.
- Each card links to its song detail route using the configured Vite base path.
- The empty state remains honest when the song list is empty.

### Song detail

- Each song is available at `/songs/:songId`.
- The page mirrors the poem detail layout: a back link, a small page marker, a large title, excerpt, author/length metadata, and a reading/media column.
- The native audio player lives on the detail page and keeps its accessible `aria-label`.
- The song body is rendered only when real body content exists; no placeholder lyrics or fabricated copy are added.
- Unknown song IDs use the existing not-found page after the access boundary has been satisfied.

## Routing and access boundary

- Add `getSongPath(songId, basePath)` and `getSongId(pathname, basePath)` route helpers.
- Expand song-path recognition to cover `/songs/` and `/songs/:songId`, including the configured non-root base path.
- Route the collection path to `SongsPage` and a valid detail path to `SongPage`.
- Every songs descendant is protected by the existing `readSongUnlockFlag()` check. An unarmed visitor is redirected to the home route before song content is rendered.
- After the seven-tap unlock, the existing monthsary password check remains required. Access is persisted using the current song-access storage flag.
- A detail page with an armed but password-unverified visitor shows the same password gate used by the collection page.
- The guard must run before resolving/rendering song content, so direct navigation cannot bypass the seven-tap requirement.

## Component boundaries

- `SongLibrary` owns the collection presentation and links.
- `SongPage` owns one song’s detail presentation.
- A small shared access boundary or shared status logic may be extracted if it avoids duplicating the unlock/password behavior between `SongsPage` and `SongPage`.
- `PageRouter` owns path classification and selecting the collection, detail, poem, or not-found page.
- `songs.ts` remains the source of truth for song metadata and audio assets.

## Testing contract

Add tests before implementation and keep the existing suite intact:

- Route helpers recognize collection and detail paths and preserve non-root base paths.
- `SongLibrary` renders detail links and does not embed native audio controls.
- `SongPage` renders title, metadata, audio controls, and body content for an authorized song.
- `SongPage` redirects an unarmed visitor and does not expose song content.
- `SongPage` shows the password gate when the lantern is unlocked but the password has not been accepted.
- The router selects a song detail page for a valid ID and not-found for an unknown ID.
- Existing seven-tap and password-gate tests continue to pass.

## Non-goals

- No new authentication backend or server-side session is introduced.
- No new song content is invented for an empty `body` field.
- No redesign of the poem library or poem detail routes is included.
- No change to the seven-tap count or existing storage contract is included.
