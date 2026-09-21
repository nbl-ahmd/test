import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-schema";
import { site } from "@/content/site";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request): Promise<NextResponse> {
  const ip = clientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages — please try again in a minute." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form." }, { status: 400 });
  }

  const data = parsed.data;

  // Honeypot hit: pretend success so bots do not retry.
  if (data.company.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("[contact] enquiry received (Resend not configured)", {
      name: data.name,
      email: data.email,
      projectType: data.projectType,
      budget: data.budget,
    });
    return NextResponse.json({ ok: true });
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const from =
      process.env.CONTACT_FROM_EMAIL ?? "Domweave Labs <onboarding@resend.dev>";

    const result = await resend.emails.send({
      from,
      to: site.email,
      replyTo: data.email,
      subject: `New enquiry — ${data.projectType} — ${data.name}`,
      text: [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Project type: ${data.projectType}`,
        `Budget: ${data.budget || "not specified"}`,
        "",
        data.message,
      ].join("\n"),
    });

    if (result.error) {
      console.error("[contact] Resend error", result.error);
      return NextResponse.json(
        { error: "We could not send your message. Please email us directly." },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("[contact] send failed", error);
    return NextResponse.json(
      { error: "We could not send your message. Please email us directly." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}