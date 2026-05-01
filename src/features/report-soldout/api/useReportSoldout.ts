"use client";

import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { reportPostSoldout, postKeys } from "@/shared/api";
import type { PostListResponse } from "@/shared/api/product";
import type { Post } from "@/entities/post";

export function useReportSoldoutMutation(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => reportPostSoldout(postId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });

      queryClient.setQueriesData<InfiniteData<PostListResponse>>(
        { queryKey: postKeys.lists() },
        (old) => {
          if (!old?.pages) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((p: Post) =>
                p.id === postId ? { ...p, soldOutStatus: data.soldOutStatus } : p,
              ),
            })),
          };
        },
      );
    },
  });
}
