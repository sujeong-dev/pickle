"use client";

import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { togglePostLike, postKeys } from "@/shared/api";
import type { PostListResponse } from "@/shared/api/product";
import type { PostDetail, Post } from "@/entities/post";

export function useToggleLike(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => togglePostLike(postId),
    onSuccess: (data) => {
      queryClient.setQueryData<PostDetail>(postKeys.detail(postId), (old) =>
        old
          ? {
              ...old,
              isLiked: data.isLiked,
              likeCount:
                data.likeCount ??
                (data.isLiked ? old.likeCount + 1 : Math.max(0, old.likeCount - 1)),
            }
          : old,
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
                p.id === postId
                  ? {
                      ...p,
                      isLiked: data.isLiked,
                      likeCount:
                        data.likeCount ??
                        (data.isLiked
                          ? p.likeCount + 1
                          : Math.max(0, p.likeCount - 1)),
                    }
                  : p,
              ),
            })),
          };
        },
      );
    },
  });
}
