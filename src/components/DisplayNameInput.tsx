'use client';

import { useState } from 'react';

type Props = {
  userName: string;
};

export const DisplayNameInput = (props: Props) => {
  const [userName, setUserName] = useState<string>(props.userName);
  console.log('userName: ', userName);
  // TODO バリデーション
  return (
    <div>
      <label htmlFor="displayName">
        <p className="text-xs text-[#646767] opacity-50">Name</p>
        <input
          className="border border-[#6E96A5] rounded-md h-9 w-full px-2 py-2"
          type="text"
          name="displayName"
          id="displayName"
          required
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </label>
    </div>
  );
};
