import { RelatedReportsPage } from "@/pages/related-reports";
import type { Post, Product } from "@/entities/post";

// TODO: replace with real data fetching
const mockProduct: Product = {
  name: "커클랜드 물티슈",
  discountRate: 24,
  originalPrice: 16900,
  currentPrice: 12900,
};

const mockPosts: Post[] = [
  {
    id: "r1",
    author: { name: "할인사냥꾼", isVerified: true },
    createdAt: "2시간 전",
    content: "양재점 물티슈 세일 중이에요! 재고 많으니 서두르세요 🔥",
    product: mockProduct,
    reviewCount: 3,
    rating: 4.7,
    likeCount: 47,
    commentCount: 24,
    relatedPostCount: 0,
  },
  {
    id: "r2",
    author: { name: "알뜰주부", isVerified: true },
    createdAt: "3시간 전",
    content: "저도 오늘 양재점에서 봤어요. 진짜 세일 중이더라고요!",
    product: mockProduct,
    reviewCount: 1,
    rating: 4.0,
    likeCount: 12,
    commentCount: 5,
    relatedPostCount: 0,
  },
];

export default function Page() {
  return <RelatedReportsPage product={mockProduct} posts={mockPosts} />;
}
