import React from 'react';
import profileImage from '../../../public/profImage.png';
import { Tag } from './Tag';

type Tag = {
  url: string,
  text: string
}

type Props = {
  musicName: string
  userName: string
  musicDescription: string
  tags: Tag[]
}

export const MusicCard = (props: Props) => {
  return (
    <div className="bg-[#E3DEDA] w-full h-44 rounded-xl pl-6 pt-5">
      <div className="flex">
        <div className="w-56">
          <p className="text-xl font-bold text-[#646767]">{props.musicName}</p>
          <p className="text-base font-bold text-[#646767] mb-3">{props.userName}</p>
          <p className="text-xs text-[#646767]">
            {props.musicDescription}
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
        {props.tags.map((tag: Tag) => (
          <Tag href={`${tag.url}`} text={`${tag.text}`} />
        ))}
      </div>
    </div>
  );
};
