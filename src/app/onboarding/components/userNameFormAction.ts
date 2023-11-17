'use server';

import { createUser } from '@/server/user/user-dto';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import 'server-only';

export async function userNameFormAction(formData: FormData) {
  console.log('userNameFormAction');
  const userName = formData.get('userName') as string;
  console.log(userName);

  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('data is null');
    }

    console.log(data.session?.user.id);
    console.log(data.session?.user.email);

    await createUser(
      data.session?.user.id as string,
      userName,
      data.session?.user.email as string,
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
}
