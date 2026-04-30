import { http, HttpResponse } from 'msw'
import type { ReceiptOcrStatusResponse } from '@/shared/api/receipt'

const receiptOcrJobs = new Map<string, ReceiptOcrStatusResponse>()

export const receiptHandlers = [
  // POST /api/ocr/receipt — receipt OCR enqueue
  http.post('*/ocr/receipt', async () => {
    const jobId = `receipt-job-${Date.now()}`
    receiptOcrJobs.set(jobId, { jobId, status: 'waiting' })
    setTimeout(() => {
      receiptOcrJobs.set(jobId, { jobId, status: 'active' })
    }, 1500)
    setTimeout(() => {
      receiptOcrJobs.set(jobId, {
        jobId,
        status: 'completed',
        result: {
          store: 'costco',
          branch: '양재점',
          totalAmount: 50000,
          itemCount: 2,
          purchasedAt: '2026-04-30',
          items: [
            {
              productCode: '630268',
              productName: '커클랜드 닭가슴살',
              quantity: 1,
              unitPrice: 28000,
              finalPrice: 28000,
            },
            {
              productCode: '801234',
              productName: '바스 슬라이드 트레이',
              quantity: 1,
              unitPrice: 22000,
              finalPrice: 22000,
            },
          ],
        },
      })
    }, 3000)
    return HttpResponse.json({ jobId }, { status: 201 })
  }),

  // GET /api/ocr/status/:jobId — receipt 전용 (없으면 fallthrough → report 핸들러)
  http.get('*/ocr/status/:jobId', ({ params }) => {
    const { jobId } = params as { jobId: string }
    const found = receiptOcrJobs.get(jobId)
    if (!found) return undefined
    return HttpResponse.json(found)
  }),

  // POST /api/receipts — 영수증 등록
  http.post('*/receipts', async ({ request }) => {
    const body = (await request.json()) as {
      r2Key: string
      store: string
      branch: string
      totalAmount: number
      itemCount: number
      purchasedAt: string
    }
    return HttpResponse.json(
      {
        id: `mock-receipt-${Date.now()}`,
        store: body.store,
        branch: body.branch,
        totalAmount: body.totalAmount,
        itemCount: body.itemCount,
        purchasedAt: body.purchasedAt,
        isVerified: false,
        createdAt: new Date().toISOString(),
      },
      { status: 201 },
    )
  }),

  // POST /reviews — 후기 등록
  http.post('*/reviews', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    return HttpResponse.json({
      id: `mock-review-${Date.now()}`,
      authorNickname: '테스트유저',
      createdAt: new Date().toISOString(),
      content: undefined,
      productName: (body.productName as string) ?? '영수증 상품',
      rating: (body.rating as number) ?? 3,
      images: [],
      // TODO: Swagger 미존재 — 백엔드 확인 필요
      likeCount: 0,
      commentCount: 0,
    })
  }),

  // PATCH /reviews/:id — 후기 수정
  http.patch('*/reviews/:id', async ({ params, request }) => {
    const { id } = params as { id: string }
    const body = (await request.json()) as Record<string, unknown>
    return HttpResponse.json({
      id,
      authorNickname: '테스트유저',
      createdAt: new Date().toISOString(),
      content: undefined,
      productName: '영수증 상품',
      rating: (body.rating as number) ?? 3,
      images: [],
      // TODO: Swagger 미존재 — 백엔드 확인 필요
      likeCount: 0,
      commentCount: 0,
    })
  }),

  // DELETE /reviews/:id — 후기 삭제
  http.delete('*/reviews/:id', () => {
    return new HttpResponse(null, { status: 204 })
  }),
]
