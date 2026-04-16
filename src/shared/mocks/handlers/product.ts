import { http, HttpResponse } from 'msw';
import type { Post } from '@/entities/post';
import type { Comment, PostListResponse, LikeResponse, BookmarkResponse, CommentListResponse } from '@/shared/api';

const mockPosts: Post[] = [
  {
    id: '1',
    author: { name: '할인사냥꾼', isVerified: true, avatarUrl: undefined },
    createdAt: '2시간 전',
    content: '양재점 물티슈 세일 중이에요! 재고 많으니 서두르세요',
    product: {
      name: '커클랜드 시그니처 물티슈',
      discountRate: 24,
      originalPrice: 16900,
      currentPrice: 12900,
      imageUrl: undefined,
    },
    reviewCount: 3,
    rating: 4.7,
    likeCount: 47,
    commentCount: 3,
    relatedPostCount: 3,
  },
  {
    id: '2',
    author: { name: '알뜰주부', isVerified: true, avatarUrl: undefined },
    createdAt: '4시간 전',
    content: '오늘 코스트코 잠실점 갔다가 발견했어요. 1+1 행사 중이라 진짜 이득이에요!',
    product: {
      name: '코코넛오일 1.6L',
      discountRate: 15,
      originalPrice: 22900,
      currentPrice: 19500,
      imageUrl: undefined,
    },
    reviewCount: 5,
    rating: 4.5,
    likeCount: 32,
    commentCount: 11,
    relatedPostCount: 2,
  },
  {
    id: '3',
    author: { name: '절약왕', isVerified: false, avatarUrl: undefined },
    createdAt: '1일 전',
    content: '목동점 세제 특가 나왔어요. 1개 구매 시 1개 증정!',
    product: {
      name: '다우니 섬유유연제 3L',
      discountRate: 30,
      originalPrice: 18900,
      currentPrice: 13200,
      imageUrl: undefined,
    },
    reviewCount: 8,
    rating: 4.2,
    likeCount: 61,
    commentCount: 19,
    relatedPostCount: 1,
  },
  {
    id: '4',
    author: { name: '코스트코마니아', isVerified: true, avatarUrl: undefined },
    createdAt: '3시간 전',
    content: '하남점 올리브오일 세일 중! 유통기한 넉넉합니다.',
    product: {
      name: '커클랜드 엑스트라버진 올리브오일',
      discountRate: 20,
      originalPrice: 34900,
      currentPrice: 27900,
      imageUrl: undefined,
    },
    reviewCount: 12,
    rating: 4.8,
    likeCount: 89,
    commentCount: 34,
    relatedPostCount: 4,
  },
];

const mockComments: Comment[] = [
  {
    id: 'c1',
    content: '상봉점은 품절 ㅠㅠ',
    author: { name: '코코맘', isVerified: false },
    createdAt: '1시간 전',
  },
  {
    id: 'c2',
    content: '저도 양재점 들렀는데 재고 많았어요 빨리 가세요!',
    author: { name: '절약마스터', isVerified: true },
    createdAt: '30분 전',
  },
  {
    id: 'c3',
    content: '가격 대비 정말 좋네요 감사합니다',
    author: { name: '새벽할인', isVerified: false },
    createdAt: '15분 전',
  },
];

export const productHandlers = [
  http.get('*/posts', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 10);

    const response: PostListResponse = {
      data: mockPosts,
      total: mockPosts.length,
      page,
      size,
    };
    return HttpResponse.json(response);
  }),

  http.get('*/posts/:id', ({ params }) => {
    const { id } = params as { id: string };
    const post = mockPosts.find((p) => p.id === id);
    if (!post) {
      return HttpResponse.json({ message: '제보를 찾을 수 없어요.' }, { status: 404 });
    }
    return HttpResponse.json(post);
  }),

  http.post('*/posts/:postId/like', ({ params }) => {
    const { postId } = params as { postId: string };
    const post = mockPosts.find((p) => p.id === postId);
    if (!post) {
      return HttpResponse.json({ message: '제보를 찾을 수 없어요.' }, { status: 404 });
    }
    const response: LikeResponse = { liked: true, likeCount: post.likeCount + 1 };
    return HttpResponse.json(response);
  }),

  http.post('*/posts/:postId/bookmark', ({ params }) => {
    const { postId } = params as { postId: string };
    const post = mockPosts.find((p) => p.id === postId);
    if (!post) {
      return HttpResponse.json({ message: '제보를 찾을 수 없어요.' }, { status: 404 });
    }
    const response: BookmarkResponse = { bookmarked: true };
    return HttpResponse.json(response);
  }),

  http.post('*/posts/:postId/sold-out', ({ params }) => {
    const { postId } = params as { postId: string };
    const post = mockPosts.find((p) => p.id === postId);
    if (!post) {
      return HttpResponse.json({ message: '제보를 찾을 수 없어요.' }, { status: 404 });
    }
    return new HttpResponse(null, { status: 204 });
  }),

  http.get('*/posts/:postId/comments', ({ params }) => {
    const { postId } = params as { postId: string };
    const post = mockPosts.find((p) => p.id === postId);
    if (!post) {
      return HttpResponse.json({ message: '제보를 찾을 수 없어요.' }, { status: 404 });
    }
    const response: CommentListResponse = { data: mockComments };
    return HttpResponse.json(response);
  }),

  http.post('*/posts/:postId/comments', async ({ params, request }) => {
    const { postId } = params as { postId: string };
    const post = mockPosts.find((p) => p.id === postId);
    if (!post) {
      return HttpResponse.json({ message: '제보를 찾을 수 없어요.' }, { status: 404 });
    }
    const body = await request.json() as { content: string };
    const newComment: Comment = {
      id: `c${Date.now()}`,
      content: body.content,
      author: { name: '나', isVerified: false },
      createdAt: '방금',
    };
    return HttpResponse.json(newComment, { status: 201 });
  }),

  http.delete('*/posts/:postId/comments/:commentId', ({ params }) => {
    const { postId, commentId } = params as { postId: string; commentId: string };
    const post = mockPosts.find((p) => p.id === postId);
    if (!post) {
      return HttpResponse.json({ message: '제보를 찾을 수 없어요.' }, { status: 404 });
    }
    const comment = mockComments.find((c) => c.id === commentId);
    if (!comment) {
      return HttpResponse.json({ message: '댓글을 찾을 수 없어요.' }, { status: 404 });
    }
    return new HttpResponse(null, { status: 204 });
  }),
];
