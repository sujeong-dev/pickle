import ky, { isHTTPError } from 'ky'
import { getAccessToken, getRefreshToken, setAccessToken, clearTokens, setRefreshToken } from '@/shared/model/tokenStore'
import { useToastStore } from '@/shared/model/toastStore'

// 동시에 여러 요청이 401을 받을 때 토큰 갱신을 한 번만 수행하고 나머지는 큐에 대기
let isRefreshing = false
const failedQueue: Array<{
  request: Request
  resolve: (response: Response | PromiseLike<Response>) => void
  reject: (err: unknown) => void
}> = []

// 갱신 완료 후 큐에 쌓인 요청들을 새 토큰으로 순차 재시도
async function processQueue(err: unknown, token: string | null) {
  const queue = [...failedQueue]
  failedQueue.length = 0
  for (const { request, resolve, reject } of queue) {
    if (err) {
      reject(err)
    } else {
      try {
        const headers = new Headers(request.headers)
        headers.set('Authorization', `Bearer ${token!}`)
        resolve(await ky(new Request(request, { headers })))
      } catch (retryErr) {
        reject(retryErr)
      }
    }
  }
}

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

        // 이미 갱신 중이면 새 토큰이 발급될 때까지 큐에 대기
        if (isRefreshing) {
          return new Promise<Response>((resolve, reject) => {
            failedQueue.push({ request, resolve, reject })
          })
        }

        isRefreshing = true
        try {
          const refreshed = await ky
            .post('auth/refresh', {
              prefix: process.env.NEXT_PUBLIC_API_URL,
              json: { refreshToken: getRefreshToken() },
            })
            .json<{ accessToken: string; refreshToken: string; }>();
          setAccessToken(refreshed.accessToken)
          setRefreshToken(refreshed.refreshToken)
          // 대기 중인 요청들 새 토큰으로 순차 재시도
          await processQueue(null, refreshed.accessToken)
          // 원래 실패했던 요청 재시도
          const headers = new Headers(request.headers)
          headers.set('Authorization', `Bearer ${refreshed.accessToken}`)
          return ky(new Request(request, { headers }))
        } catch (err) {
          await processQueue(err, null)
          clearTokens()
          window.location.href = '/login'
          return response
        } finally {
          isRefreshing = false
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
