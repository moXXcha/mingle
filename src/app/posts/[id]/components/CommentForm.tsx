'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { commentFormAction } from '../action';

type Props = {
  postId: string;
};

export const CommentForm = async (props: Props) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log('user: ', user);

  // bindでpostIdを渡す
  const commentFormActionWithPostIdAndUserId = commentFormAction.bind(
    null,
    props.postId,
    user?.id as string,
  );

  return (
    <div>
      <div>コメント入力フォーム</div>

      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form action={commentFormActionWithPostIdAndUserId}>
        <input className="border" type="text" name="comment" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

/*
ユーザーのアイコンを表示する
どうやって取得する？


*/
