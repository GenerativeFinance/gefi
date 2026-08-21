/**
 * Resend email abstraction for dunning + receipt emails. Same stub /
 * real split as `@gefi/compliance-engine/mailer`.
 */

import type { ResendSecrets } from "@gefi/shared-types";

export interface SendInput {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export interface SendResult {
  id: string;
  sent: boolean;
}

export interface Mailer {
  send(input: SendInput): Promise<SendResult>;
  readonly live: boolean;
}

export class StubMailer implements Mailer {
  readonly live = false;
  readonly outbox: Array<SendInput & { id: string }> = [];
  async send(input: SendInput): Promise<SendResult> {
    const id = `stub_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
    this.outbox.push({ ...input, id });
    return { id, sent: false };
  }
}

export class RealResendMailer implements Mailer {
  readonly live = true;
  private readonly apiKey: string;
  private readonly fromAddress: string;

  constructor(secrets: Required<Pick<ResendSecrets, "RESEND_API_KEY" | "RESEND_FROM_ADDRESS">>) {
    this.apiKey = secrets.RESEND_API_KEY;
    this.fromAddress = secrets.RESEND_FROM_ADDRESS;
  }

  async send(input: SendInput): Promise<SendResult> {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: this.fromAddress,
        to: [input.to],
        subject: input.subject,
        text: input.text,
        html: input.html,
      }),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`resend_error:${res.status}:${txt.slice(0, 240)}`);
    }
    const out = (await res.json()) as { id: string };
    return { id: out.id, sent: true };
  }
}

export function resolveMailer(secrets: ResendSecrets): Mailer {
  if (secrets.RESEND_API_KEY && secrets.RESEND_FROM_ADDRESS) {
    return new RealResendMailer({
      RESEND_API_KEY: secrets.RESEND_API_KEY,
      RESEND_FROM_ADDRESS: secrets.RESEND_FROM_ADDRESS,
    });
  }
  return new StubMailer();
}

/** Standard dunning template — past-due subscription notice. */
export function buildDunningEmail(args: {
  tenantName: string;
  amountCents: number;
  retryUrl: string;
}): SendInput {
  const amount = (args.amountCents / 100).toFixed(2);
  const subject = `[GeFi] Payment failed — please update your card`;
  const text = [
    `Hi ${args.tenantName},`,
    ``,
    `We weren't able to charge your card for $${amount} this period.`,
    `Please update your payment method to avoid losing access:`,
    args.retryUrl,
    ``,
    `— The GeFi billing team`,
  ].join("\n");
  return { to: "", subject, text };
}
