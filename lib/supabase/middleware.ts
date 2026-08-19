/**
 * lib/supabase/middleware.ts
 * Refreshes the Supabase auth session on every request and exposes the
 * current user + their installer row (trial/subscription status) so
 * middleware.ts can decide whether to gate the request.
 */

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = { name: string; value: string; options: CookieOptions };

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request: { headers: request.headers } });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let installer: {
    subscription_status: string;
    trial_start: string;
  } | null = null;

  if (user) {
    const { data } = await supabase
      .from("installers")
      .select("subscription_status, trial_start")
      .eq("user_id", user.id)
      .single();

    if (data) {
      installer = data;
    } else {
      // No row yet — happens whenever a user ends up authenticated without
      // /auth/callback's upsert having run (e.g. Supabase delivered the
      // confirmation session via a URL fragment instead of ?code=, which
      // never reaches the server). Create the trial row here instead of
      // treating "no row" as "no access".
      const { data: created } = await supabase
        .from("installers")
        .insert({ user_id: user.id, trial_start: new Date().toISOString() })
        .select("subscription_status, trial_start")
        .single();
      installer = created;
    }
  }

  return { response, user, installer };
}
