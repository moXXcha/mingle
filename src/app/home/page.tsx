import React from 'react';
import { Header } from '@/components/ui/Header';
import { MusicCard } from '@/components/ui/MusicCard';

const page = () => {
  const tagsTest = [
    {
      text: 'tag',
      url: '/test',
    },
  ];
  return (
    <>
      <Header />
      {/* musicCardの数だけMusicCardを表示する */}
      <div className='space-y-4 m-auto'>
        {[...Array(10)].map((_, i) => {
          return (
            <MusicCard
              key={i}
              musicName="aaa"
              userName="aaaa"
              musicDescription="aaaa"
              tags={tagsTest}
            />
          );
        })}
      </div>
    </>
  );
};

export default page;
