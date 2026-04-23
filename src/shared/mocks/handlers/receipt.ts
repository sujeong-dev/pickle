import { http, HttpResponse } from 'msw'

export const receiptHandlers = [
  // POST /receipts — 영수증 등록
  http.post('*/receipts', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({
      id: `mock-receipt-${Date.now()}`,
      store: body.store ?? 'costco',
      branch: body.branch ?? '',
      totalAmount: body.totalAmount ?? 0,
      itemCount: body.itemCount ?? 0,
      purchasedAt: body.purchasedAt ?? new Date().toISOString(),
      isVerified: false,
      createdAt: new Date().toISOString(),
    }, { status: 201 })
  }),

  // POST /reviews — 후기 등록
  http.post('*/reviews', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
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
    const body = await request.json() as Record<string, unknown>
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
