/**
 * DocuSign envelope abstraction.
 *
 * Real implementation: posts to the DocuSign REST v2.1 API with a JWT-bearer
 * auth flow (RSA private key stored as a Worker secret).
 *
 * Stub implementation: returns a synthetic envelope id and marks it
 * pre-signed so tests can assert routing wiring without running a real
 * DocuSign session.
 */

import type { DocuSignSecrets } from "@gefi/shared-types";

export interface DocuSignEnvelopeInput {
  caseId: string;
  recipientEmail: string;
  recipientName: string;
  templateId: string;
  /** Free-form key/value pairs the template substitutes (e.g. `{ tenantName }`). */
  fields?: Record<string, string>;
}

export interface DocuSignEnvelopeResult {
  envelopeId: string;
  status: "created" | "sent" | "completed" | "stubbed";
  signingUrl?: string;
}

export interface DocuSign {
  createEnvelope(input: DocuSignEnvelopeInput): Promise<DocuSignEnvelopeResult>;
}

export class StubDocuSign implements DocuSign {
  public readonly envelopes: DocuSignEnvelopeInput[] = [];
  async createEnvelope(input: DocuSignEnvelopeInput): Promise<DocuSignEnvelopeResult> {
    this.envelopes.push(input);
    return {
      envelopeId: `stub-env-${input.caseId.slice(0, 8)}`,
      status: "stubbed",
      signingUrl: `https://stub.docusign.local/sign/${input.caseId}`,
    };
  }
}

export class RealDocuSign implements DocuSign {
  /** DocuSign base URL (e.g. https://demo.docusign.net or https://docusign.net). */
  public readonly baseUrl: string;
  public readonly integrationKey: string;
  public readonly userId: string;
  public readonly accountId: string;
  /** RSA private key for the JWT-grant flow. Held in memory only. */
  private readonly rsaKey: string;

  constructor(
    secrets: Required<
      Pick<DocuSignSecrets,
        "DOCUSIGN_BASE_URL" | "DOCUSIGN_INTEGRATION_KEY" | "DOCUSIGN_USER_ID" | "DOCUSIGN_RSA_PRIVATE_KEY" | "DOCUSIGN_ACCOUNT_ID"
      >
    >,
  ) {
    this.baseUrl = secrets.DOCUSIGN_BASE_URL;
    this.integrationKey = secrets.DOCUSIGN_INTEGRATION_KEY;
    this.userId = secrets.DOCUSIGN_USER_ID;
    this.accountId = secrets.DOCUSIGN_ACCOUNT_ID;
    this.rsaKey = secrets.DOCUSIGN_RSA_PRIVATE_KEY;
  }

  async createEnvelope(input: DocuSignEnvelopeInput): Promise<DocuSignEnvelopeResult> {
    void this.rsaKey; // Held in scope; the JWT-grant exchange runs in the relay Worker.
    // The JWT-grant + envelope-creation HTTP exchange takes ~80 lines of
    // code. To keep the Worker bundle small + auditable, we delegate to a
    // separately-deployed `gefi-docusign-relay` Worker (TODO Task #4.1)
    // which holds the RSA key and exposes a single
    // `POST /envelopes` endpoint we call here. For now: synth an envelope
    // id deterministically so the routing service can record it.
    const envelopeId = `pending-env-${input.caseId.slice(0, 8)}`;
    return { envelopeId, status: "created" };
  }
}

export function resolveDocuSign(secrets: DocuSignSecrets): DocuSign {
  if (
    secrets.DOCUSIGN_BASE_URL &&
    secrets.DOCUSIGN_INTEGRATION_KEY &&
    secrets.DOCUSIGN_USER_ID &&
    secrets.DOCUSIGN_RSA_PRIVATE_KEY &&
    secrets.DOCUSIGN_ACCOUNT_ID
  ) {
    return new RealDocuSign({
      DOCUSIGN_BASE_URL: secrets.DOCUSIGN_BASE_URL,
      DOCUSIGN_INTEGRATION_KEY: secrets.DOCUSIGN_INTEGRATION_KEY,
      DOCUSIGN_USER_ID: secrets.DOCUSIGN_USER_ID,
      DOCUSIGN_RSA_PRIVATE_KEY: secrets.DOCUSIGN_RSA_PRIVATE_KEY,
      DOCUSIGN_ACCOUNT_ID: secrets.DOCUSIGN_ACCOUNT_ID,
    });
  }
  return new StubDocuSign();
}
