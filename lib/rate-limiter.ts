import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const MAX_ATTEMPTS = 10;
const WINDOW_SECONDS = 15 * 60;

export interface RateLimitResult {
  allowed: boolean;
  remainingMs?: number;
}

let ratelimit: Ratelimit | null = null;

function getRatelimiter(): Ratelimit | null {
  if (ratelimit) return ratelimit;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn(
      "[rate-limiter] UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not set. " +
        "Rate limiting is DISABLED. Set these env vars in production.",
    );
    return null;
  }

  ratelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(MAX_ATTEMPTS, `${WINDOW_SECONDS} s`),
    prefix: "cammada:rl",
  });

  return ratelimit;
}

export async function checkRateLimit(key: string): Promise<RateLimitResult> {
  if (process.env.NODE_ENV === "test") {
    return { allowed: true };
  }

  const limiter = getRatelimiter();

  if (!limiter) {
    return { allowed: true };
  }

  const { success, reset } = await limiter.limit(key);

  if (!success) {
    return { allowed: false, remainingMs: reset - Date.now() };
  }

  return { allowed: true };
}
