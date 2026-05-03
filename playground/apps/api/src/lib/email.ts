/**
 * Resend email wrapper.
 *
 * In dev/test (no API key, or ENVIRONMENT="dev"), the wrapper logs a
 * redacted summary instead of calling the Resend API. Real sends only
 * happen in staging/production with a configured key.
 */
export interface SendEmailArgs {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export interface EmailSender {
  send(args: SendEmailArgs): Promise<{ id: string | null; stubbed: boolean }>;
}

export class ResendEmailSender implements EmailSender {
  constructor(
    private readonly apiKey: string | undefined,
    private readonly stubbed: boolean,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  async send(args: SendEmailArgs): Promise<{ id: string | null; stubbed: boolean }> {
    if (this.stubbed || !this.apiKey) {
      const domain = args.to.split("@")[1] ?? "unknown";
      console.log("[email stub]", {
        subject: args.subject,
        toDomain: domain,
        bodyLen: args.html.length,
      });
      return { id: null, stubbed: true };
    }
    const res = await this.fetchImpl("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Resend send failed (${res.status}): ${body.slice(0, 200)}`);
    }
    const data = (await res.json()) as { id?: string };
    return { id: data.id ?? null, stubbed: false };
  }
}

export function magicLinkEmailHtml(verifyUrl: string, ttlMinutes: number): string {
  return `<!doctype html><html><body style="font-family:Inter,system-ui,sans-serif;background:#0B0E1A;color:#E6E8F0;padding:32px">
  <div style="max-width:480px;margin:auto;background:#141826;border-radius:16px;padding:32px">
    <h1 style="color:#6D5BFF;margin:0 0 16px;font-size:20px">Sign in to GeFi Playground</h1>
    <p style="margin:0 0 24px;color:#8A8FA3">Click the button below to sign in. This link expires in ${ttlMinutes} minutes and can only be used once.</p>
    <p style="margin:0 0 24px"><a href="${verifyUrl}" style="display:inline-block;background:#6D5BFF;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none">Sign in</a></p>
    <p style="margin:0;color:#8A8FA3;font-size:12px">If you didn't request this, you can ignore this email.</p>
  </div>
</body></html>`;
}
