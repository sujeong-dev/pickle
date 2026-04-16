import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost, postKeys } from '@/shared/api'
import type { CreatePostBody } from '@/shared/api/report'

export function useCreateReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreatePostBody) => createPost(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.list() })
    },
  })
}
