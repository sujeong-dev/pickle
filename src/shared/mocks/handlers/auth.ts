import { http, HttpResponse } from 'msw'

export const authHandlers = [
  // GET /api/auth/kakao/authorize
  http.get('/api/auth/kakao/authorize', () => {
    return HttpResponse.json({
      url: 'https://kauth.kakao.com/oauth/authorize?client_id=mock&redirect_uri=http://localhost:3000/login/kakao/callback&response_type=code',
    })
  }),

  // GET /api/auth/naver/authorize
  http.get('/api/auth/naver/authorize', () => {
    return HttpResponse.json({
      url: 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=mock&redirect_uri=http://localhost:3000/login/naver/callback&state=mock-state',
    })
  }),

  // POST /api/auth/kakao/login
  http.post('/api/auth/kakao/login', () => {
    return HttpResponse.json({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      isNewUser: false,
      userId: 1,
    })
  }),

  // POST /api/auth/naver/login
  http.post('/api/auth/naver/login', () => {
    return HttpResponse.json({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      isNewUser: false,
      userId: 1,
    })
  }),

  // POST /api/auth/signup
  http.post('/api/auth/signup', () => {
    return HttpResponse.json({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      userId: 1,
    })
  }),

  // POST /api/auth/logout
  http.post('/api/auth/logout', () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // GET /api/users/nickname/check
  http.get('/api/users/nickname/check', ({ request }) => {
    const url = new URL(request.url)
    const nickname = url.searchParams.get('nickname')

    if (nickname === 'taken') {
      return HttpResponse.json({ isAvailable: false })
    }

    return HttpResponse.json({ isAvailable: true })
  }),

  // PATCH /api/users/me/nickname
  http.patch('/api/users/me/nickname', () => {
    return new HttpResponse(null, { status: 204 })
  }),
]
