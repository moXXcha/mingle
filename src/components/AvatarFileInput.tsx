'use client';

import { Camera } from '@public/camera';
import Image from 'next/image';
import { useState } from 'react';

type Props = {
  avatarUrl: string;
};

export const AvatarFileInput = (props: Props) => {
  const [avatarFile, setAvatarFile] = useState<File>();
  console.log('avatarFile: ', avatarFile);

  // TODO uploadした画像のプレビューを表示する
  // TODO 既存の画像を保持しておく
  return (
    <div>
      <label htmlFor="avatarFile" className="flex items-center justify-center fixed w-20 h-20 rounded-full bg-[#646767] opacity-60">
        <Camera />
      </label>
      <Image
        src={props.avatarUrl}
        alt="Current Avatar"
        width="100"
        height="100"
        className="h-20 w-20 rounded-full"
      />
      <input
        className="hidden"
        type="file"
        name="avatarFile"
        id="avatarFile"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files) {
            setAvatarFile(e.target.files[0]);
          }
        }}
      />
    </div>
  );
};
