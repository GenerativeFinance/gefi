/**
 * `@gefi/compliance-engine` — pure-TS compliance engine. Layered as:
 *
 *   - `evaluate()`        — event + rules → required actions
 *   - `merkle.ts`         — hash chain + Merkle inclusion proofs
 *   - `mailer.ts`         — outbound email (MailChannels + stub)
 *   - `anchor.ts`         — Polygon root anchoring (real + stub)
 *   - `docusign.ts`       — sign-off envelopes (real + stub)
 *   - `directory.ts`      — lawyer/auditor seed data
 *   - `routing.ts`        — orchestrates everything
 *
 * The Worker (`gefi-compliance`) is the deployment surface; this package
 * is the pure-logic core (no D1/R2/KV calls; Workers concerns kept out
 * deliberately for testability).
 */

export * from "./types.js";
export {
  buildMerkle,
  canonicalJson,
  computeEventHash,
  genesisHash,
  hashPair,
  inclusionProof,
  sha256Hex,
  verifyInclusion,
} from "./merkle.js";
export { evaluate } from "./evaluate.js";
export { resolveMailer, StubMailer, MailChannelsMailer } from "./mailer.js";
export type { Mailer, MailerInput, MailerSendResult } from "./mailer.js";
export { resolveAnchor, StubAnchor, PolygonAnchor } from "./anchor.js";
export type { Anchor, AnchorInput, AnchorResult } from "./anchor.js";
export { resolveDocuSign, StubDocuSign, RealDocuSign } from "./docusign.js";
export type { DocuSign, DocuSignEnvelopeInput, DocuSignEnvelopeResult } from "./docusign.js";
export { AUDITOR_SEED, LAWYER_SEED, pickDefaultAuditor, pickDefaultLawyer } from "./directory.js";
export type { AuditorSeed, LawyerSeed } from "./directory.js";
export { routeEvent } from "./routing.js";
export type { CaseInsert, CaseActionInsert, RoutingDb, RoutingInput, RoutingResult } from "./routing.js";
