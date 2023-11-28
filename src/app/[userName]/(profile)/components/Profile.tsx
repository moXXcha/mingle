'use server';

import { getProfileByUserName } from '@/server/service/profile';
import Image from 'next/image';

type Props = {
  userName: string;
};

export const Profile = async (props: Props) => {
  // データ取得
  const profileResult = await getProfileByUserName(props.userName);
  if (profileResult.isFailure()) {
    return <div>プロフィールがありません</div>;
  }
  return (
    <div>
      <div>表示名: {profileResult.value.displayName}</div>
      <div>概要: {profileResult.value.overview}</div>
      <Image
        src={profileResult.value.avatarUrl}
        alt="icon"
        width={200}
        height={200}
        priority={true}
      />
    </div>
  );
};
