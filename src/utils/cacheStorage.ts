/**
 * Lightweight localStorage cache with versioning and TTL.
 *
 * All entries are stored under keys prefixed with `rcv_cache_` so they are
 * easy to identify and purge without touching unrelated localStorage keys.
 *
 * Cache-version bumps (CACHE_VERSION) automatically invalidate every stored
 * entry, so stale serialised shapes never leak into a new app deploy.
 */

const CACHE_VERSION = '1';
const KEY_PREFIX = 'rcv_cache_';

interface CacheEntry<T> {
  v: string;        // cache version
  ts: number;       // unix-ms timestamp when the entry was written
  data: T;
}

/**
 * Read a value from the persistent cache.
 *
 * Returns `null` when the entry is absent, expired, or belongs to an older
 * cache version so the caller always falls back to a fresh network request.
 *
 * @param key    Logical cache key (without prefix).
 * @param ttlMs  Maximum age in milliseconds before the entry is considered
 *               stale.  Defaults to 24 hours.
 */
export function getCached<T>(key: string, ttlMs = 24 * 60 * 60 * 1000): T | null {
  try {
    const raw = localStorage.getItem(`${KEY_PREFIX}${key}`);
    if (!raw) return null;

    const entry: CacheEntry<T> = JSON.parse(raw);

    if (entry.v !== CACHE_VERSION) {
      localStorage.removeItem(`${KEY_PREFIX}${key}`);
      return null;
    }

    if (Date.now() - entry.ts > ttlMs) {
      localStorage.removeItem(`${KEY_PREFIX}${key}`);
      return null;
    }

    return entry.data;
  } catch {
    return null;
  }
}

/**
 * Write a value into the persistent cache.
 *
 * Failures (e.g. `localStorage` unavailable, storage quota exceeded) are
 * swallowed silently — the in-memory module-level cache still serves the
 * current session correctly.
 *
 * @param key  Logical cache key (without prefix).
 * @param data Value to persist.
 */
export function setCached<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = { v: CACHE_VERSION, ts: Date.now(), data };
    localStorage.setItem(`${KEY_PREFIX}${key}`, JSON.stringify(entry));
  } catch {
    // Ignore QuotaExceededError and similar storage failures.
  }
}

/**
 * Remove all RCV cache entries from localStorage.
 * Useful for debugging or forcing a full refresh.
 */
export function clearAllCaches(): void {
  try {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(KEY_PREFIX));
    keys.forEach(k => localStorage.removeItem(k));
  } catch {
    // Ignore.
  }
}
