import { StaticImageData } from 'next/image';
import Image from 'next/image';
import React from 'react';
import { FollowButton } from '../FollowButton';

type Props = {
  src: StaticImageData;
};

export const FollowedUserCard = (props: Props) => {
  return (
    <div className="h-32 w-full rounded-xl bg-[#E3DEDA] px-4 py-4 mb-6">
      <div>
        <div className="flex items-center">
          <Image
            src={props.src}
            width={100}
            height={100}
            alt=""
            className="h-11 w-11 rounded-full"
          />
          <p className="ml-3 text-xl font-bold text-[#646767]">chacha</p>
          <button className="h-8 w-20 rounded-md bg-[#9AAAA9] text-[#E3DEDA] ml-auto">
            follow
          </button>
        </div>
        <p className="text-xs text-[#646767] mt-2">概要概要概要概要概要概要概要概要概要概要概要概要概要概要概要概要概要概...</p>
      </div>
    </div>
  );
};
