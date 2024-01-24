import { Profile } from '../../../components/Profile';
import { ProfileTab } from '../../../components/ProfileTab';

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { userName: string };
}) {
  return (
    <div>
      <Profile userName={params.userName} />
      <ProfileTab userName={params.userName} />
      <div>{children}</div>
    </div>
  );
}
