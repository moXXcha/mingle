import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = cookies();
  console.log(cookieStore);

  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data, error } = await supabase.auth.getSession();

  if (error) console.log(error);

  console.log(data);

  return <div></div>;
}
