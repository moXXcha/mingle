'use server';

import { createCommentRepository } from '@/server/repository/comment';
import { createCommentService } from '@/server/service/comment';

export async function commentFormAction(
  postId: string,
  userId: string,
  formData: FormData,
) {
  const comment = formData.get('comment') as string;
  console.log(comment);
  console.log(postId);
  console.log(userId);

  // commentを投稿する

  const commentService = createCommentService(createCommentRepository());

  const result = await commentService.createComment({
    postId,
    userId,
    comment,
  });
  if (result.isFailure()) {
    console.log('createCommentが失敗した!!!!');
    console.log(result.value);
  }

  return;
}
