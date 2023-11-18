'use server';

import { createProfile } from '@/server/profile/profile-dto';
import 'server-only';

export async function profileFormAction(
  prevState: { message: string },
  formData: FormData,
): Promise<{ message: string }> {
  const displayName = formData.get('displayName') as string;
  const overview = formData.get('overview') as string;
  const avatar = formData.get('avatar') as Blob;

  console.log('displayName: ', displayName);
  console.log('overview: ', overview);
  console.log('avatar: ', avatar);

  // TODO validation

  try {
    await createProfile(displayName, overview, avatar);

    return { message: 'プロフィールを作成しました' };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '不明なエラーが発生しました';
    return { message: errorMessage };
  }
}
