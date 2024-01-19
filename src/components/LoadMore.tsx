/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';

import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

type LoadMoreAction = (
  offset: number,
) => Promise<
  readonly [JSX.Element[], number | null] | readonly [readonly [], null]
>;

export const LoadMore = ({
  children,
  initialOffset,
  loadMoreAction,
}: PropsWithChildren<{
  initialOffset: number;
  loadMoreAction: LoadMoreAction;
}>) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [loadMoreNodes, setLoadMoreNodes] = useState<JSX.Element[]>([]);
  const [loading, setLoading] = useState(false);
  const [allDataLoaded, setAllDataLoaded] = useState(false);

  // 現在のオフセット
  const currentOffsetRef = useRef<number | undefined>(initialOffset);

  // 新しいデータを取得する関数
  const loadMore = useCallback(
    // eslint-disable-next-line @typescript-eslint/require-await
    async (abortController?: AbortController) => {
      setLoading(true);

      // eslint-disable-next-line @typescript-eslint/require-await
      setTimeout(async () => {
        // 重複データの取得を防ぐためのチェック
        if (currentOffsetRef.current === undefined) {
          setLoading(false);
          return;
        }

        loadMoreAction(currentOffsetRef.current)
          .then(([node, next]) => {
            // リクエストが中断された場合は早期リターン
            if (abortController?.signal.aborted) return;

            // 全てのデータを取得したかどうかのチェック
            // ? 10とは何の数字？
            if (node.length < 10) {
              setAllDataLoaded(true);
            }

            // 新しいデータを追加する
            setLoadMoreNodes((prev) => [...prev, ...node]);
            if (next === null) {
              currentOffsetRef.current = undefined;
              return;
            }

            currentOffsetRef.current = next;
          })
          .catch((e) => {
            console.log(e);
          })
          .finally(() => setLoading(false));
      }, 800);
    },
    [loadMoreAction],
  );

  useEffect(() => {
    // オブザーバーを使用して、スピナーが表示されたときに新しいデータを取得する
    const abortController = new AbortController();

    const element = ref.current;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && element?.disabled === false) {
        void loadMore(abortController);
      }
    });

    if (element) {
      observer.observe(element);
    }

    return () => {
      abortController.abort();
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [loadMore]);

  return (
    <>
      <ul className="">
        {children}
        {loadMoreNodes}
      </ul>
      {!allDataLoaded && (
        <button className="" ref={ref}>
          {loading && <div className="animate-spin w-5 h-5 mr-3" />}
        </button>
      )}
    </>
  );
};
