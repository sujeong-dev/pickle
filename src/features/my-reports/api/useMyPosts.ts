import { useQuery } from '@tanstack/react-query'
import { getMyPosts } from '@/shared/api'
import type { PaginationParams } from '@/shared/api'

export const myPostKeys = {
  all: ['myPosts'] as const,
  list: (params?: PaginationParams) => [...myPostKeys.all, 'list', params] as const,
}

export function useMyPosts(params?: PaginationParams) {
  return useQuery({
    queryKey: myPostKeys.list(params),
    queryFn: () => getMyPosts(params),
  })
}
