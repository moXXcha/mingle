import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { Database } from "./types/supabase";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });
  // ユーザーのsessionを更新
  const { data: _session, error } = await supabase.auth.getSession();
  if (error) {
    console.error(error.message);
  }
  return res;
}
