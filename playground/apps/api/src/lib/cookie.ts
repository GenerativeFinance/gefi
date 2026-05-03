export const SESSION_COOKIE = "gefi_session";

export interface CookieOptions {
  maxAgeSeconds: number;
  secure: boolean;
}

export function buildSessionCookie(value: string, opts: CookieOptions): string {
  const parts = [
    `${SESSION_COOKIE}=${value}`,
    `Max-Age=${opts.maxAgeSeconds}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (opts.secure) parts.push("Secure");
  return parts.join("; ");
}

export function clearSessionCookie(secure: boolean): string {
  return buildSessionCookie("", { maxAgeSeconds: 0, secure });
}

export function readCookie(header: string | null | undefined, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(/;\s*/)) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq) === name) return part.slice(eq + 1);
  }
  return null;
}
