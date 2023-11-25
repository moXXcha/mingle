import { CreatePost } from '@/types/types';
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

    // tagをselect or insertするのはどこ？

    /*
    ? 疑問点

    - musicFileをStorageにuploadするのはどこ？
    - tagsをselect or insertするのはどこ？
    新しいtagだった場合、insertする必要がある

    */

    // validation
    CreatePost.parse({
      userId: user.id,
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      musicFileUrl: formData.get('musicFileUrl') as string,
      tags: formData.getAll('tags') as string[],
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '不明なエラーが発生しました';
    return { message: errorMessage };
  }
}
