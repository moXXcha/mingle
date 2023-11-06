import { Database } from "@/app/auth/supabase";
import { AuthSchema } from "@/types/types";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// ? 関数名
export async function login(rawEmail: string, rawPassword: string) {
  console.log("login");
  try {
    // 引数のvalidation
    const { email: validatedEmail, password: validatedPassword } = AuthSchema.parse({
      email: rawEmail,
      password: rawPassword,
    });

    // Supabaseのclientを作成
    const cookieStore = cookies();
    const supabase = createServerActionClient<Database>({ cookies: () => cookieStore });

    // login
    const { data: _authData, error } = await supabase.auth.signInWithPassword({
      email: validatedEmail,
      password: validatedPassword,
    });

    if (error) {
      if (error instanceof Error) {
        console.error("error: ", error.message);
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

/*

formDataのvalidation これactionsでは？
DTO

*/
