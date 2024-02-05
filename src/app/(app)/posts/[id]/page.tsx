import { Comments } from '@/components/Comments';
import { MusicPlayerSection } from '@/components/MusicPlayerSection';
import { Search } from '@/components/ui/Search';
import Loader from '@/components/ui/Loader';
import { Suspense } from 'react';

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <div className="mx-auto w-11/12">
      <div className="my-6 ml-auto w-fit">
        <Search />
      </div>
      <div>
        <Suspense fallback={<Loader />}>
          <MusicPlayerSection postId={id} />
        </Suspense>

        <Suspense fallback={<div></div>}>
          <Comments postId={id} />
        </Suspense>
      </div>
    </div>
  );
}
