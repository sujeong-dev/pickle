import ky, { HTTPError } from 'ky'
import { api } from './kyInstance'

export interface AuthorizeResponse {
  url: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    nickname: string
    isNewUser: boolean
  }
}

export interface AuthErrorBody {
  statusCode: number
  error: string
  timestamp: string
  path: string
}

export interface SignupResponse {
  accessToken: string
  refreshToken: string
  userId: number
}

export interface NicknameCheckResponse {
  nickname: string
  available: boolean
}

export interface KakaoLoginBody {
  code: string
}

export interface NaverLoginBody {
  code: string
  state: string
}

export interface SignupBody {
  nickname: string
}

export interface SignupNewUserBody {
  signupToken: string
  nickname: string
  sido: string
  sigungu: string
  termsAgreed: boolean
}

export interface UpdateNicknameBody {
  nickname: string
}

export function getKakaoAuthorizeUrl(): Promise<AuthorizeResponse> {
  return api.get('auth/kakao/authorize').json<AuthorizeResponse>()
}

export function getNaverAuthorizeUrl(): Promise<AuthorizeResponse> {
  return api.get('auth/naver/authorize').json<AuthorizeResponse>()
}

// kyInstance.beforeError(403→/, 4xx 자동 토스트)를 우회하기 위해 raw ky 사용
export function kakaoLogin(body: KakaoLoginBody): Promise<LoginResponse> {
  return ky.post('auth/kakao/login', {
    prefix: process.env.NEXT_PUBLIC_API_URL,
    json: body,
  }).json<LoginResponse>()
}

export function naverLogin(body: NaverLoginBody): Promise<LoginResponse> {
  return ky.post('auth/naver/login', {
    prefix: process.env.NEXT_PUBLIC_API_URL,
    json: body,
  }).json<LoginResponse>()
}

export async function getAuthErrorMessage(error: unknown): Promise<string> {
  if (!(error instanceof HTTPError)) return '로그인에 실패했어요.'
  let body: Partial<AuthErrorBody> = {}
  try {
    body = await error.response.clone().json()
  } catch {}

  switch (body.error) {
    case 'FORBIDDEN':
      return '정지된 계정이에요.'
    case 'REJOIN_RESTRICTED':
      return '탈퇴 후 7일 이후 재가입할 수 있어요.'
    case 'EMAIL_REGISTERED_KAKAO':
      return '이미 카카오로 가입된 계정이에요.'
    case 'EMAIL_REGISTERED_NAVER':
      return '이미 네이버로 가입된 계정이에요.'
  }
  if (body.statusCode === 401) return '로그인 정보가 올바르지 않아요. 다시 시도해주세요.'
  if (body.statusCode === 400) return '잘못된 요청이에요.'
  return '로그인에 실패했어요.'
}

export function signup(body: SignupBody): Promise<SignupResponse> {
  return api.post('auth/signup', { json: body }).json<SignupResponse>()
}

// 신규 사용자 전용 — signupToken을 body에 포함, accessToken 없는 상태에서 호출되므로 raw ky 사용
export function signupNewUser(body: SignupNewUserBody): Promise<SignupResponse> {
  return ky.post('auth/signup', {
    prefix: process.env.NEXT_PUBLIC_API_URL,
    json: body,
  }).json<SignupResponse>()
}

export function logout(): Promise<void> {
  return api.post('auth/logout').json<void>()
}

export function checkNickname(nickname: string): Promise<NicknameCheckResponse> {
  return api
    .get('users/nickname/check', { searchParams: { nickname } })
    .json<NicknameCheckResponse>()
}

export function updateNickname(body: UpdateNicknameBody): Promise<void> {
  return api.patch('users/me/nickname', { json: body }).json<void>()
}
