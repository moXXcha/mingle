'use server';

import { getProfileByUserName } from '@/server/service/profile';
import Image from 'next/image';

type Props = {
  userName: string;
};

export const Profile = async (props: Props) => {
  // データ取得
  const profile = await getProfileByUserName(props.userName);
  return (
    <div>
      <div>表示名: {profile.displayName}</div>
      <div>概要: {profile.overview}</div>
      <Image
        src={profile.avatarUrl as string}
        alt="icon"
        width={200}
        height={200}
        priority={true}
      />
    </div>
  );
};
