/**
 * lib/reportGeneration.ts
 * Drafts an energy-saving report from a survey submission's answers and
 * uploaded utility bills, using Claude's Messages API directly (plain
 * fetch, no SDK — Claude reads PDFs and images natively as document/image
 * content blocks). This is a DRAFT only: app/survey/review/[id] lets a
 * Brightbox team member edit it before it's ever sent to the customer.
 */

import { createAdminClient } from "@/lib/supabase/server";
import { SPEND_BRACKETS, MOTIVATIONS, type ConsumptionIntensity, type EquipmentItem } from "@/types/survey";

const MODEL = "claude-sonnet-5";
const BUCKET = "utility-bills";

function labelFor(list: readonly { value: string; label: string }[], value: string) {
  return list.find((item) => item.value === value)?.label ?? value;
}

interface SubmissionRow {
  first_name: string;
  last_name: string;
  business_name: string;
  annual_spend_bracket: string;
  operations_description: string;
  consumption_intensity: ConsumptionIntensity;
  motivations: string[];
  equipment: EquipmentItem[];
  largest_consumers: string | null;
  urgency: number;
  bill_file_paths: string[];
}

export async function generateEnergyReport(submissionId: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set — cannot generate a report.");
  }

  const supabase = createAdminClient();

  const { data: submission, error } = await supabase
    .from("energy_survey_submissions")
    .select(
      "first_name, last_name, business_name, annual_spend_bracket, operations_description, consumption_intensity, motivations, equipment, largest_consumers, urgency, bill_file_paths"
    )
    .eq("id", submissionId)
    .single();

  if (error || !submission) {
    throw new Error("Survey submission not found.");
  }

  const row = submission as SubmissionRow;

  const documentBlocks = await Promise.all(
    row.bill_file_paths.map(async (path) => {
      const { data: file, error: downloadError } = await supabase.storage
        .from(BUCKET)
        .download(path);

      if (downloadError || !file) {
        console.error(`Failed to download bill ${path}:`, downloadError);
        return null;
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString("base64");
      const isPdf = path.toLowerCase().endsWith(".pdf");

      return isPdf
        ? { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } }
        : {
            type: "image",
            source: {
              type: "base64",
              media_type: path.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg",
              data: base64,
            },
          };
    })
  );

  const validDocumentBlocks = documentBlocks.filter((b) => b !== null);

  const consumptionSummary = (["hvac", "lighting", "machinery", "it"] as const)
    .map((key) => `${key}: ${row.consumption_intensity[key]}`)
    .join(", ");

  const equipmentSummary = (row.equipment ?? [])
    .map((item) => {
      const parts = [`${item.quantity}x ${item.name}`];
      if (item.estimatedWattage) parts.push(`~${item.estimatedWattage}W each`);
      if (item.hoursPerDay) parts.push(`~${item.hoursPerDay}h/day`);
      if (item.estimatedWattage && item.hoursPerDay) {
        const dailyKwh = (item.estimatedWattage * item.quantity * item.hoursPerDay) / 1000;
        parts.push(`≈${dailyKwh.toFixed(1)} kWh/day, ≈${(dailyKwh * 365).toFixed(0)} kWh/year combined`);
      }
      return `- ${parts.join(", ")}`;
    })
    .join("\n");

  const contextText = `
Business: ${row.business_name} (contact: ${row.first_name} ${row.last_name})
Estimated annual electricity/gas spend: ${labelFor(SPEND_BRACKETS, row.annual_spend_bracket)}
Operations: ${row.operations_description}
Self-rated energy consumption intensity by area: ${consumptionSummary}
Primary motivations: ${row.motivations.map((m) => labelFor(MOTIVATIONS, m)).join(", ")}
Urgency (1-5, 5 = most urgent): ${row.urgency}

Equipment profile (as reported by the customer; wattage/hours are estimates where given):
${equipmentSummary || "(none itemised)"}
${row.largest_consumers ? `\nAdditional notes on biggest energy users: ${row.largest_consumers}` : ""}

Attached: their utility bills for the last 12 months.
`.trim();

  const systemPrompt = `You are an energy efficiency consultant at Brightbox Efficiency Consultants, drafting a report for a paying customer based on their survey answers and attached utility bills. Match the depth and style of Brightbox's own hand-written energy scorecards: concrete, numbers-led, and tied to specific equipment — not generic advice.

Write the report as a simple HTML fragment (only <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, and <table>/<thead>/<tbody>/<tr>/<th>/<td> tags — no <html>/<head>/<body>, no inline styles, no <script>). Structure:

1. <h2>Executive Summary</h2> — headline figures: their total annual spend bracket, an estimated savings percentage range, and the single biggest opportunity you can identify from the bills and equipment profile.
2. <h2>Bill Summary</h2> — what the attached utility bills actually show: usage patterns, seasonal variation, notable spend, any anomalies. If the bills contain enough monthly data, present it as a small table.
3. <h2>Facility Equipment Profile</h2> — restate the customer's reported equipment as a table (Item, Quantity, Est. Wattage, Est. Daily Use, Est. Annual kWh) using the figures given, computing annual kWh where wattage and hours/day are both present. Flag which items look like the largest consumers.
4. <h2>Findings & Recommended Initiatives</h2> — 4-6 numbered findings, each with: Current situation, Recommendation, Suggested product or fix (you MAY name a specific, well-known, plausible product type and an indicative UK price in plain text, e.g. "Smart plug timer (~£8-15)" or "LED T8 tube retrofit (~£4-7 per tube)" — do NOT invent a hyperlink or a specific vendor URL, since you cannot verify one exists), Estimated annual saving, and rough payback if calculable.
5. <h2>Further Reading</h2> — 1-2 stable, well-known general resources if genuinely relevant, e.g. https://www.gov.uk/business-energy-efficiency or https://www.energysavingtrust.org.uk.

This is a DRAFT that a human consultant will review, add their own expertise to, and edit before it's sent — write it as a strong, specific first pass, not final copy. Ground every figure in what's actually in the bills and the equipment profile; state assumptions explicitly rather than inventing precision you don't have.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [...validDocumentBlocks, { type: "text", text: contextText }],
        },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Claude API error (${res.status}): ${body}`);
  }

  const data = await res.json();
  const text = data.content?.find((block: any) => block.type === "text")?.text;

  if (!text) {
    throw new Error("Claude API returned no report text.");
  }

  return text;
}
