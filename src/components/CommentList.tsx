'use server';

import { db } from '@/server/db';
import { desc, eq } from 'drizzle-orm';
import { comments, profiles, users } from 'drizzle/schema';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  postId: string;
};

export const CommentList = async (props: Props) => {
  console.log('CommentList START');

  const comments = await getCommentsByPostId(props.postId);
  if (!comments) {
    return <div>コメントがありません</div>;
  }

  return (
    <div>
      {comments.map((comment, index) => (
        <div key={index} className="my-5 flex">
          <Link
            href={`/${comment.userName}`}
            className="mb-1 font-bold text-[#646767]"
          >
            <Image
              className="mr-2 block h-11 w-11 rounded-full"
              src={comment.avatarUrl}
              alt="icon"
              width={100}
              height={100}
              priority={true}
            />
          </Link>
          {/* <div>
            <Link href={`/${comment.userName}`} className="font-bold">
              {comment.displayName}
            </Link>
            <div className="border">{comment.comment}</div>
          </div> */}

          <div className="w-full">
            <p className="mb-1 font-bold text-[#646767]">
              {comment.displayName}
            </p>
            <div className="min-h-14 w-full rounded-md border border-[#6E96A5]">
              <p className="mx-auto my-3 w-11/12 text-xs text-[#646767]">
                {comment.comment}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const getCommentsByPostId = async (postId: string) => {
  try {
    const result = await db
      .select({
        comment: comments.comment,
        displayName: profiles.displayName,
        avatarUrl: profiles.avatarUrl,
        userName: users.userName,
      })
      .from(comments)
      .where(eq(comments.postId, postId))
      .innerJoin(users, eq(comments.userId, users.id))
      .innerJoin(profiles, eq(users.id, profiles.id))
      .orderBy(desc(comments.createdAt));

    return result;
  } catch (error) {
    console.log('ERROR !!!!!!!!!!!');
    console.log(error);
  }
};
