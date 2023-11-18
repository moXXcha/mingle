'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const metadata = user.user_metadata;
  console.log('metadata: ', metadata);

  return (
    <div>
      <form action="api/auth/logout" method="post">
        <button type="submit">Logout</button>
      </form>
    </div>
  );
}
