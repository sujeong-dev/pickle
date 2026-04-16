"use client";

import { useQuery } from "@tanstack/react-query";
import { getPosts, postKeys } from "@/shared/api";
import type { PostListParams } from "@/shared/api";

export function usePosts(params?: PostListParams) {
  return useQuery({
    queryKey: postKeys.list(),
    queryFn: () => getPosts(params),
  });
}
