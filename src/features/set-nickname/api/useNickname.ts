import { useQuery, useMutation } from '@tanstack/react-query'
import { checkNickname, signup, updateNickname } from '@/shared/api'

export const nicknameKeys = {
  all: ['nickname'] as const,
  check: (nickname: string) => [...nicknameKeys.all, 'check', nickname] as const,
}

export function useNicknameCheck(nickname: string) {
  return useQuery({
    queryKey: nicknameKeys.check(nickname),
    queryFn: () => checkNickname(nickname),
    enabled: nickname.length > 0,
  })
}

export function useSignup() {
  return useMutation({
    mutationFn: (nickname: string) => signup({ nickname }),
  })
}

export function useUpdateNickname() {
  return useMutation({
    mutationFn: (nickname: string) => updateNickname({ nickname }),
  })
}
