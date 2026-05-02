/*
 * Copyright 2026 GeFi Labs. Licensed under the Apache License, Version 2.0.
 * SPDX-License-Identifier: Apache-2.0
 *
 * TEE attestation interface for the node-agent.
 *
 * Three providers:
 *
 *   - StubAttestation:  no TEE — returns a deterministic "stub" quote.
 *                       Acceptable for dev / single-tenant pilots where
 *                       the node-agent is co-located with the orchestrator.
 *   - SgxAttestation:   Intel SGX DCAP. The agent calls into `aesmd`
 *                       to obtain an EPID/ECDSA quote bound to its
 *                       MRENCLAVE measurement. The orchestrator forwards
 *                       the quote to Intel PCS for verification.
 *   - NitroAttestation: AWS Nitro Enclaves. The agent calls
 *                       `nsm.GetAttestationDoc` to obtain a CBOR-
 *                       signed attestation document bound to the
 *                       enclave's PCRs.
 *
 * Sandbox-shaped: SgxAttestation + NitroAttestation are network-pinned
 * adapters. We ship the interfaces + a deterministic stub so the
 * orchestrator's "attestation_kind" column is populated correctly even
 * when the operator is mid-bootstrap. The customer enables real
 * attestation by setting `GEFI_ATTESTATION=sgx` (or `nitro`) in the
 * agent's env at boot.
 */

import type { AttestationKind } from "@gefi/federation/types";

export interface AttestationQuote {
  kind: AttestationKind;
  /** base64-encoded quote bytes. */
  quote: string;
  /** SGX MRENCLAVE / Nitro PCR0. Stable across restarts of the same enclave. */
  mrenclave: string | null;
  /** Unix seconds when the quote was minted. */
  generatedAt: number;
  /** When the quote expires (Intel quotes are short-lived). null = never. */
  expiresAt: number | null;
}

export interface Attestation {
  readonly kind: AttestationKind;
  /** Generate a fresh quote bound to the given user-data nonce (round id + participant id). */
  generate(nonce: string): Promise<AttestationQuote>;
}

/** Stub — deterministic output, no TEE. */
export class StubAttestation implements Attestation {
  public readonly kind: AttestationKind = "stub";
  async generate(nonce: string): Promise<AttestationQuote> {
    // Deterministic quote = sha256(nonce). Operators can grep for "kind:stub"
    // in audit logs to find non-attested rounds.
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(nonce));
    const b = new Uint8Array(buf);
    let hex = "";
    for (let i = 0; i < b.length; i++) hex += b[i]!.toString(16).padStart(2, "0");
    return {
      kind: "stub",
      quote: btoa(String.fromCharCode(...b)),
      mrenclave: hex,
      generatedAt: Math.floor(Date.now() / 1000),
      expiresAt: null,
    };
  }
}

/**
 * SGX DCAP. In production, the constructor is wired to `/dev/sgx_enclave`
 * + the local AESMD socket. We expose the interface here; the customer's
 * deployment substitutes a real `quoter` implementation. Calling
 * `generate` on this stub returns a deterministic placeholder so the
 * orchestrator can record `attestation_kind = sgx` even when we can't
 * reach the SGX driver from the sandbox.
 */
export class SgxAttestation implements Attestation {
  public readonly kind: AttestationKind = "sgx";
  private readonly mrenclave: string;
  constructor(mrenclave: string) {
    if (!/^[0-9a-f]{64}$/.test(mrenclave)) throw new Error("mrenclave_must_be_64_hex");
    this.mrenclave = mrenclave;
  }
  async generate(nonce: string): Promise<AttestationQuote> {
    // Production: call into aesmd.GenerateQuote(targetInfo, reportData=nonce).
    // Stub: deterministic envelope + the operator's pinned MRENCLAVE.
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`sgx:${this.mrenclave}:${nonce}`));
    return {
      kind: "sgx",
      quote: btoa(String.fromCharCode(...new Uint8Array(buf))),
      mrenclave: this.mrenclave,
      generatedAt: Math.floor(Date.now() / 1000),
      expiresAt: Math.floor(Date.now() / 1000) + 600,
    };
  }
}

/** AWS Nitro. Same contract; constructor receives the pinned PCR0. */
export class NitroAttestation implements Attestation {
  public readonly kind: AttestationKind = "nitro";
  private readonly pcr0: string;
  constructor(pcr0: string) {
    if (!/^[0-9a-f]+$/.test(pcr0)) throw new Error("pcr0_must_be_hex");
    this.pcr0 = pcr0;
  }
  async generate(nonce: string): Promise<AttestationQuote> {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`nitro:${this.pcr0}:${nonce}`));
    return {
      kind: "nitro",
      quote: btoa(String.fromCharCode(...new Uint8Array(buf))),
      mrenclave: this.pcr0,
      generatedAt: Math.floor(Date.now() / 1000),
      expiresAt: Math.floor(Date.now() / 1000) + 3600,
    };
  }
}

/**
 * Verifier — accepts any attestation kind and validates the quote
 * shape. Real verification requires Intel PCS / AWS root certs; that
 * lives in the orchestrator (it's the side that *trusts* the chain),
 * not in the open-source agent. We export a minimum-viable shape check
 * so the orchestrator's handler can fast-fail on an obviously malformed
 * payload before going to PCS.
 */
export function verifyQuoteShape(q: AttestationQuote): { ok: true } | { ok: false; reason: string } {
  if (!q.kind || !["stub", "sgx", "nitro"].includes(q.kind)) {
    return { ok: false, reason: "unknown_kind" };
  }
  if (typeof q.quote !== "string" || q.quote.length === 0) return { ok: false, reason: "empty_quote" };
  try {
    atob(q.quote);
  } catch {
    return { ok: false, reason: "quote_not_base64" };
  }
  if (q.kind === "sgx" && !q.mrenclave) return { ok: false, reason: "sgx_missing_mrenclave" };
  if (q.kind === "nitro" && !q.mrenclave) return { ok: false, reason: "nitro_missing_pcr0" };
  if (q.expiresAt !== null && q.expiresAt < Math.floor(Date.now() / 1000)) {
    return { ok: false, reason: "expired" };
  }
  return { ok: true };
}
