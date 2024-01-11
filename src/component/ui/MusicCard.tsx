import React from 'react';
import profileImage from '../../../public/profImage.png';
import { Tag } from './Tag';

export const MusicCard = () => {
  return (
    <div className="bg-[#E3DEDA] w-11/12 h-44 rounded-xl pl-6 pt-5">
      <div className="flex">
        <div className="w-56">
          <p className="text-xl font-bold text-[#646767]">RatPark</p>
          <p className="text-base font-bold text-[#646767] mb-3">mocha</p>
          <p className="text-xs text-[#646767]">
            概要概要概要概要概要概要概要概要概要概要概要概要概要概要概要概要概要概要概要概要概要概要概要概要
          </p>
        </div>
        <div>
          <img
            src={profileImage.src}
            className="block w-20 h-20 rounded-full ml-4"
          />
        </div>
      </div>
      <div className="mt-2 space-x-3">
        <Tag href="/test" text="rock" />
        <Tag href="/test" text="rock" />
        <Tag href="/test" text="rock" />
        <Tag href="/test" text="rock" />
        <Tag href="/test" text="rock" />
      </div>
    </div>
  );
};
