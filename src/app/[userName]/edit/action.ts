'use server';

import { editProfile } from '@/server/service/profile';
import { redirect } from 'next/navigation';
import 'server-only';

// eslint-disable-next-line @typescript-eslint/require-await
export async function updatePostFormAction(
  userName: string,
  formData: FormData,
): Promise<void> {
  const displayName = formData.get('displayName') as string;
  const overview = formData.get('overview') as string;
  const avatarFile = formData.get('avatarFile') as File;
  console.log('avatarFile: ', avatarFile);

  /*
  avatarFileがない場合は、更新しないということにする
  */

  // TODO validation
  const result = await editProfile({
    displayName,
    overview,
    avatar: avatarFile,
  });
  if (result.isFailure()) {
    // TODO 失敗した場合はどうする？
    console.log('Failed to edit profile');
    console.log(result.value);

    redirect(`/${userName}/edit`);
  }

  console.log('Success to edit profile');

  redirect(`/${userName}`);
}
