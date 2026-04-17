import ky from 'ky'
import { api } from './kyInstance'

export interface AuthorizeResponse {
  url: string
}

export interface LoginResponse {
  signupRequired: boolean
  signupToken?: string    // signupRequired: true 일 때
  accessToken?: string    // signupRequired: false 일 때
  refreshToken?: string
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

// 신규 사용자 전용 — signupToken을 Authorization 헤더에 직접 삽입
// kyInstance의 beforeRequest가 accessToken을 덮어쓰므로 raw ky 사용
export function signupNewUser(body: SignupBody, signupToken: string): Promise<SignupResponse> {
  return ky.post('auth/signup', {
    prefix: process.env.NEXT_PUBLIC_API_URL,
    json: body,
    headers: { Authorization: `Bearer ${signupToken}` },
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
