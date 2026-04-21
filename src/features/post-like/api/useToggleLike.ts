"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { togglePostLike, postKeys } from "@/shared/api";

export function useToggleLike(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => togglePostLike(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
    },
  });
}
