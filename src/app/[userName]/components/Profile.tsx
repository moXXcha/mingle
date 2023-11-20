'use server';

import { getProfileByUserId } from '@/server/profile/profile-dto';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Image from 'next/image';

export const Profile = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.log(error);
  }

  // データ取得
  // ? userName userId どちらで取得するのが良い？
  const profile = await getProfileByUserId(data.session?.user.id as string);
  console.log(profile);
  return (
    <div>
      <div>{profile?.displayName}</div>
      <div>{profile?.overview}</div>
      <Image
        src={profile?.avatarUrl as string}
        alt="icon"
        width={200}
        height={200}
      />
    </div>
  );
};
