'use server';

import { createPost } from '@/server/post';
import { createPostSchema, formActionResult } from '@/types/types';
import { createClient } from '@/utils/supabase/server';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import 'server-only';

export async function createPostFormAction(
  prevState: formActionResult,
  formData: FormData,
): Promise<formActionResult> {
  let postId = '';
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    // ユーザーがログインしているか確認
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log('ログインしてください');
      throw new Error('ERROR: ログインしてください');
    }

    // validation
    const validation = createPostSchema.safeParse({
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      musicFile: formData.get('musicFile') as File,
      tags: formData.getAll('tags') as string[],
    });

    if (!validation.success) {
      return {
        success: false,
        message: validation.error.message,
      };
    }

    const { title, content, musicFile, tags } = validation.data;
    // 投稿を作成
    postId = await createPost({
      userId: user.id,
      title,
      content,
      musicFile,
      tagNames: tags,
    });
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: '投稿できませんでした',
    };
  }

  // TODO cacheの更新
  revalidateTag('post');
  redirect(`/posts/${postId}`);
}
