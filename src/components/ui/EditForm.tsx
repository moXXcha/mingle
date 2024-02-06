'use client';
import React, { useState } from 'react';
import { DisplayNameInput } from '../DisplayNameInput';
import { OverviewInput } from '../OverviewInput';
import { AvatarFileInput } from '../AvatarFileInput';

type Props = {
  userName: string;
  overview: string;
  avatarUrl: string;
};
export const EditForm = (props: Props) => {
  const [isValidationCheck, setIsValidationCheck] = useState<boolean>(true);
  return (
    <div>
      <div className="mb-9 flex justify-between">
        <AvatarFileInput avatarUrl={props.avatarUrl} />
        <button
          type="submit"
          className="block h-8 w-16 items-center justify-center rounded-md bg-[#646767] text-[12px] font-bold text-[#DDBFAE] disabled:opacity-25"
          disabled={!isValidationCheck}
        >
          Save
        </button>
      </div>
      <div className="mb-9">
        <DisplayNameInput
          userName={props.userName}
          isValidationCheck={isValidationCheck}
          setIsValidationCheck={setIsValidationCheck}
        />
      </div>
      <div>
        <OverviewInput
          overview={props.overview}
          isValidationCheck={isValidationCheck}
          setIsValidationCheck={setIsValidationCheck}
        />
      </div>
    </div>
  );
};
