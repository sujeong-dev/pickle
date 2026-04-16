import { api } from './kyInstance'

export interface AuthorizeResponse {
  url: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  isNewUser: boolean
  userId: number
}

export interface SignupResponse {
  accessToken: string
  refreshToken: string
  userId: number
}

export interface NicknameCheckResponse {
  isAvailable: boolean
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

export interface UpdateNicknameBody {
  nickname: string
}

export function getKakaoAuthorizeUrl(): Promise<AuthorizeResponse> {
  return api.get('auth/kakao/authorize').json<AuthorizeResponse>()
}

export function getNaverAuthorizeUrl(): Promise<AuthorizeResponse> {
  return api.get('auth/naver/authorize').json<AuthorizeResponse>()
}

export function kakaoLogin(body: KakaoLoginBody): Promise<LoginResponse> {
  return api.post('auth/kakao/login', { json: body }).json<LoginResponse>()
}

export function naverLogin(body: NaverLoginBody): Promise<LoginResponse> {
  return api.post('auth/naver/login', { json: body }).json<LoginResponse>()
}

export function signup(body: SignupBody): Promise<SignupResponse> {
  return api.post('auth/signup', { json: body }).json<SignupResponse>()
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
