'use server';

type Props = {
  postId: string;
};

export const CommentList = (props: Props) => {
  // TODO: postIdを使って、コメント一覧を取得する
  return (
    <div>
      <div>コメント一覧</div>
      <div>{props.postId}</div>
    </div>
  );
};
