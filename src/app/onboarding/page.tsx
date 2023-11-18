'use server';

import UserNameForm from './components/UserNameForm';

export default async function Home() {
  return <UserNameForm />;
  // return <ProfileForm />;
}
