import { api } from './kyInstance'

// Types
export type PresignedUrlBody = {
  filename: string
  contentType: string
}

export type PresignedUrlResponse = {
  presignedUrl: string
  fileUrl: string
}

export type OcrJobResponse = {
  jobId: string
}

export type OcrResult = {
  jobId: string
  status: 'pending' | 'done' | 'failed'
  productName?: string
  price?: number
  discountRate?: number
}

export type CreatePostBody = {
  productName: string
  originalPrice: number
  discountedPrice: number
  discountRate: number
  storeLocation: string
  imageUrl?: string
  content?: string
}

export type Post = {
  id: string
  productName: string
  originalPrice: number
  discountedPrice: number
  discountRate: number
  storeLocation: string
  imageUrl?: string
  content?: string
  createdAt: string
}

// API Functions

export async function getPresignedUrl(body: PresignedUrlBody): Promise<PresignedUrlResponse> {
  return api.post('upload/presigned', { json: body }).json<PresignedUrlResponse>()
}

export async function requestOcr(imageFile: File): Promise<OcrJobResponse> {
  const formData = new FormData()
  formData.append('imageFile', imageFile)
  return api.post('ocr/product', { body: formData }).json<OcrJobResponse>()
}

export async function getOcrStatus(jobId: string): Promise<OcrResult> {
  return api.get(`ocr/status/${jobId}`).json<OcrResult>()
}

export async function createPost(body: CreatePostBody): Promise<Post> {
  return api.post('posts', { json: body }).json<Post>()
}
