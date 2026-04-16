import { useQuery } from '@tanstack/react-query'
import { getMyReviews } from '@/shared/api'
import type { PaginationParams } from '@/shared/api'

export const myReviewKeys = {
  all: ['myReviews'] as const,
  list: (params?: PaginationParams) => [...myReviewKeys.all, 'list', params] as const,
}

export function useMyReviews(params?: PaginationParams) {
  return useQuery({
    queryKey: myReviewKeys.list(params),
    queryFn: () => getMyReviews(params),
  })
}
