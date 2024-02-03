'use server';

import { updateProfile } from '@/server/profile';
import { formActionResult, updateProfileSchema } from '@/types/types';

export async function updateProfileFormAction(
  userName: string,
  _prevState: formActionResult,
  formData: FormData,
): Promise<formActionResult> {
  // validation
  const validation = updateProfileSchema.safeParse({
    userName: userName,
    displayName: formData.get('displayName'),
    overview: formData.get('overview'),
    avatarFile: formData.get('avatarFile'),
  });

  if (!validation.success) {
    console.log(validation.error);
    return {
      success: false,
      message: 'プロフィールを更新できませんでした',
    };
  }

  // プロフィールを更新する
  await updateProfile({
    userName: validation.data.userName,
    displayName: validation.data.displayName,
    overview: validation.data.overview,
    avatarFile: validation.data.avatarFile,
  });

  return {
    success: true,
    message: 'プロフィールを更新しました',
  };
}
