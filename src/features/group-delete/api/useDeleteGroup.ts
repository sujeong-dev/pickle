"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGroup, groupKeys } from "@/shared/api";

export function useDeleteGroup(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteGroup(groupId),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: groupKeys.detail(groupId) });
      queryClient.invalidateQueries({ queryKey: groupKeys.list() });
    },
  });
}
