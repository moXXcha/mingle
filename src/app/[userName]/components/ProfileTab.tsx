import Link from 'next/link';

type Props = {
  userName: string;
};

const ProfileTab = (props: Props) => {
  return (
    <div>
      <Link href={`/${props.userName}`}>Posts</Link>
      <br />
      <Link href={`/${props.userName}/likes`}>Likes</Link>
    </div>
  );
};

export default ProfileTab;
