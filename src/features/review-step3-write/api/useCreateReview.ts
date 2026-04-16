import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createReview, updateReview, deleteReview } from '@/shared/api/receipt'
import type { CreateReviewBody, UpdateReviewBody } from '@/shared/api/receipt'
import type { Review } from '@/entities/review'

export const reviewKeys = {
  all: ['reviews'] as const,
  list: () => [...reviewKeys.all, 'list'] as const,
  detail: (id: string) => [...reviewKeys.all, 'detail', id] as const,
}

export function useCreateReview() {
  const queryClient = useQueryClient()
  return useMutation<Review, Error, CreateReviewBody>({
    mutationFn: (body: CreateReviewBody) => createReview(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.list() })
    },
  })
}

export function useUpdateReview() {
  const queryClient = useQueryClient()
  return useMutation<Review, Error, { id: string; body: UpdateReviewBody }>({
    mutationFn: ({ id, body }) => updateReview(id, body),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.list() })
      queryClient.invalidateQueries({ queryKey: reviewKeys.detail(id) })
    },
  })
}

export function useDeleteReview() {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (id: string) => deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.list() })
    },
  })
}
