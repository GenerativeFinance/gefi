import type { Express, Request, Response } from "express";

/**
 * Lightweight compatibility route:
 * Accepts POST /api/auth/complete-chatbot-signup and forwards the request
 * to the canonical /api/chatbot/signup/complete endpoint.
 *
 * This helps older clients that still post to /api/auth/complete-chatbot-signup
 * while the server expects /api/chatbot/signup/complete.
 */
export default function registerAuthCompat(app: Express) {
  app.post("/api/auth/complete-chatbot-signup", async (req: Request, res: Response) => {
    try {
      // Determine protocol and host to forward to same server
      const proto = (req as any).protocol || "http";
      const host = req.get("host") || "localhost:3000";
      const targetUrl = `${proto}://${host}/api/chatbot/signup/complete`;

      const forwardHeaders: Record<string, string> = {
        "Content-Type": req.get("content-type") || "application/json",
      };
      if (req.get("authorization")) {
        forwardHeaders["Authorization"] = req.get("authorization") as string;
      }

      const fetchResponse = await fetch(targetUrl, {
        method: "POST",
        headers: forwardHeaders,
        body: JSON.stringify(req.body),
      });

      const contentType = fetchResponse.headers.get("content-type") || "application/json";
      res.status(fetchResponse.status).set("Content-Type", contentType);
      const text = await fetchResponse.text();

      if (contentType.includes("application/json")) {
        try {
          return res.send(JSON.parse(text));
        } catch {
          return res.send(text);
        }
      }

      return res.send(text);
    } catch (err) {
      console.error("Error forwarding /api/auth/complete-chatbot-signup:", err);
      return res.status(500).json({ message: "Failed to forward signup request" });
    }
  });
}