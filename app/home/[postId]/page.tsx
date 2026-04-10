import { PostDetailPage } from "@/pages/post-detail";
import type { Post } from "@/entities/post";

// TODO: replace with real data fetching by postId
const mockPost: Post = {
  id: "1",
  author: { name: "할인사냥꾼", isVerified: true },
  createdAt: "2시간 전",
  content: "양재점 물티슈 세일 중이에요! 재고 많으니 서두르세요 🔥",
  product: {
    name: "커클랜드 시그니처 물티슈",
    discountRate: 24,
    originalPrice: 16900,
    currentPrice: 12900,
  },
  reviewCount: 3,
  rating: 4.7,
  likeCount: 47,
  commentCount: 3,
  relatedPostCount: 3,
};

export default function Page() {
  return <PostDetailPage post={mockPost} />;
}
