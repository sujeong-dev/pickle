import { api } from './kyInstance'

// Types
export type PresignedUrlBody = {
  fileType: string
  purpose: string
}

export type PresignedUrlResponse = {
  uploadUrl: string
  r2Key: string
}

export type OcrJobResponse = {
  jobId: string
}

export type OcrResult = {
  jobId: string
  status: 'waiting' | 'active' | 'completed' | 'failed'
  result?: {
    productName?: string
    price?: number
    discountRate?: number
  }
}

export type CreatePostBody = {
  store: string
  branch: string
  productName: string
  price: number
  imageKeys: string[]
  content?: string
}

export type Post = {
  id: string
  productName: string
  price: number
  originalPrice: number
  discountRate: number
  store: string
  branch?: string
  imageKeys?: string[]
  content?: string
  createdAt: string
}

// API Functions

export async function getPresignedUrl(body: PresignedUrlBody): Promise<PresignedUrlResponse> {
  return api.post('upload/presigned', { json: body }).json<PresignedUrlResponse>()
}

export async function requestOcr(body: { r2Key: string }): Promise<OcrJobResponse> {
  return api.post('ocr/product', { json: body }).json<OcrJobResponse>()
}

export async function getOcrStatus(jobId: string): Promise<OcrResult> {
  return api.get(`ocr/status/${jobId}`).json<OcrResult>()
}

export async function createPost(body: CreatePostBody): Promise<Post> {
  return api.post('posts', { json: body }).json<Post>()
}
