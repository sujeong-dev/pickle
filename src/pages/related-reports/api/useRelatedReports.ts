"use client";

import { useQuery } from "@tanstack/react-query";
import { getRelatedPosts } from "@/shared/api";

export const relatedReportKeys = {
  all: ['related-reports'] as const,
  byProduct: (productId: string) => [...relatedReportKeys.all, productId] as const,
};

export function useRelatedReports(productId: string) {
  return useQuery({
    queryKey: relatedReportKeys.byProduct(productId),
    queryFn: () => getRelatedPosts(productId),
    enabled: Boolean(productId),
  });
}
