/* eslint-disable @typescript-eslint/no-misused-promises */
'use server';

import { getProfileByUserName } from '@/server/service/profile';
import Link from 'next/link';
import { updatePostFormAction } from './action';
import { AvatarFileInput } from './components/AvatarFileInput';
import { DisplayNameInput } from './components/DisplayNameInput';
import { OverviewInput } from './components/OverviewInput';

export default async function Page({
  params,
}: {
  params: { userName: string };
}) {
  const { userName } = params;

  // TODO 自分のプロフィールを取得
  const profileResult = await getProfileByUserName(userName);
  if (profileResult.isFailure()) {
    // エラー
    // TODO エラーページとかに飛ばす
    return <div>プロフィールがありません</div>;
  }

  console.log('profileResult: ', profileResult.value);

  const updatePostFormActionWithUserName = updatePostFormAction.bind(
    null,
    userName,
  );

  return (
    <div>
      <div>プロフィール編集</div>

      <form action={updatePostFormActionWithUserName}>
        <DisplayNameInput userName={profileResult.value.displayName} />
        <OverviewInput overview={profileResult.value.overview} />
        <AvatarFileInput avatarUrl={profileResult.value.avatarUrl} />

        <button type="submit">更新</button>
      </form>
      <Link href={`/${userName}`}>戻る</Link>
    </div>
  );
}
