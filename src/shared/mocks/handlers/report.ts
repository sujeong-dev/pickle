import { http, HttpResponse } from 'msw'
import type { OcrResult } from '@/shared/api/report'

// Simulate OCR flow: first call returns 'waiting', subsequent calls return 'completed'
const ocrStatusMap = new Map<string, OcrResult>()

export const reportHandlers = [
  // POST /upload/presigned
  http.post('*/upload/presigned', () => {
    return HttpResponse.json({
      uploadUrl: 'https://mock-r2.example.com/upload/mock-key?X-Signature=mock',
      r2Key: 'tmp/mock-image-key.jpg',
    })
  }),

  // PUT mock R2 presigned upload (bypass real upload in dev)
  http.put('https://mock-r2.example.com/upload/mock-key', () => {
    return new HttpResponse(null, { status: 200 })
  }),

  // POST /ocr/product
  http.post('*/ocr/product', () => {
    const jobId = `mock-job-${Date.now()}`
    // Store initial waiting status
    ocrStatusMap.set(jobId, {
      jobId,
      status: 'waiting',
    })
    // After 1.5s: active
    setTimeout(() => {
      ocrStatusMap.set(jobId, { jobId, status: 'active' })
    }, 1500)
    // After 3s: completed with result
    setTimeout(() => {
      ocrStatusMap.set(jobId, {
        jobId,
        status: 'completed',
        result: {
          productName: '코카콜라 500ml',
          price: 1500,
          discountRate: 30,
        },
      })
    }, 3000)
    return HttpResponse.json({ jobId })
  }),

  // GET /ocr/status/:jobId
  http.get('*/ocr/status/:jobId', ({ params }) => {
    const { jobId } = params as { jobId: string }
    const result = ocrStatusMap.get(jobId)
    if (!result) {
      return HttpResponse.json(
        { message: '해당 OCR 작업을 찾을 수 없어요.' },
        { status: 404 }
      )
    }
    return HttpResponse.json(result)
  }),

  // POST /posts
  http.post('*/posts', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      id: `mock-post-${Date.now()}`,
      ...(body as object),
      createdAt: new Date().toISOString(),
    })
  }),

  // Error case: duplicate post
  // Uncomment to test error scenario:
  // http.post('*/posts', () => {
  //   return HttpResponse.json(
  //     { message: '이미 제보된 상품이에요.' },
  //     { status: 400 }
  //   )
  // }),
]
