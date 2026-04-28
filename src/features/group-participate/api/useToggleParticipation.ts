"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateGroupParticipation,
  groupKeys,
  type UpdateParticipationResponse,
} from "@/shared/api";
import type { GroupDetail } from "@/entities/group";

type Variables = { groupId: string; participate: boolean };

export function useToggleParticipation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, participate }: Variables) =>
      updateGroupParticipation(groupId, { participate }),
    onMutate: async ({ groupId, participate }) => {
      await queryClient.cancelQueries({ queryKey: groupKeys.detail(groupId) });
      const prev = queryClient.getQueryData<GroupDetail>(groupKeys.detail(groupId));
      if (prev) {
        queryClient.setQueryData<GroupDetail>(groupKeys.detail(groupId), {
          ...prev,
          isParticipating: participate,
          currentCount: Math.max(
            1,
            prev.currentCount + (participate ? 1 : -1),
          ),
        });
      }
      return { prev };
    },
    onError: (_err, vars, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(groupKeys.detail(vars.groupId), ctx.prev);
      }
    },
    onSuccess: (data: UpdateParticipationResponse, vars) => {
      const cached = queryClient.getQueryData<GroupDetail>(groupKeys.detail(vars.groupId));
      if (cached) {
        queryClient.setQueryData<GroupDetail>(groupKeys.detail(vars.groupId), {
          ...cached,
          status: data.status,
          targetCount: data.targetCount,
          currentCount: data.currentCount,
          isParticipating: data.isParticipating,
        });
      }
      queryClient.invalidateQueries({ queryKey: groupKeys.list() });
    },
  });
}
