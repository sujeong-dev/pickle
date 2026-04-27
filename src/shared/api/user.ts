import { api } from './kyInstance'

export interface UserProfile {
  id: string
  nickname: string
  profileImageUrl?: string
  postCount: number
  reviewCount: number
  bookmarkCount: number
}

export interface MyPost {
  id: string
  productName: string
  discountRate: number
  price: number
  storeLocation: string
  imageUrl?: string
  likeCount: number
  createdAt: string
}

export interface MyReview {
  id: string
  rating: number
  createdAt: string
  itemCount: number
  totalAmount: number
  items: { imageUrl?: string; rating: number }[]
}

export interface MyBookmark {
  id: string
  productName: string
  discountRate: number
  price: number
  originalPrice: number
  storeLocation: string
  imageUrl?: string
  author: { nickname: string }
  createdAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  size: number
}

export interface PaginationParams {
  page?: number
  size?: number
}

export function getMyProfile(): Promise<UserProfile> {
  return api.get('users/me').json<UserProfile>()
}

export function deleteMyAccount(): Promise<void> {
  return api.delete('users/me').json<void>()
}

export function getMyPosts(params?: PaginationParams): Promise<PaginatedResponse<MyPost>> {
  return api
    .get('users/me/posts', params ? { searchParams: params as Record<string, string | number> } : undefined)
    .json<PaginatedResponse<MyPost>>()
}

export function getMyReviews(params?: PaginationParams): Promise<PaginatedResponse<MyReview>> {
  return api
    .get('users/me/reviews', params ? { searchParams: params as Record<string, string | number> } : undefined)
    .json<PaginatedResponse<MyReview>>()
}

export function getMyBookmarks(params?: PaginationParams): Promise<PaginatedResponse<MyBookmark>> {
  return api
    .get('users/me/bookmarks', params ? { searchParams: params as Record<string, string | number> } : undefined)
    .json<PaginatedResponse<MyBookmark>>()
}
