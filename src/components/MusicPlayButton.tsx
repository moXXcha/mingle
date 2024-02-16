'use client';

import { PlayButton } from '@public/playButton';
import { StopButton } from '@public/stopButton';
import { useEffect, useState } from 'react';

type Props = {
  musicUrl: string | undefined;
  audioElement: React.RefObject<HTMLAudioElement>;
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
          props.audioElement.current?.pause();
        }
      } catch (error) {
        console.error('Playback error:', error);
      }
    };

    // handlePlayback関数を即時実行し、未処理のプロミスを適切に扱う
    handlePlayback().catch(console.error);
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
