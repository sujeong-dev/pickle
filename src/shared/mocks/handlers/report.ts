import { http, HttpResponse } from 'msw'
import type { OcrResult } from '@/shared/api/report'

// Simulate OCR flow: first call returns 'pending', subsequent calls return 'done'
const ocrStatusMap = new Map<string, OcrResult>()

export const reportHandlers = [
  // POST /api/upload/presigned
  http.post('/api/upload/presigned', () => {
    return HttpResponse.json({
      presignedUrl: 'https://mock-r2.example.com/upload/mock-key?X-Signature=mock',
      fileUrl: 'https://mock-r2.example.com/files/mock-image.jpg',
    })
  }),

  // PUT mock R2 presigned upload (bypass real upload in dev)
  http.put('https://mock-r2.example.com/upload/mock-key', () => {
    return new HttpResponse(null, { status: 200 })
  }),

  // POST /api/ocr/product
  http.post('/api/ocr/product', () => {
    const jobId = `mock-job-${Date.now()}`
    // Store initial pending status
    ocrStatusMap.set(jobId, {
      jobId,
      status: 'pending',
    })
    // After 3 seconds simulate done
    setTimeout(() => {
      ocrStatusMap.set(jobId, {
        jobId,
        status: 'done',
        productName: '코카콜라 500ml',
        price: 1500,
        discountRate: 30,
      })
    }, 3000)
    return HttpResponse.json({ jobId })
  }),

  // GET /api/ocr/status/:jobId
  http.get('/api/ocr/status/:jobId', ({ params }) => {
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

  // POST /api/posts
  http.post('/api/posts', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      id: `mock-post-${Date.now()}`,
      ...(body as object),
      createdAt: new Date().toISOString(),
    })
  }),

  // Error case: duplicate post
  // Uncomment to test error scenario:
  // http.post('/api/posts', () => {
  //   return HttpResponse.json(
  //     { message: '이미 제보된 상품이에요.' },
  //     { status: 400 }
  //   )
  // }),
]
