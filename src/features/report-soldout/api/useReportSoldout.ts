"use client";

import { useMutation } from "@tanstack/react-query";
import { reportPostSoldout } from "@/shared/api";

export function useReportSoldoutMutation(postId: string) {
  return useMutation({
    mutationFn: () => reportPostSoldout(postId),
  });
}
