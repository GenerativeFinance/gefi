/**
 * DocuSign envelope abstraction.
 *
 * RealDocuSign implements the full JWT-bearer auth flow:
 *   1. Build a JWT (header.payload.signature) using RS256 with the operator's
 *      RSA private key (PKCS#8 PEM stored in DOCUSIGN_RSA_PRIVATE_KEY).
 *   2. POST to DocuSign's token endpoint to exchange the JWT for an
 *      access_token (OAuth 2.0 JWT Grant, RFC 7523).
 *   3. POST to the Envelopes API to create the signing envelope.
 *
 * The RSA key is loaded once per Worker invocation via WebCrypto
 * `importKey`, which keeps it in memory only and never logs it.
 *
 * StubDocuSign: returns deterministic synthetic ids so tests can assert
 * routing wiring without running a real DocuSign session.
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

// ---------------------------------------------------------------------------
// JWT builder (RS256) using WebCrypto — no external deps.
// ---------------------------------------------------------------------------

function base64url(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof ArrayBuffer ? new Uint8Array(buf) : buf;
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]!);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

const enc = new TextEncoder();

async function buildJwt(
  integrationKey: string,
  userId: string,
  baseUrl: string,
  rsaPem: string,
): Promise<string> {
  // Strip PEM headers and decode base64 to get the raw PKCS#8 DER bytes.
  const pemBody = rsaPem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "");
  const derBytes = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));

  const key = await crypto.subtle.importKey(
    "pkcs8",
    derBytes.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );

  // DocuSign JWT audience is the hostname of the auth server, not the base URL.
  // e.g. https://account-d.docusign.com → account-d.docusign.com
  const audience = new URL(baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`).hostname;

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: integrationKey,
    sub: userId,
    aud: audience,
    iat: now,
    exp: now + 3600,
    scope: "signature impersonation",
  };

  const headerB64 = base64url(enc.encode(JSON.stringify(header)));
  const payloadB64 = base64url(enc.encode(JSON.stringify(payload)));
  const signingInput = `${headerB64}.${payloadB64}`;
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, enc.encode(signingInput));

  return `${signingInput}.${base64url(sig)}`;
}

async function fetchAccessToken(
  integrationKey: string,
  userId: string,
  baseUrl: string,
  rsaPem: string,
): Promise<string> {
  const jwt = await buildJwt(integrationKey, userId, baseUrl, rsaPem);
  const tokenUrl = `${baseUrl.replace(/\/$/, "")}/oauth/token`;
  const body = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`;
  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`docusign_token_error_${res.status}: ${detail.slice(0, 200)}`);
  }
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export class RealDocuSign implements DocuSign {
  public readonly baseUrl: string;
  public readonly integrationKey: string;
  public readonly userId: string;
  public readonly accountId: string;
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
    const token = await fetchAccessToken(
      this.integrationKey,
      this.userId,
      this.baseUrl,
      this.rsaKey,
    );

    // Build a minimal envelope definition. We use a server-side template if
    // the operator has configured one; otherwise we embed a bare document.
    const envelopeDefinition = {
      templateId: input.templateId !== "default-template" ? input.templateId : undefined,
      templateRoles: input.templateId !== "default-template"
        ? [
            {
              email: input.recipientEmail,
              name: input.recipientName,
              roleName: "signer",
              tabs: {
                textTabs: Object.entries(input.fields ?? {}).map(([label, value]) => ({
                  tabLabel: label,
                  value,
                })),
              },
            },
          ]
        : undefined,
      documents: input.templateId === "default-template"
        ? [
            {
              documentBase64: btoa(`GeFi Compliance Case: ${input.caseId}\n` +
                Object.entries(input.fields ?? {}).map(([k, v]) => `${k}: ${v}`).join("\n")),
              name: "compliance-case.txt",
              fileExtension: "txt",
              documentId: "1",
            },
          ]
        : undefined,
      recipients: input.templateId === "default-template"
        ? {
            signers: [
              {
                email: input.recipientEmail,
                name: input.recipientName,
                recipientId: "1",
                tabs: { signHereTabs: [{ documentId: "1", pageNumber: "1", xPosition: "100", yPosition: "100" }] },
              },
            ],
          }
        : undefined,
      emailSubject: `[GeFi Compliance] Case ${input.caseId.slice(0, 8)} — signature required`,
      status: "sent",
    };

    const apiBase = this.baseUrl.replace(/\/$/, "");
    const res = await fetch(
      `${apiBase}/restapi/v2.1/accounts/${this.accountId}/envelopes`,
      {
        method: "POST",
        headers: {
          "authorization": `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(envelopeDefinition),
      },
    );
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`docusign_envelope_error_${res.status}: ${detail.slice(0, 200)}`);
    }
    const data = (await res.json()) as { envelopeId: string; status: string };
    return {
      envelopeId: data.envelopeId,
      status: data.status as DocuSignEnvelopeResult["status"],
    };
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
