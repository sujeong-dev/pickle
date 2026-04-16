import { http, HttpResponse } from 'msw'

export const receiptHandlers = [
  // POST /api/receipts — 영수증 이미지 분석 후 항목 반환
  http.post('/api/receipts', async () => {
    return HttpResponse.json({
      id: `mock-receipt-${Date.now()}`,
      items: [
        { name: '커클랜드 물티슈', price: 12900, quantity: 1, discountedPrice: 10320 },
        { name: '코카콜라 500ml', price: 1500, quantity: 3, discountedPrice: 1200 },
        { name: '포카칩 오리지널', price: 2500, quantity: 2 },
      ],
      totalAmount: 28920,
    })
  }),

  // POST /api/reviews — 후기 등록
  http.post('/api/reviews', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({
      id: `mock-review-${Date.now()}`,
      username: '테스트유저',
      timeAgo: '방금 전',
      content: (body.content as string) ?? '',
      productName: '영수증 상품',
      rating: (body.rating as number) ?? 3,
      likeCount: 0,
      commentCount: 0,
    })
  }),

  // PATCH /api/reviews/:id — 후기 수정
  http.patch('/api/reviews/:id', async ({ params, request }) => {
    const { id } = params as { id: string }
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({
      id,
      username: '테스트유저',
      timeAgo: '방금 전',
      content: (body.content as string) ?? '',
      productName: '영수증 상품',
      rating: (body.rating as number) ?? 3,
      likeCount: 0,
      commentCount: 0,
    })
  }),

  // DELETE /api/reviews/:id — 후기 삭제
  http.delete('/api/reviews/:id', () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // Error case: 이미 등록된 후기
  // Uncomment to test error scenario:
  // http.post('/api/reviews', () => {
  //   return HttpResponse.json(
  //     { message: '이미 후기를 등록했어요.' },
  //     { status: 400 }
  //   )
  // }),
]
