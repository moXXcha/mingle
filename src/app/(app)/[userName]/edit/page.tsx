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
    <div className="mx-auto w-11/12">
      <p className="mb-8 mt-5 font-bold text-[#646767]">edit user</p>

      <form action={updatePostFormActionWithUserName}>
        <div className="mb-9 flex justify-between">
          <AvatarFileInput avatarUrl={profile.avatarUrl} />
          <button
            type="submit"
            className="block h-8 w-16 items-center justify-center rounded-md bg-[#646767] text-[12px] font-bold text-[#DDBFAE]"
          >
            Save
          </button>
        </div>
        <div className="mb-9">
          <DisplayNameInput userName={profile.displayName} />
        </div>
        <div>
          <OverviewInput overview={profile.overview} />
        </div>
      </form>
      {/* <Link href={`/${userName}`}>戻る</Link> */}
    </div>
  );
}
