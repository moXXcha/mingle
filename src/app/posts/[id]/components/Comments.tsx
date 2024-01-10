'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';

type Props = {
  postId: string;
};

// type User = {
//   id: string;
//   userName: string;
//   displayName: string;
//   avatarUrl: string;
// };

// TODO より良いコンポーネント名を考える
export const Comments = async (props: Props) => {
  // ログイン中のユーザー情報を取得する
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log('user: ', user);

  return (
    <div>
      <CommentForm postId={props.postId} />
      <CommentList postId={props.postId} />
    </div>
  );
};

/*
Commentsでログイン中のユーザー情報を取得する
UserオブジェクトをPropsでCommentFormに渡す

TODO userかprofileサービスを作り直したほうがいいかも
usersテーブルとprofilesテーブルのデータを取得するサービスが欲しい

*/
