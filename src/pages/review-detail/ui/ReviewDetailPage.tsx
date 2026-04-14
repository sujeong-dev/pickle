import { HomeHeader } from "@/widgets/home-header";
import { BottomNav } from "@/widgets/bottom-nav";
import { ReviewItemRow } from "@/entities/review";
import type { ReviewItem } from "@/entities/review";

function UserAvatarIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#2D8A5A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function VerifiedBadgeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2D8A5A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function LikeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9E9E9E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
      <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9E9E9E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

const MOCK_ITEMS: ReviewItem[] = [
  { name: "커클랜드 물티슈", price: "12,900원", rating: 5, comment: "가성비 최고!" },
  { name: "커클랜드 물티슈", price: "12,900원", rating: 5, comment: "가성비 최고!" },
  { name: "커클랜드 물티슈", price: "12,900원", rating: 5, comment: "가성비 최고!" },
];

const MOCK_TOTAL = "33,580원";

type ReviewDetailPageProps = {
  reviewId: string;
};

export function ReviewDetailPage({ reviewId: _ }: ReviewDetailPageProps) {
  return (
    <div className="bg-white flex flex-col h-dvh">
      <HomeHeader />

      <main className="flex flex-col flex-1 overflow-y-auto min-h-0">
        {/* 유저 정보 */}
        <div className="flex gap-2.5 items-center px-5 py-3">
          <div className="bg-primary-50 flex items-center justify-center rounded-full shrink-0 size-[46px]">
            <UserAvatarIcon />
          </div>
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <div className="flex gap-1 items-center">
              <span className="font-semibold text-[16px] text-gray-900">할인사냥꾼</span>
              <VerifiedBadgeIcon />
            </div>
            <span className="text-gray-500 text-[11.5px] leading-[17px]">2시간 전</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          {/* 요약 바 */}
          <div className="bg-gray-50 flex items-center justify-between px-5 py-3">
            <span className="text-gray-600 text-[16px]">총 {MOCK_ITEMS.length}개 항목</span>
            <span className="font-bold text-[16px] text-gray-900">{MOCK_TOTAL}</span>
          </div>

          {/* 상품 목록 */}
          <div className="flex flex-col">
            {MOCK_ITEMS.map((item, idx) => (
              <ReviewItemRow key={idx} {...item} />
            ))}
          </div>

          {/* 좋아요 / 댓글 */}
          <div className="flex items-center px-5 py-3">
            <div className="flex gap-5 items-center">
              <div className="flex gap-1.5 items-center">
                <LikeIcon />
                <span className="text-gray-500 text-[16px] leading-none">47</span>
              </div>
              <div className="flex items-center gap-[5.77px]">
                <CommentIcon />
                <span className="text-gray-500 text-[16px] leading-none">24</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav activeTab="review" />
    </div>
  );
}
