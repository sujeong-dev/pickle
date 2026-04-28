import { http, HttpResponse } from 'msw'

export const authHandlers = [
  // GET */auth/kakao/authorize
  http.get('*/auth/kakao/authorize', () => {
    return HttpResponse.json({
      url: 'https://kauth.kakao.com/oauth/authorize?client_id=mock&redirect_uri=http://localhost:3000/login/kakao/callback&response_type=code',
    })
  }),

  // GET */auth/naver/authorize
  http.get('*/auth/naver/authorize', () => {
    return HttpResponse.json({
      url: 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=mock&redirect_uri=http://localhost:3000/login/naver/callback&state=mock-state',
    })
  }),

  // POST */auth/kakao/login
  http.post('*/auth/kakao/login', () => {
    return HttpResponse.json({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: {
        id: 'mock-user-id',
        nickname: '피클러',
        isNewUser: false,
      },
    })
  }),

  // POST */auth/naver/login
  http.post('*/auth/naver/login', () => {
    return HttpResponse.json({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: {
        id: 'mock-user-id',
        nickname: '피클러',
        isNewUser: false,
      },
    })
  }),

  // POST */auth/signup (signupToken은 Authorization 헤더로 수신)
  http.post('*/auth/signup', () => {
    return HttpResponse.json({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      userId: 1,
    })
  }),

  // POST */auth/logout
  http.post('*/auth/logout', () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // GET */users/nickname/check
  http.get('*/users/nickname/check', ({ request }) => {
    const url = new URL(request.url)
    const nickname = url.searchParams.get('nickname')

    if (nickname === 'taken') {
      return HttpResponse.json({ nickname, available: false })
    }

    return HttpResponse.json({ nickname, available: true })
  }),

  // PATCH */users/me/nickname
  http.patch('*/users/me/nickname', () => {
    return new HttpResponse(null, { status: 204 })
  }),
]
