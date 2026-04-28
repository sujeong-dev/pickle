"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroup, groupKeys, type CreateGroupBody } from "@/shared/api";

export function useCreateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateGroupBody) => createGroup(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.all });
    },
  });
}
