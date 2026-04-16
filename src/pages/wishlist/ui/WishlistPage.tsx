import { PageHeader } from "@/shared/ui";
import { SavedDealCard } from "@/entities/post";
import type { Post } from "@/entities/post";

const MOCK_SAVED_POSTS: Post[] = [
  {
    id: "1",
    author: { name: "할인사냥꾼", isVerified: true },
    createdAt: "2시간 전",
    content: "코스트코 커클랜드 물티슈 할인 중입니다!",
    product: {
      name: "커클랜드 물티슈",
      discountRate: 24,
      originalPrice: 16900,
      currentPrice: 12900,
    },
    reviewCount: 3,
    rating: 4.5,
    likeCount: 47,
    commentCount: 24,
    relatedPostCount: 2,
  },
  {
    id: "2",
    author: { name: "절약여왕", isVerified: false },
    createdAt: "1일 전",
    content: "올리브영 세일 기간 마스크팩 득템했어요",
    product: {
      name: "메디힐 마스크팩 10매",
      discountRate: 40,
      originalPrice: 15000,
      currentPrice: 9000,
    },
    reviewCount: 1,
    rating: 4.0,
    likeCount: 23,
    commentCount: 8,
    relatedPostCount: 0,
  },
  {
    id: "3",
    author: { name: "마트탐험가", isVerified: true },
    createdAt: "3일 전",
    content: "GS25 1+1 행사 중",
    product: {
      name: "초코파이 정 12입",
      discountRate: 15,
      originalPrice: 6500,
      currentPrice: 5500,
    },
    reviewCount: 0,
    rating: 0,
    likeCount: 12,
    commentCount: 3,
    relatedPostCount: 1,
  },
];

export function WishlistPage() {
  const posts = MOCK_SAVED_POSTS;

  return (
    <div className="bg-gray-50 flex flex-col h-dvh">
      <PageHeader title="찜한 제보" />
      <div className="flex-1 overflow-y-auto min-h-0 bg-white">
        {posts.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-body1 text-gray-500">아직 찜한 제보가 없어요</p>
          </div>
        ) : (
          posts.map((post) => <SavedDealCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
