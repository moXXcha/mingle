'use client';

import { PlayButton } from '@public/playButton';
import { StopButton } from '@public/stopButton';
import { useEffect, useState } from 'react';

type Props = {
  musicUrl: string | undefined;
  audioElement: React.RefObject<HTMLAudioElement>
};

export const MusicPlayButton = (props: Props) => {
  const [isPlay, setIsPlay] = useState<boolean>(false);

  const onClickFunc = () => {
    setIsPlay(!isPlay);
  };
  useEffect(() => {
    const handlePlayback = async () => {
      try {
        if (isPlay === true) {
          await props.audioElement.current?.play();
        } else {
          await props.audioElement.current?.pause();
        }
      } catch (error) {
        console.error('Playback error:', error);
      }
    };
  
    handlePlayback();
  }, [isPlay]);
  return (
    <div className="mt-6">
      {isPlay ? (
        <button
          onClick={() => {
            onClickFunc();
          }}
        >
          <StopButton />
        </button>
      ) : (
        <button
          onClick={() => {
            onClickFunc();
          }}
        >
          <PlayButton />
        </button>
      )}
    </div>
  );
};
