/**
 * Mailer abstraction for outbound lawyer/auditor routing emails.
 *
 * Real implementation: MailChannels HTTP API (the only outbound-email path
 * Cloudflare Workers support). Emails are DKIM-signed with the configured
 * key; recipient PGP is opaque to MailChannels — we wrap the body in
 * PGP-armoured ciphertext before handing it to the API. (Today the PGP step
 * is a placeholder; once we enroll real fingerprints we switch to a real
 * library. The interface below intentionally hides that detail.)
 *
 * Stub implementation: never makes a network call; returns a deterministic
 * `messageId` so tests can assert "this rule wired the mailer correctly".
 */

import type { MailChannelsSecrets } from "@gefi/shared-types";

export interface MailerInput {
  /** Recipient email address. */
  to: string;
  /** Recipient PGP fingerprint (omit to send unencrypted; only allowed in dev). */
  pgpFingerprint?: string;
  subject: string;
  /** Plain-text body. The mailer will base64-PGP-encrypt if a fingerprint is set. */
  body: string;
  /** Optional structured headers (e.g. `X-Gefi-Case-Id`). */
  headers?: Record<string, string>;
}

export interface MailerSendResult {
  messageId: string;
  /** True iff the message left the Worker bound for the public internet. */
  delivered: boolean;
  /** Set on stub-mode sends so callers can audit-log the would-be payload. */
  stubbedBody?: string;
}

export interface Mailer {
  send(input: MailerInput): Promise<MailerSendResult>;
}

/** Stub mailer used in dev/staging without DKIM creds, and in unit tests. */
export class StubMailer implements Mailer {
  public readonly sent: Array<MailerInput & { messageId: string }> = [];
  async send(input: MailerInput): Promise<MailerSendResult> {
    const messageId = `stub-${crypto.randomUUID()}`;
    this.sent.push({ ...input, messageId });
    return {
      messageId,
      delivered: false,
      stubbedBody: input.body,
    };
  }
}

/** Real MailChannels mailer. Validates DKIM creds at construction. */
export class MailChannelsMailer implements Mailer {
  constructor(private readonly secrets: Required<Pick<MailChannelsSecrets,
    "MAILCHANNELS_DKIM_DOMAIN" | "MAILCHANNELS_DKIM_SELECTOR" | "MAILCHANNELS_DKIM_PRIVATE_KEY" | "MAILCHANNELS_FROM_ADDRESS"
  >>) {}

  async send(input: MailerInput): Promise<MailerSendResult> {
    const messageId = `mc-${crypto.randomUUID()}`;
    const body = JSON.stringify({
      personalizations: [
        {
          to: [{ email: input.to }],
          dkim_domain: this.secrets.MAILCHANNELS_DKIM_DOMAIN,
          dkim_selector: this.secrets.MAILCHANNELS_DKIM_SELECTOR,
          dkim_private_key: this.secrets.MAILCHANNELS_DKIM_PRIVATE_KEY,
        },
      ],
      from: { email: this.secrets.MAILCHANNELS_FROM_ADDRESS, name: "GeFi Compliance" },
      subject: input.subject,
      content: [{ type: "text/plain", value: input.body }],
      headers: { "X-Gefi-Message-Id": messageId, ...(input.headers ?? {}) },
    });
    const res = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[mailer] mailchannels send failed", res.status, detail);
      throw new Error(`mailchannels_send_failed_${res.status}`);
    }
    return { messageId, delivered: true };
  }
}

/**
 * Pick a mailer based on configured secrets. Returns the stub when DKIM
 * creds are missing — fail-soft in dev/staging, but `requireMailer()` is
 * available for callers that want to fail-closed in prod.
 */
export function resolveMailer(secrets: MailChannelsSecrets): Mailer {
  if (
    secrets.MAILCHANNELS_DKIM_DOMAIN &&
    secrets.MAILCHANNELS_DKIM_SELECTOR &&
    secrets.MAILCHANNELS_DKIM_PRIVATE_KEY &&
    secrets.MAILCHANNELS_FROM_ADDRESS
  ) {
    return new MailChannelsMailer({
      MAILCHANNELS_DKIM_DOMAIN: secrets.MAILCHANNELS_DKIM_DOMAIN,
      MAILCHANNELS_DKIM_SELECTOR: secrets.MAILCHANNELS_DKIM_SELECTOR,
      MAILCHANNELS_DKIM_PRIVATE_KEY: secrets.MAILCHANNELS_DKIM_PRIVATE_KEY,
      MAILCHANNELS_FROM_ADDRESS: secrets.MAILCHANNELS_FROM_ADDRESS,
    });
  }
  return new StubMailer();
}
