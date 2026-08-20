"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import TutoringPurchaseForm from "@/components/TutoringPurchaseForm";

export default function TutoringPage() {
  const [status, setStatus] = useState<"success" | "cancelled" | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const purchase = params.get("purchase");
    if (purchase === "success" || purchase === "cancelled") {
      setStatus(purchase);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-charcoal">1:1 Engineering Interview Tutoring</h1>
      <p className="mt-2 max-w-2xl text-charcoal/70">
        One-to-one coaching for technical and engineering interviews — mock interviews, problem
        walkthroughs, and targeted feedback with a Brightbox engineer. Book by the hour, no
        minimum commitment.
      </p>

      {status === "success" && (
        <p className="mt-4 rounded-md border border-moss/30 bg-moss/10 px-4 py-3 text-sm text-charcoal">
          Thanks — your booking is confirmed. We&apos;ll email you to arrange a time.
        </p>
      )}
      {status === "cancelled" && (
        <p className="mt-4 rounded-md border border-border-muted bg-cream px-4 py-3 text-sm text-charcoal/70">
          Payment was cancelled — no charge was made.
        </p>
      )}

      <div className="mt-8 flex items-center gap-4 rounded-lg border border-border-muted bg-white p-5 shadow-sm">
        <Image
          src="/paul-headshot.png"
          alt="Paul, your tutor"
          width={175}
          height={175}
          className="h-16 w-16 shrink-0 rounded-full border-2 border-moss object-cover sm:h-20 sm:w-20"
        />
        <div>
          <p className="font-medium text-charcoal">Your tutor: Paul Johnson</p>
          <p className="mt-1 text-sm text-charcoal/70">
            20+ years in engineering, with real interview-panel experience from hiring loops —
            coaching drawn from what actually gets candidates through the door, not generic tips.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-border-muted bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-charcoal">5 tips for engineering interviews</h2>
          <ol className="mt-4 space-y-3 text-sm text-charcoal/80">
            <li>
              <span className="font-medium text-charcoal">1. Talk through your reasoning.</span>{" "}
              Interviewers are grading how you think, not just whether you land on the right
              answer — narrate your approach as you go.
            </li>
            <li>
              <span className="font-medium text-charcoal">2. Revisit fundamentals, not solutions.</span>{" "}
              Memorising specific problems runs out fast. Solid grasp of core data structures,
              algorithms, or systems-design principles generalises to anything they ask.
            </li>
            <li>
              <span className="font-medium text-charcoal">3. Ask clarifying questions first.</span>{" "}
              Jumping straight in reads as a red flag. Confirm constraints, edge cases, and scope
              before you start solving.
            </li>
            <li>
              <span className="font-medium text-charcoal">4. Do timed mock runs.</span> The
              pressure of a live interview is its own skill — practising under a clock builds
              comfort that untimed prep doesn&apos;t.
            </li>
            <li>
              <span className="font-medium text-charcoal">5. Prepare specific examples.</span> For
              behavioural questions, have 3–4 detailed stories from your own work ready, not vague
              generalities — specifics are what make answers memorable.
            </li>
          </ol>
        </div>

        <div>
          <TutoringPurchaseForm />
        </div>
      </div>
    </div>
  );
}
