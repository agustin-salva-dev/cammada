/**
 * In-memory rate limiter.
 *
 * Sufficient for a single Node.js process (VPS/Docker) or Vercel warm instances.
 * For multi-instance/serverless cold-start scenarios, replace the `store` Map
 * with a persistent store like Vercel KV or Upstash Redis.
 *
 * Default: 10 attempts per 15-minute window.
 */

const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

export interface RateLimitResult {
  allowed: boolean;
  /** Remaining ms until the window resets. Only present when `allowed` is false. */
  remainingMs?: number;
}

/**
 * Checks whether the given key has exceeded the rate limit.
 * Increments the attempt counter on each call.
 *
 * @param key - A unique identifier for the rate-limited resource (e.g. `"login:127.0.0.1"`)
 */
export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now >= entry.resetAt) {
    // First attempt or window expired — start fresh
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, remainingMs: entry.resetAt - now };
  }

  entry.count += 1;
  return { allowed: true };
}
