import { getUserByUserId } from '@/server/user/user-dto';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { Profile } from './components/Profile';
import ProfileTab from './components/ProfileTab';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data } = await supabase.auth.getUser();

  const user = await getUserByUserId(data.user?.id as string);
  return (
    <div>
      <Profile userName={user?.userName as string} />
      <ProfileTab userName={user?.userName as string} />
      <div>{children}</div>
    </div>
  );
}
