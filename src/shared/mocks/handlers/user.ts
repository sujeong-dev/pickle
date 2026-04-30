import { http, HttpResponse } from 'msw'

const userState: {
  sido: string | null
  sigungu: string | null
  dong: string | null
  longitude: number | null
  latitude: number | null
  profileImageUrl: string | null
} = {
  sido: null,
  sigungu: null,
  dong: null,
  longitude: null,
  latitude: null,
  profileImageUrl: null,
}

export const userHandlers = [
  // GET */users/me
  http.get('*/users/me', () => {
    return HttpResponse.json({
      id: 'user-001',
      nickname: '할인사냥꾼',
      profileImageUrl: userState.profileImageUrl ?? undefined,
      postCount: 12,
      reviewCount: 8,
      bookmarkCount: 24,
      sido: userState.sido,
      sigungu: userState.sigungu,
      dong: userState.dong,
      longitude: userState.longitude,
      latitude: userState.latitude,
    })
  }),

  // PATCH */users/me/profile-image
  http.patch('*/users/me/profile-image', async ({ request }) => {
    const body = (await request.json()) as { r2Key: string }
    const url = `https://mock-r2.example.com/${body.r2Key}`
    userState.profileImageUrl = url
    return HttpResponse.json({ profileImageUrl: url })
  }),

  // PUT */users/me/location
  http.put('*/users/me/location', async ({ request }) => {
    const body = (await request.json()) as {
      sido: string
      sigungu: string
      dong: string
      longitude: number
      latitude: number
    }
    userState.sido = body.sido
    userState.sigungu = body.sigungu
    userState.dong = body.dong
    userState.longitude = body.longitude
    userState.latitude = body.latitude
    return HttpResponse.json({
      sido: body.sido,
      sigungu: body.sigungu,
      dong: body.dong,
      longitude: body.longitude,
      latitude: body.latitude,
    })
  }),

  // DELETE */users/me
  http.delete('*/users/me', () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // GET */users/me/posts
  http.get('*/users/me/posts', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)
    const size = Number(url.searchParams.get('size') ?? 10)

    return HttpResponse.json({
      data: [
        {
          id: '1',
          productName: '커클랜드 물티슈',
          discountRate: 24,
          price: 12900,
          storeLocation: '코스트코 양재점',
          imageUrl: undefined,
          likeCount: 47,
          createdAt: '2시간 전',
        },
        {
          id: '2',
          productName: '메디힐 마스크팩 10매',
          discountRate: 40,
          price: 9000,
          storeLocation: '올리브영 강남점',
          imageUrl: undefined,
          likeCount: 23,
          createdAt: '1일 전',
        },
        {
          id: '3',
          productName: '초코파이 정 12입',
          discountRate: 15,
          price: 5500,
          storeLocation: 'GS25 역삼점',
          imageUrl: undefined,
          likeCount: 12,
          createdAt: '3일 전',
        },
      ],
      total: 3,
      page,
      size,
    })
  }),

  // GET */users/me/reviews
  http.get('*/users/me/reviews', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)
    const size = Number(url.searchParams.get('size') ?? 10)

    return HttpResponse.json({
      data: [
        {
          id: '1',
          rating: 4.5,
          createdAt: '2일 전',
          itemCount: 4,
          totalAmount: 87300,
          items: [
            { imageUrl: undefined, rating: 5.0 },
            { imageUrl: undefined, rating: 4.0 },
            { imageUrl: undefined, rating: 4.5 },
            { imageUrl: undefined, rating: 4.5 },
          ],
        },
        {
          id: '2',
          rating: 3.5,
          createdAt: '5일 전',
          itemCount: 2,
          totalAmount: 23800,
          items: [
            { imageUrl: undefined, rating: 4.0 },
            { imageUrl: undefined, rating: 3.0 },
          ],
        },
        {
          id: '3',
          rating: 5.0,
          createdAt: '1주 전',
          itemCount: 6,
          totalAmount: 132000,
          items: [
            { imageUrl: undefined, rating: 5.0 },
            { imageUrl: undefined, rating: 5.0 },
            { imageUrl: undefined, rating: 5.0 },
          ],
        },
      ],
      total: 3,
      page,
      size,
    })
  }),

  // GET */users/me/bookmarks
  http.get('*/users/me/bookmarks', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)
    const size = Number(url.searchParams.get('size') ?? 10)

    return HttpResponse.json({
      data: [
        {
          id: '1',
          productName: '커클랜드 물티슈',
          discountRate: 24,
          price: 12900,
          originalPrice: 16900,
          storeLocation: '코스트코 양재점',
          imageUrl: undefined,
          author: { nickname: '할인사냥꾼' },
          createdAt: '2시간 전',
        },
        {
          id: '2',
          productName: '메디힐 마스크팩 10매',
          discountRate: 40,
          price: 9000,
          originalPrice: 15000,
          storeLocation: '올리브영 강남점',
          imageUrl: undefined,
          author: { nickname: '절약여왕' },
          createdAt: '1일 전',
        },
        {
          id: '3',
          productName: '초코파이 정 12입',
          discountRate: 15,
          price: 5500,
          originalPrice: 6500,
          storeLocation: 'GS25 역삼점',
          imageUrl: undefined,
          author: { nickname: '마트탐험가' },
          createdAt: '3일 전',
        },
      ],
      total: 3,
      page,
      size,
    })
  }),
]
