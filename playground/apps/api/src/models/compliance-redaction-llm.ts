/**
 * Compliance-redaction-llm — also serves the Phase 6 spec entry for the
 * zero-knowledge-compliance-auditor (controls + proof hash + qr_url).
 *
 * Runtime: `synthetic`. Pattern-based PII / counterparty redaction over
 * the input transcript, plus a synthetic compliance-control checklist with
 * per-control evidence excerpts and a Merkle-style proof hash.
 *
 * Backwards-compatible Phase 5 keys (`redacted_text`, `spans_redacted`)
 * preserved; spec extension keys (`controls`, `proof_hash`, `qr_url`,
 * `on_chain_tx`) added alongside.
 */
import { type ModelHandler, sha256Hex } from "./_shared.js";
import { PLAYGROUND_MOCKS_BY_SLUG } from "../data/playground-mocks.js";

const SLUG = "compliance-redaction-llm";
const mock = PLAYGROUND_MOCKS_BY_SLUG.get(SLUG)!;

const CONTROLS = [
  { id: "CC6.1", description: "Logical access controls in place" },
  { id: "CC7.2", description: "Continuous monitoring of system anomalies" },
  { id: "CC8.1", description: "Change management process documented" },
  { id: "CC9.2", description: "Vendor risk assessments current" },
  { id: "CC10.1", description: "Privacy notice published" },
];

const REDACTORS: Array<{ pattern: RegExp; tag: string }> = [
  { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, tag: "[REDACTED:SSN]" },
  { pattern: /\b\d{16}\b/g, tag: "[REDACTED:CARD]" },
  { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, tag: "[REDACTED:EMAIL]" },
  { pattern: /\b\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, tag: "[REDACTED:PHONE]" },
];

const NAME_PATTERN = /\b([A-Z][a-z]+\s[A-Z][a-z]+)\b/g;

export const handler: ModelHandler = {
  slug: SLUG,
  runtime: "synthetic",
  inputSchema: mock.inputSchema,
  outputSchema: mock.outputSchema,
  defaultInput: mock.defaultInput,
  async predict(input, ctx) {
    let text = String(input.text ?? "");
    let spans = 0;

    for (const r of REDACTORS) {
      text = text.replace(r.pattern, () => { spans++; return r.tag; });
    }
    if (input.redact_counterparties) {
      text = text.replace(NAME_PATTERN, () => { spans++; return "[REDACTED:NAME]"; });
    }

    // Synthesise a compliance checklist; each control's status is a stable
    // function of (slug, control id, input length) so the same evidence
    // produces the same hash on every call.
    const controlsOut = await Promise.all(
      CONTROLS.map(async (c) => {
        const seed = `${SLUG}|${c.id}|${text.length}`;
        const hash = await sha256Hex(seed);
        const status = Number.parseInt(hash.slice(0, 2), 16) > 0x18 ? "pass" : "review";
        const excerpt = text.slice(0, 120) || "(no evidence supplied)";
        return { id: c.id, status, evidence_excerpt: excerpt, hash };
      }),
    );

    // Merkle-style root over the per-control hashes.
    const root = await sha256Hex(controlsOut.map((c) => c.hash).join("|"));
    const proof_hash = await sha256Hex(`${SLUG}|v1|${ctx.seed}|${root}`);

    return {
      // Phase 5 backwards-compat keys.
      redacted_text: text,
      spans_redacted: spans,
      // Phase 6 extensions — zero-knowledge compliance auditor surface.
      controls: controlsOut,
      proof_hash,
      qr_url: `https://verify.gefi.io/proof/${proof_hash.slice(0, 16)}`,
      on_chain_tx: null,
    };
  },
};
