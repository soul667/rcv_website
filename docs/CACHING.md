# Caching Analysis: rcv_website vs Codex

## 1. Implemented Caching Mechanisms

### 1a. In-memory module-level cache (pre-existing)

All three data loaders use a module-level variable as a **session cache** that
deduplicates concurrent calls and avoids repeat network requests *within the
same browser tab session*:

| Loader | Variable | Key derivation |
|--------|----------|----------------|
| `src/utils/authorLoader.ts` | `authorsCache` | N/A — single bucket for all authors |
| `src/utils/publicationLoader.ts` | `publicationsCache` | N/A — single bucket for all publications |
| `src/utils/researchLoader.ts` | `researchCache` | N/A — single bucket for all research areas |

A companion `Promise` variable (`loadAuthorsPromise`, etc.) prevents redundant
parallel fetches when multiple React components mount at the same time and call
the loader simultaneously.

**TTL / invalidation:** none — the cache lives only for the duration of the
JavaScript module in the current browser tab.  Every hard reload, new tab, or
navigation away discards all cached data and triggers fresh network requests.

### 1b. Persistent localStorage cache (added in this PR)

A new shared utility `src/utils/cacheStorage.ts` provides:

* **Key derivation:** fixed logical keys (`authors`, `publications`, `research`)
  prefixed with `rcv_cache_` to avoid collisions with unrelated site state.
* **Versioning:** a `CACHE_VERSION` constant (`"1"`) is embedded in every
  entry.  Incrementing this constant instantly invalidates all stored entries
  across every user's browser — serving as a manual cache-bust on deploy.
* **TTL:** entries expire after **24 hours** by default (configurable per-call).
  Static content on this site (lab members, publications, research areas) is
  updated infrequently, so a 24-hour window is conservative and correct.
* **Failure isolation:** `localStorage` writes are wrapped in `try/catch` so
  quota-exceeded errors or private-browsing restrictions are silently ignored;
  the in-memory cache still serves the current session normally.

---

## 2. Does Proxy / Request Transformation Reduce Upstream Cacheability?

This repository is a **static client-side React site** (Vite/GitHub Pages).
It does **not** act as a proxy, and it does not forward requests to an
upstream LLM API (Codex or otherwise).  All `fetch()` calls target static
files hosted under `/public/assets/` and `/public/content/`, so:

* There is no request body mutation, parameter injection, or header
  rewriting that could alter the upstream HTTP cache key.
* There is no streaming API layer, tool schema ordering, timestamp injection,
  or random-seed insertion — none of the Codex-specific cacheability risks
  apply here.
* URL construction is fully deterministic: `getAssetUrl` / `getContentUrl` in
  `src/utils/paths.ts` build fixed relative paths from a compile-time `BASE_URL`.

**Conclusion:** request transformation is not a risk factor for this
repository.

---

## 3. Directional Impact on Cache Hit Rate

### Before this PR

| Scenario | Hit rate |
|----------|----------|
| Same tab, same session | ~100 % (in-memory) |
| New tab or hard reload | 0 % (all loaders re-fetch) |
| Return visit hours later | 0 % |

The browser's own HTTP cache *may* serve some requests from disk, but this is
unreliable: GitHub Pages does not set long `Cache-Control` max-age headers for
content under `/public/content/` (individual YAML/markdown/TOML files), and
content-addressed hashing only applies to Vite-built JS/CSS bundles — not to
the raw data files fetched at runtime.

### After this PR

| Scenario | Hit rate |
|----------|----------|
| Same tab, same session | ~100 % (in-memory, unchanged) |
| New tab within 24 h | ~100 % (localStorage) |
| Hard reload within 24 h | ~100 % (localStorage) |
| Return visit > 24 h | 0 % — forces fresh fetch, then re-warms cache |

**Directional impact: significant increase.**  The most common real-world
pattern for a lab website is a user who opens the page, browses, closes it,
and returns later the same day or next day.  With the persistent cache all
three data-loading waterfalls (dozens of individual `fetch()` calls for author
markdown files, publication YAML files, and research TOML files) collapse to
zero network requests.

---

## 4. Concrete Recommendations (implemented and pending)

### Implemented in this PR

1. **`src/utils/cacheStorage.ts`** — shared localStorage cache with versioning
   and TTL, used by all three loaders.
2. **`authorLoader.ts`, `publicationLoader.ts`, `researchLoader.ts`** — each
   checks the persistent cache on startup and writes to it after a successful
   full load.

### Additional recommendations (not yet implemented)

3. **Bump `CACHE_VERSION` on content-breaking deploys.**  When the shape of
   `AuthorData`, `YamlPublication`, or `ResearchArea` changes, increment the
   constant in `src/utils/cacheStorage.ts` to prevent old serialised shapes
   from being deserialised by new code.

4. **Add `Cache-Control: max-age=3600` or fingerprinted URLs for data files.**
   The YAML, TOML, and JSON index files under `public/assets/data/` and
   `public/content/` are served without content hashes.  Serving them with a
   long-lived `Cache-Control` (or renaming with a hash on each deploy) would
   let the browser HTTP cache act as a complementary, lower-latency layer.

5. **Expose a `clearAllCaches()` call in a developer/debug mode.**  The
   function is already exported from `cacheStorage.ts`; wiring it to a
   keyboard shortcut or a URL query parameter (`?cache=clear`) makes it easy
   to force a refresh during content updates without clearing all browser
   storage manually.

6. **Consider a service worker for offline support.**  Because all data files
   are static and hosted on the same origin, a Workbox-based service worker
   could cache them using a stale-while-revalidate strategy, enabling fully
   offline browsing and near-instant second-visit load times even beyond 24 h.

---

## 5. Relevant Files and Functions

| File | Symbol | Role |
|------|--------|------|
| `src/utils/cacheStorage.ts` | `getCached`, `setCached`, `clearAllCaches` | Persistent localStorage cache utility |
| `src/utils/authorLoader.ts` | `loadAllAuthors` | Authors data loader — now checks/writes persistent cache |
| `src/utils/publicationLoader.ts` | `loadAllYamlPublications` | Publications data loader — now checks/writes persistent cache |
| `src/utils/researchLoader.ts` | `loadResearchAreas` | Research-areas data loader — now checks/writes persistent cache |
| `src/utils/paths.ts` | `getAssetUrl`, `getContentUrl` | Deterministic URL construction (no mutation risk) |
| `public/assets/data/authors.json` | — | Index file listing author directory IDs |
| `public/assets/data/publications.json` | — | Index file listing publication folder IDs |
