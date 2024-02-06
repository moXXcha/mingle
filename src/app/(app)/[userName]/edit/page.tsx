/* eslint-disable @typescript-eslint/no-misused-promises */

import { updatePostFormAction } from '@/actions/updatePostFormAction';
import { AvatarFileInput } from '@/components/AvatarFileInput';
import { DisplayNameInput } from '@/components/DisplayNameInput';
import { OverviewInput } from '@/components/OverviewInput';
import { EditForm } from '@/components/ui/EditForm';
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
    <div className="mx-auto w-11/12">
      <p className="mb-8 mt-5 font-bold text-[#646767]">edit user</p>

      <form action={updatePostFormActionWithUserName}>
        <EditForm userName={profile.displayName} overview={profile.overview} avatarUrl={profile.avatarUrl} />
      </form>
      {/* <Link href={`/${userName}`}>戻る</Link> */}
    </div>
  );
}
