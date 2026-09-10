import { serve } from "@hono/node-server";
import { createApp } from "./index.js";

const port = Number(process.env.PORT ?? 8787);
const app = createApp();
console.log(`gefi-api listening on http://localhost:${port}`);
serve({ fetch: app.fetch, port });
