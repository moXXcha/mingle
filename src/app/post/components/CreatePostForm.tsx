'use client';

import { State } from '@/types/types';
import { useFormState } from 'react-dom';
import { SubmitButton } from '../../../components/SubmitButton';
import { createPostFormAction } from '../action';

const initialState: State = {
  message: null,
};

export const CreatePostForm = () => {
  const [state, formAction] = useFormState(createPostFormAction, initialState);

  return (
    <div>
      <div className="text-green-500">{state.message}</div>
      <form action={formAction}>
        <label htmlFor="title">
          タイトル
          <input
            className="border"
            type="text"
            id="title"
            name="title"
            required
          />
        </label>
        <label htmlFor="musicFile">
          音声ファイル
          <input
            type="file"
            accept=".mp3"
            id="musicFile"
            name="musicFile"
            required
          />
        </label>
        <label htmlFor="tags">
          タグ
          <input
            className="border"
            type="text"
            id="tags"
            name="tags"
            required
          />
        </label>
        <label htmlFor="content">
          概要
          <textarea
            className="border"
            name="content"
            id="content"
            cols={30}
            rows={10}
            required
          ></textarea>
        </label>

        <SubmitButton />
      </form>
    </div>
  );
};
