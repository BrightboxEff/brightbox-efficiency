/**
 * lib/supabase/middleware.ts
 * Refreshes the Supabase auth session on every request and exposes the
 * current user + their installer row (trial/subscription status) so
 * middleware.ts can decide whether to gate the request.
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

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
        setAll(cookiesToSet) {
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
    installer = data;
  }

  return { response, user, installer };
}
