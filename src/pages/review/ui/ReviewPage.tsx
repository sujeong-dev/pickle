import Link from "next/link";
import { HomeHeader } from "@/widgets/home-header";
import { BottomNav } from "@/widgets/bottom-nav";
import { Button } from "@/shared/ui";
import { ROUTES } from "@/shared/config/routes";

function ReviewDocIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2D8A5A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function ReviewEmptyState() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col gap-6 items-center text-center">
        <div className="bg-primary-50 flex items-center justify-center rounded-full size-[60px]">
          <ReviewDocIcon />
        </div>
        <div className="flex flex-col gap-2 items-center">
          <p className="font-bold text-[21.2px] text-gray-800 leading-[31.7px]">아직 후기가 없어요</p>
          <p className="text-[15.4px] text-gray-400 leading-[23px]">첫 번째로 구매 후기를 공유해보세요!</p>
        </div>
        <Button size="md" className="w-[120px]">등록하기</Button>
      </div>
    </div>
  );
}

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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#2D8A5A" aria-hidden="true">
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#2D8A5A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M9 12l2 2 4-4" stroke="#2D8A5A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#FBBF24" stroke="#FBBF24" strokeWidth="1" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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

type ReviewCardProps = {
  id: string;
  username: string;
  timeAgo: string;
  content: string;
  productName: string;
  rating: number;
  likeCount: number;
  commentCount: number;
};

function ReviewCard({ username, timeAgo, content, productName, rating, likeCount, commentCount }: ReviewCardProps) {
  return (
    <div className="bg-white flex flex-col gap-[2px] w-full">
      {/* 유저 정보 */}
      <div className="flex gap-[10px] items-center px-5 py-3">
        <div className="bg-primary-50 flex items-center justify-center rounded-full shrink-0 size-[46px]">
          <UserAvatarIcon />
        </div>
        <div className="flex flex-col gap-[2px] flex-1 min-w-0">
          <div className="flex gap-1 items-center">
            <span className="font-semibold text-[16px] text-gray-900 truncate">{username}</span>
            <VerifiedBadgeIcon />
          </div>
          <span className="text-gray-500 text-[11.5px] leading-[17px]">{timeAgo}</span>
        </div>
      </div>

      {/* 후기 텍스트 */}
      <div className="px-5">
        <p className="text-gray-800 text-[15.4px] leading-[23px]">{content}</p>
      </div>

      {/* 상품 이미지 */}
      <div className="flex items-center overflow-hidden px-5 py-3">
        <div className="flex flex-col gap-1 shrink-0 w-[100px]">
          <div className="bg-gray-200 relative rounded-[8px] size-[100px]">
            <div className="absolute bottom-1 flex gap-[2px] items-center justify-center left-1 bg-gray-600 px-1 py-0.5 rounded-[3px]">
              <StarIcon />
              <span className="font-bold text-[12px] text-white leading-none">{rating.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-gray-700 text-[12px] text-center leading-none truncate">{productName}</p>
        </div>
      </div>

      {/* 좋아요 / 댓글 */}
      <div className="flex items-center px-5 py-3">
        <div className="flex gap-5 items-center">
          <div className="flex gap-1.5 items-center">
            <LikeIcon />
            <span className="text-gray-500 text-[16px] leading-none">{likeCount}</span>
          </div>
          <div className="flex items-center" style={{ gap: "5.77px" }}>
            <CommentIcon />
            <span className="text-gray-500 text-[16px] leading-none">{commentCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const MOCK_REVIEWS: ReviewCardProps[] = [
  {
    id: "1",
    username: "할인사냥꾼",
    timeAgo: "2시간 전",
    content: "오늘 양재점에서 장봤어요! 물티슈 대박 세일이라\n바로 담음",
    productName: "커클랜드 물티슈",
    rating: 5.0,
    likeCount: 47,
    commentCount: 24,
  },
  {
    id: "2",
    username: "할인사냥꾼",
    timeAgo: "2시간 전",
    content: "오늘 양재점에서 장봤어요! 물티슈 대박 세일이라\n바로 담음",
    productName: "커클랜드 물티슈",
    rating: 5.0,
    likeCount: 47,
    commentCount: 24,
  },
];

export function ReviewPage() {
  return (
    <div className="bg-gray-50 flex flex-col h-dvh">
      <HomeHeader />
      <main className="flex flex-col flex-1 overflow-y-auto min-h-0 gap-1">
        {MOCK_REVIEWS.length === 0
          ? <ReviewEmptyState />
          : MOCK_REVIEWS.map((review) => (
              <Link key={review.id} href={ROUTES.reviewDetail(review.id)}>
                <ReviewCard {...review} />
              </Link>
            ))
        }
      </main>
      <BottomNav activeTab="review" />
    </div>
  );
}
