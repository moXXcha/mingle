'use client';

import { useState } from 'react';
import { validationEmail } from '@/types/types';

type Props = {
  userName: string;
  isValidationCheck: boolean;
  setIsValidationCheck: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DisplayNameInput = (props: Props) => {
  const [userName, setUserName] = useState<string>(props.userName);
  console.log('userName: ', userName);

  const validation = (name: string) => {
    try {
      validationEmail.parse(name);
      props.setIsValidationCheck(true)
    } catch {
      alert('nameの文字数が多すぎます。20文字以内で入力してください');
      props.setIsValidationCheck(false);
    }
  };
  // TODO バリデーション
  return (
    <div>
      <label htmlFor="displayName">
        <p className="text-xs text-[#646767] opacity-50">Name</p>
        <input
          className="h-9 w-full rounded-md border border-[#6E96A5] px-2 py-2 text-[#646767] focus:outline-none"
          type="text"
          name="displayName"
          id="displayName"
          required
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value);
            validation(e.target.value);
          }}
        />
      </label>
    </div>
  );
};
