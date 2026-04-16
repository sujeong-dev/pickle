import { http, HttpResponse } from 'msw';

export const reviewHandlers = [
  http.get('*/reviews', () => {
    return HttpResponse.json({
      data: [
        {
          id: '1',
          username: '할인사냥꾼',
          timeAgo: '2시간 전',
          content: '오늘 양재점에서 장봤어요! 물티슈 대박 세일이라\n바로 담음',
          productName: '커클랜드 물티슈',
          rating: 5.0,
          likeCount: 47,
          commentCount: 24,
        },
        {
          id: '2',
          username: '코스트코매니아',
          timeAgo: '5시간 전',
          content: '하남점 다녀왔어요. 연어 가격이 많이 올랐네요...\n그래도 샘플 많이 받아서 배불러서 나왔어요 ㅋㅋ',
          productName: '노르웨이 훈제연어',
          rating: 4.0,
          likeCount: 31,
          commentCount: 8,
        },
        {
          id: '3',
          username: '주부9단',
          timeAgo: '1일 전',
          content: '일산점 다녀왔어요. 오늘 닭가슴살 왕창 세일 중이에요!',
          productName: '커클랜드 닭가슴살',
          rating: 5.0,
          likeCount: 63,
          commentCount: 17,
        },
      ],
      total: 3,
      page: 0,
      size: 10,
    });
  }),

  http.get('*/reviews/:id', ({ params }) => {
    const { id } = params;

    if (id === '1') {
      return HttpResponse.json({
        id: '1',
        username: '할인사냥꾼',
        timeAgo: '2시간 전',
        content: '오늘 양재점에서 장봤어요! 물티슈 대박 세일이라\n바로 담음',
        productName: '커클랜드 물티슈',
        rating: 5.0,
        likeCount: 47,
        commentCount: 24,
        receiptItems: [
          { name: '커클랜드 물티슈', price: 12900, quantity: 2 },
          { name: '커클랜드 키친타올', price: 11800, quantity: 1 },
        ],
        receiptImageUrl: undefined,
      });
    }

    if (id === '2') {
      return HttpResponse.json({
        id: '2',
        username: '코스트코매니아',
        timeAgo: '5시간 전',
        content: '하남점 다녀왔어요. 연어 가격이 많이 올랐네요...\n그래도 샘플 많이 받아서 배불러서 나왔어요 ㅋㅋ',
        productName: '노르웨이 훈제연어',
        rating: 4.0,
        likeCount: 31,
        commentCount: 8,
        receiptItems: [
          { name: '노르웨이 훈제연어', price: 32900, quantity: 1 },
          { name: '커클랜드 버터', price: 13900, quantity: 1 },
        ],
        receiptImageUrl: undefined,
      });
    }

    return HttpResponse.json(
      { message: '존재하지 않는 후기입니다.' },
      { status: 404 },
    );
  }),
];
