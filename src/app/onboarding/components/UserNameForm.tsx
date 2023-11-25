'use client';

import { useFormState } from 'react-dom';
import { userNameFormAction } from './userNameFormAction';

// TODO userNameFormAction.tsの型定義を参照したい 逆でも良い
const initialState = {
  message: '',
  isSuccess: false,
};

export default function UserNameForm() {
  const [state, formAction] = useFormState(userNameFormAction, initialState);

  // ? validation??

  return (
    <div>
      ユーザーネームを決めてください
      <form action={formAction}>
        <label htmlFor="userName">
          user name
          <input
            className="border"
            type="text"
            id="userName"
            name="userName"
            required
          />
        </label>
        <button type="submit">submit</button>
        <p>{state?.message}</p>
      </form>
    </div>
  );
}
