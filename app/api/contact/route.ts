/**
 * app/api/contact/route.ts
 * Public contact form endpoint — emails the submission to the Brightbox team.
 */

import { NextRequest, NextResponse } from "next/server";
import { BRAND } from "@/lib/brand";
import { sendContactFormEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  if (!name || !email || !email.includes("@") || !message) {
    return NextResponse.json(
      { error: "Please fill in your name, a valid email, and a message." },
      { status: 400 }
    );
  }
  if (message.length > 5000) {
    return NextResponse.json({ error: "Message is too long." }, { status: 400 });
  }

  await sendContactFormEmail({
    to: BRAND.contactEmail,
    name,
    fromEmail: email,
    message,
  });

  return NextResponse.json({ ok: true });
}
