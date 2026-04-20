"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts, postKeys } from "@/shared/api";

export function usePosts() {
  return useInfiniteQuery({
    queryKey: postKeys.list(),
    queryFn: ({ pageParam }) => getPosts({ cursor: pageParam as string | undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.hasNext ? lastPage.nextCursor ?? undefined : undefined,
  });
}
