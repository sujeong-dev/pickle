import ky, { isHTTPError } from 'ky'
import { getAccessToken, getRefreshToken, setAccessToken, clearTokens } from '@/shared/model/tokenStore'
import { useToastStore } from '@/shared/model/toastStore'

export const api = ky.create({
  prefix: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const token = getAccessToken()
        if (token) request.headers.set('Authorization', `Bearer ${token}`)
      },
    ],
    afterResponse: [
      async ({ request, response, retryCount }) => {
        if (response.status !== 401 || retryCount > 0) return response
        try {
          const refreshed = await ky.post('auth/refresh', {
            prefix: process.env.NEXT_PUBLIC_API_URL,
            json: { refreshToken: getRefreshToken() },
          }).json<{ accessToken: string }>()
          setAccessToken(refreshed.accessToken)
          const headers = new Headers(request.headers)
          headers.set('Authorization', `Bearer ${refreshed.accessToken}`)
          return ky(new Request(request, { headers }))
        } catch {
          clearTokens()
          window.location.href = '/login'
          return response
        }
      },
    ],
    beforeError: [
      async ({ error }) => {
        if (!isHTTPError(error)) return error
        const status = error.response.status
        const body = error.data as { message?: string } | undefined
        if (status >= 400 && status < 500) {
          useToastStore.getState().show(body?.message ?? '요청에 실패했어요.')
          if (status === 403) window.location.href = '/'
        }
        if (status >= 500) {
          useToastStore.getState().show('서버 오류가 발생했어요.')
          window.location.href = '/error'
        }
        return error
      },
    ],
  },
})
