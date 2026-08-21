import type { Express, Request, Response } from "express";

// Demo checkout: mirrors the pattern used elsewhere (Stripe fallback)
export default function registerContractWalletRoutes(app: Express) {
  app.post("/api/contract-wallet/subscribe", async (req: Request, res: Response) => {
    try {
      const userId = (req as any)?.user?.id || (req as any)?.user?.claims?.sub || "demo_user";
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      // If Stripe is configured, return a checkoutUrl to redirect to
      if (process.env.STRIPE_API_KEY) {
        const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost:3000";
        const protocol = req.headers["x-forwarded-proto"] || (req as any).secure ? "https" : "http";
        const success = `${protocol}://${host}/billing?feature=contract-wallet&status=success`;
        const cancel = `${protocol}://${host}/billing?feature=contract-wallet&status=cancel`;

        // Simulate stripe session here or integrate your payments util
        return res.json({
          checkoutUrl: `${protocol}://${host}/mock-checkout?feature=contract-wallet&success_url=${encodeURIComponent(success)}&cancel_url=${encodeURIComponent(cancel)}`
        });
      }

      // Demo success: immediately activate
      return res.json({ success: true, message: "Contract Wallet Pro activated (demo)" });
    } catch (err) {
      console.error("Contract wallet subscribe error:", err);
      return res.status(500).json({ message: "Failed to activate Contract Wallet Pro" });
    }
  });
}