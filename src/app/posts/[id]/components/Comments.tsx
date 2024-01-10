'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { commentFormAction } from '../action';
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

  const commentFormActionWithPostIdAndUserId = commentFormAction.bind(
    null,
    props.postId,
    user?.id as string,
  );

  return (
    <div>
      <CommentForm formAction={commentFormActionWithPostIdAndUserId} />
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
