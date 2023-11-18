'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.getSession();

  if (error) console.log(error);

  console.log(data);

  return (
    <div>
      <form action="api/auth/logout" method="post">
        <button type="submit">Logout</button>
      </form>
    </div>
  );
}
