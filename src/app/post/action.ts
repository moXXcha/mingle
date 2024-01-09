'use server';

import { createMusicFileRepository } from '@/server/repository/musicFile';
import { createPostRepository } from '@/server/repository/post';
import { createPostTagRelationRepository } from '@/server/repository/postTagRelations';
import { createTagRepository } from '@/server/repository/tag';
import { createUserRepository } from '@/server/repository/user';
import { createPostService } from '@/server/service/post';
import { createTagService } from '@/server/service/tag';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import 'server-only';

export async function createPostFormAction(formData: FormData) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('ログインしてください');
    }

    // TODO validation

    const postService = createPostService(
      createPostRepository(),
      createUserRepository(),
      createMusicFileRepository(),
      createTagService(createTagRepository()),
      createPostTagRelationRepository(),
    );

    const postId = await postService.createPost({
      userId: user.id,
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      musicFile: formData.get('musicFile') as File,
      tags: formData.getAll('tags') as string[],
    });

    console.log('postId: ', postId);

    return { message: '投稿を作成しました' };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '不明なエラーが発生しました';
    console.log('errorMessage: ', errorMessage);
  }
}
