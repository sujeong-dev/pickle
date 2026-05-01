"use client";

import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { togglePostBookmark, postKeys } from "@/shared/api";
import type { PostListResponse } from "@/shared/api/product";
import type { PostDetail, Post } from "@/entities/post";

export function useToggleBookmark(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => togglePostBookmark(postId),
    onSuccess: (data) => {
      queryClient.setQueryData<PostDetail>(postKeys.detail(postId), (old) =>
        old ? { ...old, isBookmarked: data.isBookmarked } : old,
      );

      queryClient.setQueriesData<InfiniteData<PostListResponse>>(
        { queryKey: postKeys.lists() },
        (old) => {
          if (!old?.pages) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((p: Post) =>
                p.id === postId ? { ...p, isBookmarked: data.isBookmarked } : p,
              ),
            })),
          };
        },
      );
    },
  });
}
