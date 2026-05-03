/**
 * Print a fresh Ed25519 JWK keypair to stdout.
 *
 *   pnpm --filter @gefi-playground/api run keygen
 *
 * Then pipe each JSON string into `wrangler secret put`:
 *   wrangler secret put JWT_SK --env staging   (paste private)
 *   wrangler secret put JWT_PK --env staging   (paste public)
 */
import { generateKeypair } from "../src/lib/jwt.js";

const { privateJwk, publicJwk } = await generateKeypair();
console.log("# JWT_SK (private — keep secret, set via `wrangler secret put`)");
console.log(privateJwk);
console.log();
console.log("# JWT_PK (public — also set via `wrangler secret put`)");
console.log(publicJwk);
