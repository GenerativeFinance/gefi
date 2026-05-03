/**
 * Bearer-token API key support for `/v1/models/:slug/predict`.
 *
 * Storage model:
 *   - The plaintext key is shown once at issue time as `gefi_<22-char-base64>`
 *     and never persisted.
 *   - The DB stores the SHA-256 of the plaintext (`key_hash`) plus an 8-char
 *     `prefix` for dashboard display.
 *
 * Resolution path:
 *   1. Read the `Authorization: Bearer …` header.
 *   2. SHA-256 the token.
 *   3. SELECT user_id FROM api_keys WHERE key_hash = ? AND revoked_at IS NULL.
 *   4. Return user_id (or null if not found / revoked).
 *
 * Cookie-based session auth is checked separately in `playground.ts` and
 * stays intact for browser callers from the playground UI.
 */
import { sha256Hex } from "../models/_shared.js";

export async function resolveBearerUserId(
  db: D1Database,
  authHeader: string | undefined,
  now: number,
): Promise<string | null> {
  if (!authHeader) return null;
  const match = /^Bearer\s+(.+)$/i.exec(authHeader.trim());
  if (!match) return null;
  const token = match[1]!.trim();
  if (!token) return null;

  const hash = await sha256Hex(token);
  const row = await db
    .prepare("SELECT user_id FROM api_keys WHERE key_hash = ? AND revoked_at IS NULL LIMIT 1")
    .bind(hash)
    .first<{ user_id: string }>();
  if (!row) return null;

  // Touch last_used_at — fire-and-forget; failure shouldn't block the request.
  await db
    .prepare("UPDATE api_keys SET last_used_at = ? WHERE key_hash = ?")
    .bind(now, hash)
    .run()
    .catch(() => {});

  return row.user_id;
}
