import { BRAND } from "@/lib/brand";

export const metadata = {
  title: "Terms & Conditions — Brightbox Efficiency",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl py-12">
      <h1 className="text-3xl font-semibold text-charcoal">Terms &amp; Conditions</h1>
      <p className="mt-2 text-sm text-charcoal/60">Last updated: August 2026</p>

      <div className="mt-8 space-y-6 text-charcoal/80 [&_h2]:pt-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-charcoal [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
        <p>
          Welcome to Brightbox Efficiency Consultants (&quot;Brightbox&quot;, &quot;we&quot;,
          &quot;us&quot;). By using our website, subscribing to the solar payback calculator,
          submitting our energy efficiency survey, booking a consultation or tutoring session, or
          otherwise engaging our services, you (&quot;the Client&quot;) agree to be bound by
          these Terms &amp; Conditions.
        </p>

        <h2>1. Our services</h2>
        <p>Brightbox provides independent, remote-first advisory and consulting services:</p>
        <ul>
          <li>
            <strong>Solar payback calculator</strong> — a subscription tool for solar installers
            and homeowners to model generation, savings, and payback for a given site.
          </li>
          <li>
            <strong>Energy efficiency survey</strong> — a paid, bills-based assessment of a
            site&apos;s equipment and energy use, resulting in a written savings report.
          </li>
          <li>
            <strong>Maintenance consultation</strong> — ongoing system health checks and
            maintenance planning for existing installations.
          </li>
          <li>
            <strong>1:1 engineering interview tutoring</strong> — hourly coaching sessions for
            technical and engineering interviews.
          </li>
          <li>
            <strong>Paid consultation calls</strong> — one-off calls to discuss calculator results
            or survey findings with a Brightbox engineer.
          </li>
        </ul>

        <h2>2. The energy efficiency survey process</h2>
        <ul>
          <li>
            <strong>2.1</strong> After payment, we email you a secure link to upload your utility
            bills for the last 12 months. Your report cannot be prepared until we receive this
            data.
          </li>
          <li>
            <strong>2.2</strong> We use your submitted survey answers and uploaded bills to
            prepare a draft report, which a Brightbox engineer reviews, edits, and adds their own
            expertise to before it is sent to you.
          </li>
          <li>
            <strong>2.3</strong> We aim to send your finished report promptly once your bills are
            received, but delivery timing can vary depending on the complexity of your site and
            the completeness of the data you provide.
          </li>
          <li>
            <strong>2.4</strong> If you&apos;ve added a follow-up consultation, we&apos;ll reach
            out to schedule it once your report has been sent.
          </li>
        </ul>

        <h2>3. Advisory only — no physical execution</h2>
        <ul>
          <li>
            <strong>3.1</strong> All deliverables — written reports, calculator outputs,
            scorecards, and any guidance given on a consultation or tutoring call — are
            independent, advisory engineering recommendations based on the data and information
            you provide us.
          </li>
          <li>
            <strong>3.2</strong> Brightbox does not carry out physical hardware installations,
            site modifications, equipment shutdowns, structural work, or physical asset changes of
            any kind.
          </li>
          <li>
            <strong>3.3</strong> Any decision to implement recommended changes — including HVAC,
            solar PV, battery storage, or other equipment or infrastructure work — is made
            entirely at your own discretion and risk.
          </li>
          <li>
            <strong>3.4</strong> Brightbox accepts no liability for operational losses, downtime,
            equipment damage, regulatory issues, or shortfalls against projected savings arising
            from the implementation of our advice. Estimated savings figures are estimates only,
            based on the data supplied, and are not guaranteed.
          </li>
        </ul>

        <h2>4. Third-party introductions</h2>
        <p>
          Where useful, we may introduce you to vetted local or national suppliers and
          contractors capable of quoting for work identified in your report. These suppliers are
          entirely independent third parties — Brightbox has no ownership or control over them.
          Introductions are made strictly as a courtesy: Brightbox assumes no liability or
          warranty for any subsequent agreement, installation, or work carried out by an
          introduced supplier. Any such engagement is governed by the terms agreed directly
          between you and that supplier.
        </p>

        <h2>5. Data accuracy is your responsibility</h2>
        <p>
          The accuracy and usefulness of our calculator outputs, survey reports, and advice
          depend entirely on the quality and accuracy of the information you provide us —
          including postcode/address details, utility invoices, and descriptions of your
          equipment and operations. Brightbox is not responsible for errors, missed savings
          opportunities, or delays caused by incomplete, inaccurate, or outdated information you
          submit.
        </p>

        <h2>6. Payment and fees</h2>
        <ul>
          <li>
            <strong>6.1</strong> Fees for each service are shown before you pay and are processed
            securely via Stripe. We do not store your card details.
          </li>
          <li>
            <strong>6.2</strong> The solar calculator subscription renews monthly and can be
            cancelled at any time from your billing settings; access continues until the end of
            the paid period.
          </li>
          <li>
            <strong>6.3</strong> One-off fees (energy survey, consultation calls, tutoring hours)
            are payable in full before the relevant service is delivered.
          </li>
          <li>
            <strong>6.4</strong> Brightbox Efficiency Consultants is not currently registered for
            VAT.
          </li>
        </ul>

        <h2>7. Intellectual property</h2>
        <p>
          All methodologies, report formats, calculator logic, and other materials developed by
          Brightbox remain our intellectual property. You&apos;re granted a non-exclusive licence
          to use anything we deliver to you (reports, calculator outputs, PDFs) for your own
          internal or personal purposes.
        </p>

        <h2>8. Data privacy &amp; confidentiality</h2>
        <p>
          Utility bills and other documents you upload are stored in a private, access-controlled
          location and are only used to prepare your report. We do not sell or share your
          commercial data, financial information, or personal details with third parties without
          your explicit consent, except where needed to process a payment (via Stripe) or as
          required by law.
        </p>

        <h2>9. Governing law</h2>
        <p>
          These Terms &amp; Conditions are governed by the laws of the United Kingdom, and any
          disputes are subject to the exclusive jurisdiction of the courts of the United Kingdom.
        </p>

        <h2>10. Contact</h2>
        <p>
          Questions about these terms? Email{" "}
          <a
            href={`mailto:${BRAND.contactEmail}`}
            className="font-medium text-moss underline underline-offset-2"
          >
            {BRAND.contactEmail}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
