/**
 * Daily cron handler (configured in wrangler.toml as `0 4 * * *`).
 *
 * Phase 1 only logs and writes an Analytics Engine data point. Real
 * housekeeping (compaction, expired-token sweeps, federated rounds)
 * comes later.
 */
import type { Env } from "./types.js";

export async function scheduled(
  event: ScheduledController,
  env: Env,
  _ctx: ExecutionContext,
): Promise<void> {
  const at = new Date(event.scheduledTime).toISOString();
  console.log("[scheduled] tick", { at, cron: event.cron, env: env.ENVIRONMENT });
  try {
    env.EVENTS.writeDataPoint({
      blobs: ["scheduled", event.cron],
      doubles: [event.scheduledTime],
      indexes: [env.ENVIRONMENT],
    });
  } catch (err) {
    console.error("[scheduled] analytics write failed", err);
  }
}
