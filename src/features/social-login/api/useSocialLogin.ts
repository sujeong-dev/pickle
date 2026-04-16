import { useMutation } from '@tanstack/react-query'
import { kakaoLogin, naverLogin } from '@/shared/api'
import { useTokenStore } from '@/shared/model'

export function useKakaoLogin() {
  const { setAccessToken, setRefreshToken } = useTokenStore()

  return useMutation({
    mutationFn: (code: string) => kakaoLogin({ code }),
    onSuccess: (data) => {
      setAccessToken(data.accessToken)
      setRefreshToken(data.refreshToken)
    },
  })
}

export function useNaverLogin() {
  const { setAccessToken, setRefreshToken } = useTokenStore()

  return useMutation({
    mutationFn: ({ code, state }: { code: string; state: string }) =>
      naverLogin({ code, state }),
    onSuccess: (data) => {
      setAccessToken(data.accessToken)
      setRefreshToken(data.refreshToken)
    },
  })
}
