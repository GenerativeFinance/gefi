/**
 * Round — placeholder Durable Object for the federated training rounds that
 * will land in Phase 7. Phase 1 only needs the class to exist and be wired
 * into wrangler.toml's `[[migrations]] new_classes` so deploys succeed.
 */
import type { Env } from "../types.js";

export class Round {
  constructor(
    private readonly state: DurableObjectState,
    private readonly env: Env,
  ) {}

  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    if (req.method === "GET" && url.pathname === "/status") {
      return Response.json({
        ok: true,
        id: this.state.id.toString(),
        environment: this.env.ENVIRONMENT,
      });
    }
    return new Response("Not implemented", { status: 501 });
  }
}
