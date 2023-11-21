'use client';

type Props = {
  type: 'posts' | 'likes';
  userName: string;
};

// eslint-disable-next-line @typescript-eslint/require-await
export const MusicCardList = (props: Props) => {
  // const data = [];
  // // TODO データ取得
  // switch (props.type) {
  //   case 'posts':
  //     // 自分の投稿を取得
  //     // ? 'use client'だからasync/awaitできない
  //     // useEffectする？
  //     data = await getPostsByUserName(props.userName);
  //     break;
  //   case 'likes':
  //     // 自分がいいねした投稿を取得
  //     // data = await getLikesByUserName(props.userName);
  //     break;
  //   default:
  //     break;
  // }

  return (
    <div>
      <div>{props.type}!!!!!</div>
    </div>
  );
};
