import React from 'react';
import profileImage from '../../../public/profImage.png';
import { Header } from '@/components/ui/Header';
import Follow from './follow';
import { MusicCard } from '@/components/ui/MusicCard';
const page = () => {
  const tagsTest = [
    {
      text: 'tag',
      url: '/test',
    },
  ];
  return (
    <div>
      <Header />
      <div>
        <div className="mt-10 flex">
          <img
            src={profileImage.src}
            className="block w-20 h-20 rounded-full ml-4"
          />
          <Follow />
        </div>
        {/* username */}
        <p className="text-xl font-bold text-[#646767]">username</p>
        {/* bio */}
        <p className="text-xs text-[#646767]">bio</p>
        {/* follow */}
        <MusicCard
          musicName="aaa"
          userName="aaa"
          musicDescription="aaa"
          tags={tagsTest}
        />
      </div>
    </div>
  );
};

export default page;
