import { DealCard } from "@/entities/post";
import type { Post } from "@/entities/post";
import { FeedEmpty } from "./FeedEmpty";
import { ROUTES } from "@/shared/config/routes";
import { WishlistButton } from "@/features/wishlist";

const mockPosts: Post[] = [
  {
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
    commentCount: 24,
    relatedPostCount: 3,
  },
  {
    id: "2",
    author: { name: "알뜰주부", isVerified: true },
    createdAt: "4시간 전",
    content: "오늘 코스트코 잠실점 갔다가 발견했어요. 1+1 행사 중이라 진짜 이득이에요!",
    product: {
      name: "코코넛오일 1.6L",
      discountRate: 15,
      originalPrice: 22900,
      currentPrice: 19500,
    },
    reviewCount: 5,
    rating: 4.5,
    likeCount: 32,
    commentCount: 11,
    relatedPostCount: 2,
  },
];

function FireIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="#E0421A" aria-hidden="true">
      <path d="M12 2C12 2 8 7 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 10 15 8 15 8C15 8 14 10 13 10C13 10 14 7 12 2Z" />
      <path d="M12 22C9.23858 22 7 19.7614 7 17C7 14 9 12 12 12C15 12 17 14 17 17C17 19.7614 14.7614 22 12 22Z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function SectionHeader({
  icon,
  title,
  showMore = false,
}: {
  icon: React.ReactNode;
  title: string;
  showMore?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-5">
      <div className="flex gap-[6px] items-center">
        {icon}
        <span className="font-bold text-h2 text-gray-900">{title}</span>
      </div>
      {showMore && (
        <button type="button" className="text-body2 text-gray-500">
          더보기 ›
        </button>
      )}
    </div>
  );
}

type HomeFeedProps = {
  isEmpty?: boolean;
};

export function HomeFeed({ isEmpty = false }: HomeFeedProps) {
  if (isEmpty) {
    return (
      <div className="flex flex-col flex-1 min-h-0">
        <FeedEmpty />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <section>
        <SectionHeader icon={<FireIcon />} title="지금 핫한" showMore />
        <DealCard post={mockPosts[0]} href={ROUTES.postDetail(mockPosts[0].id)} wishlistButton={<WishlistButton postId={mockPosts[0].id} />} />
      </section>
      <section>
        <SectionHeader icon={<ClockIcon />} title="최신 제보" />
        <DealCard post={mockPosts[1]} href={ROUTES.postDetail(mockPosts[1].id)} wishlistButton={<WishlistButton postId={mockPosts[1].id} />} />
      </section>
    </div>
  );
}
