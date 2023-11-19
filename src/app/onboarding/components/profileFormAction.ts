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

  // const cookieStore = cookies();
  // const supabase = createAdminAuthClient(cookieStore);

  // const { data, error: getSessionError } = await supabase.auth.getSession();

  // if (getSessionError) {
  //   throw new Error(getSessionError.message);
  // }
  // TODO validation

  try {
    await createProfile(displayName, overview, avatar);

    // // profileを作成したFlagをtrueにする
    // const { error } = await supabase.auth.admin.updateUserById(
    //   data.session?.user.id as string,
    //   {
    //     user_metadata: {
    //       hasProfile: true,
    //     },
    //   },
    // );

    // if (error) {
    //   throw new Error(error.message);
    // }

    return { message: 'プロフィールを作成しました' };
    /*
    ? プロフィールを作成した時点で、userName, Profileは作成されている
    ここで、/にredirectしても良いのでは？
    clientにプロフィールが作成されたことを通知して、ユーザーのアクション後にredirectしたい

    */
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '不明なエラーが発生しました';
    return { message: errorMessage };
  }
}
