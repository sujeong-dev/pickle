"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getGroups, groupKeys, type GroupListParams } from "@/shared/api";

type FilterParams = Omit<GroupListParams, "cursor" | "limit">;

export function useGroups(filters: FilterParams = {}) {
  return useInfiniteQuery({
    queryKey: groupKeys.list(filters),
    queryFn: ({ pageParam }) =>
      getGroups({ ...filters, cursor: pageParam as string | undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor ?? undefined : undefined,
  });
}
