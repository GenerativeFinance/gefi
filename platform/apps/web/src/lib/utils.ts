export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8787";
