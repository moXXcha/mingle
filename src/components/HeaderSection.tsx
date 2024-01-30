import { getUserNameByUserId } from '@/server/user';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { Header } from './ui/Header';

// todo もっと良い名前はないか？
export const HeaderSection = async () => {
  // ログイン中のユーザーを取得
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ログイン中のユーザーのuserNameを取得
  const userName = await getUserNameByUserId({ userId: user?.id as string });

  return <Header userName={userName} />;
};
