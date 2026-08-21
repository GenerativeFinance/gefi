/**
 * Placeholder shared schema definitions.
 *
 * Phase 1+ will replace these with real Zod / TypeBox schemas covering
 * the playground's API surface (subscribe, model registry, run requests).
 */

export interface SubscribeRequest {
  email: string;
  source?: string;
}

export interface SubscribeResponse {
  ok: boolean;
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: unknown): email is string {
  return typeof email === "string" && EMAIL_RE.test(email) && email.length <= 254;
}
