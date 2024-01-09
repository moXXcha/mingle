'use server';

import { createAvatarRepository } from '@/server/repository/avatar';
import { createProfileRepository } from '@/server/repository/profile';
import { createUserRepository } from '@/server/repository/user';
import { createProfileService } from '@/server/service/profile';
import Image from 'next/image';

type Props = {
  userName: string;
};

export const Profile = async (props: Props) => {
  const profileService = createProfileService(
    createAvatarRepository(),
    createProfileRepository(),
    createUserRepository(),
  );
  // データ取得
  const profileResult = await profileService.getProfileByUserName(
    props.userName,
  );
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
