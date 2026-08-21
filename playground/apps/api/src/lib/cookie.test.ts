import { describe, expect, it } from "vitest";
import { buildSessionCookie, clearSessionCookie, readCookie, SESSION_COOKIE } from "./cookie.js";

describe("cookie helpers", () => {
  it("buildSessionCookie sets HttpOnly + SameSite=Lax + Secure conditionally", () => {
    const c1 = buildSessionCookie("xyz", { maxAgeSeconds: 100, secure: true });
    expect(c1).toContain(`${SESSION_COOKIE}=xyz`);
    expect(c1).toContain("Max-Age=100");
    expect(c1).toContain("HttpOnly");
    expect(c1).toContain("SameSite=Lax");
    expect(c1).toContain("Secure");
    const c2 = buildSessionCookie("xyz", { maxAgeSeconds: 100, secure: false });
    expect(c2).not.toContain("Secure");
  });

  it("clearSessionCookie zeroes Max-Age", () => {
    expect(clearSessionCookie(true)).toContain("Max-Age=0");
  });

  it("readCookie picks the right name out of a header", () => {
    expect(readCookie("a=1; gefi_session=abc; b=2", SESSION_COOKIE)).toBe("abc");
    expect(readCookie("a=1; b=2", SESSION_COOKIE)).toBeNull();
    expect(readCookie(null, SESSION_COOKIE)).toBeNull();
    expect(readCookie(undefined, SESSION_COOKIE)).toBeNull();
  });
});
