import { FollowedUserCard } from '@/components/ui/FollowedUserCard';
import profileImage from '../../../../../public/profImage.png';
import React from 'react';

const page = () => {
  return (
    <div className="mx-auto w-11/12">
      <p className="mb-8 mt-5 font-bold text-[#646767]">followed</p>
      <FollowedUserCard src={profileImage} />
      <FollowedUserCard src={profileImage} />
      <FollowedUserCard src={profileImage} />
      <FollowedUserCard src={profileImage} />
      <FollowedUserCard src={profileImage} />
      <FollowedUserCard src={profileImage} />
      <FollowedUserCard src={profileImage} />
      <FollowedUserCard src={profileImage} />
    </div>
  );
};

export default page;
