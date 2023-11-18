'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import ProfileForm from './components/ProfileForm';
import UserNameForm from './components/UserNameForm';

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log('user: ', user);

  if (!user?.user_metadata.hasUserName) {
    return <UserNameForm />;
  }

  if (user?.user_metadata.hasUserName && !user?.user_metadata.hasProfile) {
    return <ProfileForm />;
  }

  if (user.user_metadata.hasProfile) {
    return <div>オンボーディング完了</div>;
  }
}
