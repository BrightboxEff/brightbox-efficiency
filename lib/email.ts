/**
 * lib/email.ts
 * Minimal Resend wrapper (plain fetch, no SDK) for the emails this app
 * sends: notifying the Brightbox team of paid consultation requests and
 * tutoring bookings.
 */

async function sendEmail(input: { to: string; replyTo?: string; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(`RESEND_API_KEY not set — skipping email: ${input.subject}`);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Brightbox Solar Calculator <onboarding@resend.dev>",
      to: [input.to],
      reply_to: input.replyTo,
      subject: input.subject,
      html: input.html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`Failed to send email (${input.subject}):`, res.status, body);
  }
}

interface ConsultationEmailInput {
  to: string;
  installerEmail: string;
  installerCompanyName: string;
  projectName?: string;
  postcode: string;
  addressLine?: string;
  summary: {
    paybackYears: number;
    annualGenerationKwh: number;
    totalAnnualBenefitGbp: number;
    systemSizeKwp: number;
    systemCostGbp: number;
  };
}

export async function sendConsultationRequestEmail(input: ConsultationEmailInput): Promise<void> {
  const { to, installerEmail, installerCompanyName, projectName, postcode, addressLine, summary } =
    input;

  const html = `
    <h2>New paid consultation request</h2>
    <p><strong>From:</strong> ${installerCompanyName} (${installerEmail})</p>
    ${projectName ? `<p><strong>Project:</strong> ${projectName}</p>` : ""}
    <p><strong>Address:</strong> ${addressLine || postcode}</p>
    <h3>Calculation summary</h3>
    <ul>
      <li>System size: ${summary.systemSizeKwp} kWp</li>
      <li>System cost: £${summary.systemCostGbp.toLocaleString()}</li>
      <li>Annual generation: ${summary.annualGenerationKwh.toLocaleString()} kWh</li>
      <li>Total annual benefit: £${summary.totalAnnualBenefitGbp.toLocaleString()}</li>
      <li>Payback period: ${Number.isFinite(summary.paybackYears) ? `${summary.paybackYears} yrs` : "N/A"}</li>
    </ul>
    <p>Payment of £40 has been received — please schedule the 1-hour consultation call.</p>
  `;

  await sendEmail({
    to,
    replyTo: installerEmail,
    subject: `Consultation request — ${projectName || postcode}`,
    html,
  });
}

interface TutoringPurchaseEmailInput {
  to: string;
  buyerEmail: string;
  hours: number;
  totalGbp: number;
}

export async function sendTutoringPurchaseEmail(input: TutoringPurchaseEmailInput): Promise<void> {
  const { to, buyerEmail, hours, totalGbp } = input;

  const html = `
    <h2>New tutoring booking</h2>
    <p><strong>From:</strong> ${buyerEmail}</p>
    <p><strong>Hours booked:</strong> ${hours}</p>
    <p><strong>Amount paid:</strong> £${totalGbp.toLocaleString()}</p>
    <p>Please reach out to arrange a time.</p>
  `;

  await sendEmail({
    to,
    replyTo: buyerEmail,
    subject: `Tutoring booking — ${hours} hour${hours === 1 ? "" : "s"}`,
    html,
  });
}
