import { useMutation } from '@tanstack/react-query'
import { kakaoLogin, naverLogin } from '@/shared/api'

export function useKakaoLogin() {
  return useMutation({
    mutationFn: (code: string) => kakaoLogin({ code }),
  })
}

export function useNaverLogin() {
  return useMutation({
    mutationFn: ({ code, state }: { code: string; state: string }) =>
      naverLogin({ code, state }),
  })
}
