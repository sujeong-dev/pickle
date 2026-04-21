"use client";

import { useQuery } from "@tanstack/react-query";
import { getPosts } from "@/shared/api";
import type { PostListParams } from "@/shared/api";

type RelatedParams = Pick<PostListParams, 'branch' | 'productCode'>;

const relatedReportKeys = {
  byParams: (params: RelatedParams) =>
    ['post', 'related', params.branch ?? '', params.productCode ?? ''] as const,
};

export function useRelatedReports(params: RelatedParams) {
  return useQuery({
    queryKey: relatedReportKeys.byParams(params),
    queryFn: () => getPosts(params),
    enabled: Boolean(params.branch || params.productCode),
  });
}
