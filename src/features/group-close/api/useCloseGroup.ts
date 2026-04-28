"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateGroupStatus, groupKeys } from "@/shared/api";

export function useCloseGroup(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => updateGroupStatus(groupId, { status: "done" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(groupId) });
      queryClient.invalidateQueries({ queryKey: groupKeys.list() });
    },
  });
}
