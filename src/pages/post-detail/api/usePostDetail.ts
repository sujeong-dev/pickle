"use client";

import { useQuery } from "@tanstack/react-query";
import { getPostDetail, getPostComments, postKeys } from "@/shared/api";

export function usePostDetail(id: string) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => getPostDetail(id),
    enabled: Boolean(id),
  });
}

export function usePostComments(postId: string) {
  return useQuery({
    queryKey: postKeys.comments(postId),
    queryFn: () => getPostComments(postId),
    enabled: Boolean(postId),
  });
}
