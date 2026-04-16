"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { togglePostBookmark, postKeys } from "@/shared/api";

export function useToggleBookmark(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => togglePostBookmark(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
    },
  });
}
