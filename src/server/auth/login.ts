import { Database } from "@/app/auth/supabase";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// ? 関数名
export async function login(email: string, password: string) {
  try {
    // Supabaseのclientを作成
    const cookieStore = cookies();
    const supabase = createServerActionClient<Database>({ cookies: () => cookieStore });

    // login
    const { data: _authData, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }

    console.log("login success");
    return;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error(error.message);
    }
  }
}
