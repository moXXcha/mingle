/* eslint-disable @typescript-eslint/no-misused-promises */

import { updatePostFormAction } from '@/actions/updatePostFormAction';
import { AvatarFileInput } from '@/components/AvatarFileInput';
import { DisplayNameInput } from '@/components/DisplayNameInput';
import { OverviewInput } from '@/components/OverviewInput';
import { getProfileByUserName } from '@/server/profile';
import Link from 'next/link';

export default async function Page({
  params,
}: {
  params: { userName: string };
}) {
  const { userName } = params;

  // 自分のプロフィールを取得
  const profile = await getProfileByUserName(userName);
  // TODO エラーを投げられたらエラーページに飛ばす

  const updatePostFormActionWithUserName = updatePostFormAction.bind(
    null,
    userName,
  );

  return (
    <div>
      <div>プロフィール編集</div>

      <form action={updatePostFormActionWithUserName}>
        <DisplayNameInput userName={profile.displayName} />
        <OverviewInput overview={profile.overview} />
        <AvatarFileInput avatarUrl={profile.avatarUrl} />

        <button type="submit">更新</button>
      </form>
      <Link href={`/${userName}`}>戻る</Link>
    </div>
  );
}
