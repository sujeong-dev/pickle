import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getPresignedUrl,
  updateMyProfileImage,
  type UpdateProfileImageResponse,
} from '@/shared/api'
import { profileKeys } from './useProfile'

export function useUpdateProfileImage() {
  const queryClient = useQueryClient()

  return useMutation<UpdateProfileImageResponse, Error, File>({
    mutationFn: async (file: File) => {
      const { uploadUrl, r2Key } = await getPresignedUrl({
        fileType: file.type,
        purpose: 'profile',
      })
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      })
      if (!uploadRes.ok) {
        throw new Error('프로필 사진 업로드에 실패했어요.')
      }
      return updateMyProfileImage({ r2Key })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.me() })
    },
  })
}
