"use client";

import { useQuery } from "@tanstack/react-query";
import { HomeHeader } from "@/widgets/home-header";
import { BottomNav } from "@/widgets/bottom-nav";
import { ReviewItemRow } from "@/entities/review";
import { getReviewDetail } from "@/shared/api";

const reviewDetailKeys = {
  detail: (id: string) => ['review', 'detail', id] as const,
};

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

function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR') + '원';
}

function formatRelativeTime(createdAt: string): string {
  const diff = Date.now() - new Date(createdAt).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

function calcTotal(items: { price: number; quantity: number }[]): string {
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  return formatPrice(total);
}

type ReviewDetailPageProps = {
  reviewId: string;
};

export function ReviewDetailPage({ reviewId }: ReviewDetailPageProps) {
  const { data } = useQuery({
    queryKey: reviewDetailKeys.detail(reviewId),
    queryFn: () => getReviewDetail(reviewId),
  });

  const receiptItems = data?.receiptItems ?? [];
  const total = receiptItems.length > 0 ? calcTotal(receiptItems) : '-';

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
              <span className="font-semibold text-[16px] text-gray-900">{data?.authorNickname ?? ''}</span>
              <VerifiedBadgeIcon />
            </div>
            <span className="text-gray-500 text-[11.5px] leading-[17px]">{data?.createdAt ? formatRelativeTime(data.createdAt) : ''}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          {/* 요약 바 */}
          <div className="bg-gray-50 flex items-center justify-between px-5 py-3">
            <span className="text-gray-600 text-[16px]">총 {receiptItems.length}개 항목</span>
            <span className="font-bold text-[16px] text-gray-900">{total}</span>
          </div>

          {/* 상품 목록 */}
          <div className="flex flex-col">
            {receiptItems.map((item, idx) => (
              <ReviewItemRow
                key={idx}
                name={item.name}
                price={formatPrice(item.price)}
                rating={data?.rating ?? 0}
                comment=""
              />
            ))}
          </div>

          {/* 좋아요 / 댓글 */}
          <div className="flex items-center px-5 py-3">
            <div className="flex gap-5 items-center">
              <div className="flex gap-1.5 items-center">
                <LikeIcon />
                <span className="text-gray-500 text-[16px] leading-none">{data?.likeCount ?? 0}</span>
              </div>
              <div className="flex items-center" style={{ gap: "5.77px" }}>
                <CommentIcon />
                <span className="text-gray-500 text-[16px] leading-none">{data?.commentCount ?? 0}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav activeTab="review" />
    </div>
  );
}
