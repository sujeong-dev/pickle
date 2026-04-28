"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateGroup, groupKeys, type UpdateGroupBody } from "@/shared/api";

export function useUpdateGroup(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateGroupBody) => updateGroup(groupId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.all });
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(groupId) });
    },
  });
}
