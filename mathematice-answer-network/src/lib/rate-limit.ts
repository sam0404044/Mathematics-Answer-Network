import type { NextRequest } from "next/server";

type Entry = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Entry>();

export function isRateLimited(
  request: Request | NextRequest,
  scope: string,
  limit: number,
  windowMs: number,
): boolean {
  const forwarded = request.headers.get("x-forwarded-for");
  const address =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const key = `${scope}:${address}`;
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  current.count += 1;
  if (buckets.size > 10_000) {
    for (const [bucketKey, entry] of buckets) {
      if (entry.resetAt <= now) buckets.delete(bucketKey);
    }
  }

  return current.count > limit;
}
