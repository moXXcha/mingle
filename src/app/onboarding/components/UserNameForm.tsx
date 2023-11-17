'use client';

import { useFormState } from 'react-dom';
import { userNameFormAction } from './userNameFormAction';

const initialState = {
  message: '',
};

export default function UserNameForm() {
  const [state, formAction] = useFormState(userNameFormAction, initialState);

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
