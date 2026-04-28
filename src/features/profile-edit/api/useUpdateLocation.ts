import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateMyLocation, type UpdateLocationBody } from '@/shared/api'
import { profileKeys } from './useProfile'

export function useUpdateLocation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdateLocationBody) => updateMyLocation(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.me() })
    },
  })
}
