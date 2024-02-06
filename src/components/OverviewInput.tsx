'use client';

import { useState } from 'react';
import { validationOverView } from '@/types/types';

type Props = {
  overview: string;
  isValidationCheck: boolean;
  setIsValidationCheck: React.Dispatch<React.SetStateAction<boolean>>;
};

export const OverviewInput = (props: Props) => {
  const [overview, setOverview] = useState<string>(props.overview);
  const validation = (name: string) => {
    try {
      validationOverView.parse(name);
      props.setIsValidationCheck(true)
    } catch {
      alert('descriptionの文字数が多すぎます。100文字以内で入力してください');
      props.setIsValidationCheck(false);
    }
  };
  return (
    <label htmlFor="overview">
      <p className="text-xs text-[#646767] opacity-50">Description</p>
      <textarea
        className="border border-[#6E96A5] rounded-md h-32 w-full px-2 py-2 focus:outline-none text-[#646767]"
        name="overview"
        id="overview"
        required
        value={overview}
        onChange={(e) => {
          setOverview(e.target.value)
          validation(e.target.value)
        }}
      />
    </label>
  );
};
