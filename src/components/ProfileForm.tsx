'use client';

import { formActionResult } from '@/types/types';
import { useFormState } from 'react-dom';

type Props = {
  formAction: (
    _prevState: {
      message: string;
    },
    formData: FormData,
  ) => Promise<formActionResult>;
};

const initialState: formActionResult = {
  success: false,
  message: '',
};

export function ProfileForm(props: Props) {
  const [state, formAction] = useFormState(props.formAction, initialState);

  return (
    <div>
      <form action={formAction}>
        <label htmlFor="displayName">
          表示名
          <input
            className="border"
            type="text"
            id="displayName"
            name="displayName"
            required
          />
        </label>
        <label htmlFor="overview">
          概要
          <input className="border" type="text" id="overview" name="overview" />
        </label>
        <label htmlFor="avatar">
          <input type="file" id="avatar" name="avatar" />
        </label>
        <button type="submit">submit</button>
      </form>
      {state.success ? (
        <div className="text-green-500">投稿に成功しました</div>
      ) : (
        <div className="text-red-500">{state.message}</div>
      )}
    </div>
  );
}
