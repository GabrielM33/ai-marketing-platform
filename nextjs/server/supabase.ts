import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies, type UnsafeUnwrappedCookies } from "next/headers";

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Cookie: (cookies() as unknown as UnsafeUnwrappedCookies).toString(),
      },
    },
  });
};
