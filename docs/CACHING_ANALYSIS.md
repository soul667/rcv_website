# Caching Analysis: RCV Website vs. Codex API Expectations

> **Scope:** Compares the data-fetching and caching strategies in this repository against the caching semantics expected by the OpenAI Codex API. Exact files and functions referenced throughout.

---

## 1. What This Repo Actually Does (no Codex integration)

`soul667/rcv_website` is a **100% static React + Vite SPA**. It has no server, no LLM calls, and no OpenAI/Codex API integration. All "API calls" are browser `fetch()` requests to static files hosted on GitHub Pages.

Three loader utilities handle all data loading:

| Loader | File | Fetches |
|--------|------|---------|
| `getAuthorDirectories` / `loadAuthorData` / `loadAllAuthors` | `src/utils/authorLoader.ts:46-414` | `data/authors.json` + each `content/authors/<id>/_index.md` |
| `getPublicationFolders` / `loadAllYamlPublications` | `src/utils/publicationLoader.ts:39-125` | `data/publications.json` + each `content/publication/<slug>/index.yaml` |
| `loadResearchAreas` | `src/utils/researchLoader.ts:33-104` | four hard-coded `content/research/<folder>/index.toml` files |

All three loaders share the same two-level caching pattern (see §2 below).

---

## 2. Current Caching Architecture

### 2a. In-memory (SPA lifetime) cache

Each loader uses a module-level singleton pattern:

```ts
// authorLoader.ts:385-414
let authorsCache: AuthorData[] | null = null;
let loadAuthorsPromise: Promise<AuthorData[]> | null = null;

export async function loadAllAuthors(): Promise<AuthorData[]> {
  if (authorsCache) return authorsCache;       // ① serve from in-memory cache
  if (loadAuthorsPromise) return loadAuthorsPromise; // ② deduplicate in-flight requests
  loadAuthorsPromise = (async () => { … })();
  return loadAuthorsPromise;
}
```

The same pattern is repeated in `publicationLoader.ts:56-125` and `researchLoader.ts:29-103`.

**Effect:** Within a single page session, data is fetched exactly once regardless of how many components request it. Cache is lost on hard-reload or navigation away from the SPA.

### 2b. Browser HTTP cache (implicit)

All `fetch()` calls are issued **without** an explicit `cache` option:

```ts
// authorLoader.ts:48  — no cache option
const response = await fetch(getAssetUrl('data/authors.json'));

// publicationLoader.ts:41
const res = await fetch(getAssetUrl('data/publications.json'));

// researchLoader.ts:50
const response = await fetch(getContentUrl(`research/${encodeURIComponent(folder)}/index.toml`));
```

When no `cache` option is given, browsers use the `"default"` mode: the browser validates with the server (using `ETag` / `Last-Modified`) on each new page load. GitHub Pages serves correct cache-control and ETag headers for static files, so browser caching is effectively working — but **only if the user visits the page more than once and has not cleared the browser cache**.

### 2c. No cache invalidation

Because the content is static and deployed as a build artifact, there is no TTL, no versioned URL, and no service worker. If content is updated and re-deployed, only users who hard-reload (or whose HTTP cache entries have expired) will see fresh data.

---

## 3. Checklist Comparison: This Repo vs. Codex API Expectations

| # | Codex API caching concern | Relevant in this repo? | Current status | Risk |
|---|--------------------------|----------------------|----------------|------|
| 1 | **Request fingerprint stability** — identical `messages`, `model`, `temperature`, etc. produce cache hits | ❌ No API calls | N/A | None |
| 2 | **Prompt/message ordering** — reordering messages breaks the prefix cache | ❌ No prompts | N/A | None |
| 3 | **Parameter mutation** — changing `temperature`, `max_tokens`, `tools`, etc. invalidates cache | ❌ No API parameters | N/A | None |
| 4 | **System-prompt stability** — a stable, long system prompt enables prefix reuse | ❌ No system prompt | N/A | None |
| 5 | **HTTP `cache` option on fetch** | ✅ Applicable (static files) | Not set → browser default | **Low** — browser default works, but can be improved |
| 6 | **In-memory deduplication** — concurrent callers wait for one in-flight request | ✅ Applicable | ✅ Implemented correctly in all three loaders | None |
| 7 | **Cache lifetime** — Codex prefix cache TTL is ~5-10 min; browser HTTP cache depends on headers | ✅ Applicable | Implicit via GitHub Pages cache-control headers | Low |
| 8 | **Cache invalidation on content change** | ✅ Applicable | ❌ No cache-busting for `public/assets/data/*.json` | **Medium** — stale data risk after re-deploy |
| 9 | **Service worker / offline cache** | ✅ Applicable | ❌ Not implemented | Low-Medium |
| 10 | **Request normalisation** — removing spurious fields that would vary the cache key | ❌ Not applicable | N/A | None |

**Overall assessment:** Because this repo makes zero Codex API calls, there is no Codex-level cache hit/miss impact. The static-file fetching caches function correctly for normal use. The two concrete gaps are items 5 and 8.

---

## 4. Concrete Optimization Suggestions

### OPT-1 · Explicit browser-cache directive for stable static files (low effort, immediate gain)

Individual content files (`_index.md`, `index.yaml`, `index.toml`) are versioned by deployment; they do not change while the site is live. Adding `{ cache: 'force-cache' }` tells the browser to use any cached copy it already has, eliminating conditional HTTP round-trips entirely:

```ts
// authorLoader.ts — loadAuthorData()
const response = await fetch(getContentUrl(`authors/${authorId}/_index.md`),
  { cache: 'force-cache' });           // serve from browser cache if available

// publicationLoader.ts — loadAllYamlPublications()
const res = await fetch(getContentUrl(`publication/${folder}/index.yaml`),
  { cache: 'force-cache' });

// researchLoader.ts — loadResearchAreas()
const response = await fetch(getContentUrl(`research/${encodeURIComponent(folder)}/index.toml`),
  { cache: 'force-cache' });
```

The index files (`authors.json`, `publications.json`) should use `{ cache: 'no-cache' }` instead — they are the discovery files and should always be fresh so the SPA knows if new content was deployed:

```ts
// authorLoader.ts — getAuthorDirectories()
const response = await fetch(getAssetUrl('data/authors.json'),
  { cache: 'no-cache' });

// publicationLoader.ts — getPublicationFolders()
const res = await fetch(getAssetUrl('data/publications.json'),
  { cache: 'no-cache' });
```

> **Files to edit:** `src/utils/authorLoader.ts`, `src/utils/publicationLoader.ts`, `src/utils/researchLoader.ts`

### OPT-2 · Cache-busting for index files (medium effort)

`sync_authors_index.js` and `sync_publications_index.js` already write a `generatedAt` timestamp into the JSON files. Append it as a URL query parameter to force-invalidate after a re-deploy:

```ts
// authorLoader.ts — loadAllAuthors(), after getting authorsJson
const bustedUrl = `${getAssetUrl('data/authors.json')}?v=${payload.generatedAt ?? ''}`;
```

This gives exact semantics: content files are `force-cache`d during a session, but the next deployment's new `generatedAt` timestamp busts the index cache and triggers a fresh load.

> **Files to edit:** `src/utils/authorLoader.ts`, `src/utils/publicationLoader.ts`

### OPT-3 · Add a Vite PWA / service worker (larger effort, biggest long-term gain)

A service worker using a "cache-first" strategy for static content would give near-instant page loads after the first visit, survive offline, and increase the effective cache hit rate across page reloads — which is exactly what Codex prefix caching achieves on the server side (serving responses without re-computing them).

Recommended library: [`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/). Configuration would live in `vite.config.ts`.

> **Files to edit:** `vite.config.ts`, `package.json`

### OPT-4 · If Codex API is ever integrated: preserve prefix-cache friendliness

Should the site later call OpenAI/Codex (e.g., for a research assistant chat), follow these rules to maximise cache hit rates:

- Place the **system prompt first and keep it stable** across all calls. Varying the system prompt at runtime (e.g., injecting a user's name) breaks prefix cache for every new user.
- Append new user turns at the **end** of `messages[]`; never reorder earlier entries.
- Fix `temperature`, `top_p`, `max_tokens`, and `tools` to constant values in a shared config object — any parameter mutation creates a new cache key.
- Use the OpenAI `seed` parameter to further stabilise responses.

---

## 5. Cache Hit Rate Assessment

| Scenario | Likely outcome | Rationale |
|----------|---------------|-----------|
| Current site, no changes | ✅ Good within a session | In-memory singleton prevents redundant fetches; browser HTTP cache handles cross-session reuse. |
| After applying OPT-1 | ✅ Better across reloads | `force-cache` on content files eliminates conditional round-trips for unchanged content. |
| After applying OPT-1 + OPT-2 | ✅ Best static-site result | Index files always fresh; content files always served from browser cache until a re-deploy. |
| After applying OPT-3 | ✅✅ Near-optimal | Service worker caches everything at install time; subsequent loads are fully offline-capable. |
| If Codex API added **without** following OPT-4 | ⚠️ Cache hit rate would drop | Dynamic system prompts, varying parameters, or reordered messages each create unique cache keys — wasting Codex prefix-cache capacity. |

---

## 6. Files Examined

- `src/utils/authorLoader.ts` — lines 46–414 (caching pattern, `fetch` calls)
- `src/utils/publicationLoader.ts` — lines 39–125 (caching pattern, `fetch` calls)
- `src/utils/researchLoader.ts` — lines 33–104 (caching pattern, `fetch` calls)
- `src/utils/paths.ts` — URL helpers (`getAssetUrl`, `getContentUrl`, `getPublicUrl`)
- `scripts/sync_authors_index.js` — generates `generatedAt` timestamp in `authors.json`
- `scripts/sync_publications_index.js` — generates `generatedAt` timestamp in `publications.json`
- `vite.config.ts` — build configuration (no service worker currently)
- `package.json` — dependencies and scripts
