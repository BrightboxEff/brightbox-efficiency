/**
 * app/auth/callback/route.ts
 * Exchanges the Supabase email-confirmation code for a session, then
 * ensures an `installers` row exists for the new user (trial starts now).
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = createClient();
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    if (data.user) {
      await supabase.from("installers").upsert(
        {
          user_id: data.user.id,
          trial_start: new Date().toISOString(),
        },
        { onConflict: "user_id", ignoreDuplicates: true }
      );
    }
  }

  return NextResponse.redirect(`${origin}/`);
}
