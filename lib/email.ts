/**
 * lib/email.ts
 * Minimal Resend wrapper (plain fetch, no SDK) for every email this app
 * sends: paid consultation/tutoring notifications, and the energy survey's
 * bill-request, review-ready, and final-report emails.
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

export async function sendSurveyBillRequestEmail(input: {
  to: string;
  firstName: string;
  uploadUrl: string;
}): Promise<void> {
  const { to, firstName, uploadUrl } = input;

  const html = `
    <p>Hi ${firstName},</p>
    <p>Thanks for your payment — your energy efficiency survey is confirmed.</p>
    <p>To get started, please share your utility bills from the <strong>last 12 months</strong>
    using the secure link below. These are stored privately and only used to prepare your report.</p>
    <p><a href="${uploadUrl}">${uploadUrl}</a></p>
    <p>Once we have your bills, we'll prepare your energy-saving report and send it over.</p>
  `;

  await sendEmail({ to, subject: "Share your utility bills — Brightbox Energy Survey", html });
}

export async function sendSurveyPaidNotificationEmail(input: {
  to: string;
  submitterEmail: string;
  businessName: string;
  consultationHours: number;
}): Promise<void> {
  const { to, submitterEmail, businessName, consultationHours } = input;

  const html = `
    <h2>New paid energy efficiency survey</h2>
    <p><strong>From:</strong> ${businessName} (${submitterEmail})</p>
    ${consultationHours > 0 ? `<p><strong>Add-on:</strong> ${consultationHours} consultation hour(s)</p>` : ""}
    <p>They've been emailed a secure link to upload their utility bills. You'll get another
    email once a draft report is ready to review.</p>
  `;

  await sendEmail({
    to,
    replyTo: submitterEmail,
    subject: `New survey — ${businessName}`,
    html,
  });
}

export async function sendSurveyReportReadyEmail(input: {
  to: string;
  businessName: string;
  reviewUrl: string;
}): Promise<void> {
  const { to, businessName, reviewUrl } = input;

  const html = `
    <h2>Draft report ready for review</h2>
    <p><strong>${businessName}</strong>'s energy-saving report has been drafted from their
    uploaded utility bills and is ready for your review before it's sent.</p>
    <p><a href="${reviewUrl}">${reviewUrl}</a></p>
  `;

  await sendEmail({ to, subject: `Report ready to review — ${businessName}`, html });
}

export async function sendSurveyFinalReportEmail(input: {
  to: string;
  firstName: string;
  reportHtml: string;
}): Promise<void> {
  const { to, firstName, reportHtml } = input;

  const html = `
    <p>Hi ${firstName},</p>
    <p>Here's your energy efficiency report, prepared from your submitted utility bills.</p>
    <hr />
    ${reportHtml}
  `;

  await sendEmail({ to, subject: "Your Brightbox energy efficiency report", html });
}
