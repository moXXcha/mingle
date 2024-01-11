import Link from 'next/link';

type Props = {
  userName: string;
};

export const ProfileTab = (props: Props) => {
  return (
    <div className="w-1/2 flex">
      <Link href={`/${props.userName}`} className="mx-8">
        Posts
      </Link>
      <br />
      <Link href={`/${props.userName}/likes`} className="mx-8">
        Likes
      </Link>
    </div>
  );
};
