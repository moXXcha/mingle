'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { userNameFormAction } from './userNameFormAction';

export default async function UserNameForm() {
  const cookieStore = cookies();

  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const { data, error } = await supabase.auth.getSession();

  if (error) console.log(error);

  return (
    <div>
      ユーザーネームを決めてください
      <form action={userNameFormAction}>
        <input type="text" name="userName" required />
        <button type="submit">submit</button>
      </form>
      <div>{data.session?.user.email}</div>
    </div>
  );
}
