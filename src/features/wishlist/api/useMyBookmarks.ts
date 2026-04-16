import { useQuery } from '@tanstack/react-query'
import { getMyBookmarks } from '@/shared/api'
import type { PaginationParams } from '@/shared/api'

export const myBookmarkKeys = {
  all: ['myBookmarks'] as const,
  list: (params?: PaginationParams) => [...myBookmarkKeys.all, 'list', params] as const,
}

export function useMyBookmarks(params?: PaginationParams) {
  return useQuery({
    queryKey: myBookmarkKeys.list(params),
    queryFn: () => getMyBookmarks(params),
  })
}
