"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts, postKeys } from "@/shared/api";

export function usePosts(sort: 'latest' | 'most_liked' = 'most_liked') {
  return useInfiniteQuery({
    queryKey: postKeys.list(sort),
    queryFn: ({ pageParam }) => getPosts({ sort, cursor: pageParam as string | undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.hasNext ? lastPage.nextCursor ?? undefined : undefined,
  });
}
