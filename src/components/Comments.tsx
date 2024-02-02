import { commentFormAction } from '@/actions/commentFormAction';
import { getAvatarUrlByUserId } from '@/server/profile';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { Suspense } from 'react';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';

type Props = {
  postId: string;
};

export const Comments = async (props: Props) => {
  // ログイン中のユーザー情報を取得する
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ログインしていない場合の処理
  if (!user) {
    return (
      <div>
        <div className="font-bold text-[#646767] text-xl">Comment</div>

        {/* 別のUIを出したい */}
        {/* <div className="flex">
        <Image
          className="rounded-full w-14 h-14 object-cover"
          src={avatarUrl.value}
          alt="icon"
          width={100}
          height={100}
          priority={true}
        />
        <CommentForm formAction={commentFormActionWithPostIdAndUserId} />
      </div> */}
        <Suspense fallback={<div>Loading...</div>}>
          <CommentList postId={props.postId} />
        </Suspense>
      </div>
    );
  }

  const commentFormActionWithPostIdAndUserId = commentFormAction.bind(
    null,
    props.postId,
    user.id,
  );

  const avatarUrl = await getAvatarUrlByUserId(user.id);
  // avatarUrlが取得できなかった場合には,iconの表示画像をデフォルトのものにするのが良さげ？

  return (
    <div>
      <div className="font-bold text-[#646767] text-xl">Comment</div>

      <div className="flex h-14 border border-[#6E96A5] rounded-lg justify-center items-center px-2">
        {/* TODO avatarUrlが''なら、別の画像？UIを表示する */}
        <Image
          className="h-11 w-11 rounded-full object-cover"
          src={avatarUrl}
          alt="icon"
          width={100}
          height={100}
          priority={true}
        />
        <CommentForm formAction={commentFormActionWithPostIdAndUserId} />
      </div>
      <CommentList postId={props.postId} />
    </div>
  );
};
