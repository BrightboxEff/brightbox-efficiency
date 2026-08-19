/**
 * lib/reportGeneration.ts
 * Drafts an energy-saving report from a survey submission's answers and
 * uploaded utility bills, using Claude's Messages API directly (plain
 * fetch, no SDK — Claude reads PDFs and images natively as document/image
 * content blocks). This is a DRAFT only: app/survey/review/[id] lets a
 * Brightbox team member edit it before it's ever sent to the customer.
 */

import { createAdminClient } from "@/lib/supabase/server";
import { SPEND_BRACKETS, MOTIVATIONS, type ConsumptionIntensity } from "@/types/survey";

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
  largest_consumers: string;
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
      "first_name, last_name, business_name, annual_spend_bracket, operations_description, consumption_intensity, motivations, largest_consumers, urgency, bill_file_paths"
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

  const contextText = `
Business: ${row.business_name} (contact: ${row.first_name} ${row.last_name})
Estimated annual electricity/gas spend: ${labelFor(SPEND_BRACKETS, row.annual_spend_bracket)}
Operations: ${row.operations_description}
Self-rated energy consumption intensity by area: ${consumptionSummary}
Primary motivations: ${row.motivations.map((m) => labelFor(MOTIVATIONS, m)).join(", ")}
Largest consuming items/equipment they identified: ${row.largest_consumers}
Urgency (1-5, 5 = most urgent): ${row.urgency}

Attached: their utility bills for the last 12 months.
`.trim();

  const systemPrompt = `You are an energy efficiency consultant at Brightbox Efficiency Consultants, drafting a report for a paying customer based on their survey answers and attached utility bills.

Write a clear, practical report as a simple HTML fragment (only <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em> tags — no <html>/<head>/<body>, no inline styles, no <script>). Structure:
1. A short summary of what their bills show (usage patterns, notable spend, any anomalies you can see).
2. 4-6 specific, practical energy-saving hints and tips tailored to their described operations, self-rated consumption intensity, and largest consuming items.
3. A "Suggested equipment & further reading" section naming relevant equipment categories (e.g. LED retrofit lighting, voltage optimisation, smart HVAC controls, sub-metering) — describe categories in plain text, do NOT invent or link to specific vendor/product URLs since you cannot verify they exist or are current. You may link to well-known, stable general resources such as https://www.gov.uk/business-energy-efficiency or https://www.energysavingtrust.org.uk if genuinely relevant.

This is a DRAFT that a human consultant will review and edit before it's sent — write it as a solid first pass, not final copy. Be specific and grounded in what's actually in the bills and survey answers; don't pad with generic advice unconnected to their situation.`;

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
