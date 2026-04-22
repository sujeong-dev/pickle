"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { BackHeader, StarIcon, RemoveButton } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import { formatRelativeTime } from "@/shared/lib/formatRelativeTime";
import { ROUTES } from "@/shared/config/routes";
import { WishlistButton } from "@/features/wishlist";
import { ReportSoldoutModal, useReportSoldout, useReportSoldoutMutation } from "@/features/report-soldout";
import { togglePostLike, createPostComment, deletePostComment, postKeys } from "@/shared/api";
import type { PostImage } from "@/entities/post";
import { usePostDetail, usePostComments } from "../api/usePostDetail";

type PostDetailPageProps = {
  postId: string;
};

// ── sub-components ──────────────────────────────────────────

function VerifiedBadge() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-label="인증됨">
      <circle cx="8" cy="8" r="8" fill="#2D8A5A" />
      <path d="M4.5 8L7 10.5L11.5 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ThumbsUpIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="20" height="20" viewBox="0 0 24 24"
      fill={filled ? "#2D8A5A" : "none"}
      stroke={filled ? "#2D8A5A" : "#9E9E9E"}
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9E9E9E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 4l4 4-4 4" />
    </svg>
  );
}

function PostImageCarousel({ images }: { images: PostImage[] }) {
  const [currentIdx, setCurrentIdx] = useState(0);

  if (images.length === 0) {
    return <div className="relative w-full aspect-375/225 bg-gray-200 shrink-0" />;
  }

  return (
    <div className="relative w-full aspect-375/225 shrink-0 bg-gray-200 overflow-hidden">
      <Image
        src={images[currentIdx].url}
        alt={`상품 이미지 ${currentIdx + 1}`}
        fill
        className="object-cover"
      />
      {images.length > 1 && (
        <>
          {/* 좌우 탭 영역 */}
          <button
            type="button"
            aria-label="이전 이미지"
            className="absolute left-0 inset-y-0 w-1/3"
            onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
          />
          <button
            type="button"
            aria-label="다음 이미지"
            className="absolute right-0 inset-y-0 w-1/3"
            onClick={() => setCurrentIdx((i) => Math.min(images.length - 1, i + 1))}
          />
          {/* 하단 dot indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 items-center">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`이미지 ${i + 1}`}
                onClick={() => setCurrentIdx(i)}
                className={cn(
                  "rounded-full transition-all",
                  i === currentIdx ? "h-2 w-6 bg-white" : "size-2 bg-white/50"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Avatar() {
  return (
    <div className="size-11.5 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#2D8A5A" fillOpacity="0.5" />
        <path d="M20 21C20 18.2386 16.4183 16 12 16C7.58172 16 4 18.2386 4 21" stroke="#2D8A5A" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function PostDetailSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-5 animate-pulse">
      <div className="w-full aspect-375/225 bg-gray-100 rounded" />
      <div className="h-4 bg-gray-100 rounded w-2/3" />
      <div className="h-4 bg-gray-100 rounded w-1/2" />
    </div>
  );
}

function formatExpiredAt(expiredAt: string): string {
  const date = new Date(expiredAt);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

// ── page ────────────────────────────────────────────────────

export function PostDetailPage({ postId }: PostDetailPageProps) {
  const { data: post, isLoading, isError } = usePostDetail(postId);
  const { data: commentsData } = usePostComments(postId);
  const [comment, setComment] = useState("");
  const [likedOverride, setLikedOverride] = useState<boolean | null>(null);
  const [localLikeCount, setLocalLikeCount] = useState<number | null>(null);
  const { isOpen: isSoldoutOpen, isReported, open: openSoldout, close: closeSoldout, report: localReport } = useReportSoldout();
  const { mutate: reportSoldout, isPending: isReportingPending } = useReportSoldoutMutation(postId);
  const queryClient = useQueryClient();

  const { mutate: toggleLike } = useMutation({
    mutationFn: () => togglePostLike(postId),
    onSuccess: (data) => {
      setLikedOverride(data.isLiked);
      if (data.likeCount != null) setLocalLikeCount(data.likeCount);
    },
  });

  const { mutate: submitComment, isPending: isSubmittingComment } = useMutation({
    mutationFn: (content: string) => createPostComment(postId, content),
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: postKeys.comments(postId) });
    },
  });

  const { mutate: removeComment } = useMutation({
    mutationFn: (commentId: string) => deletePostComment(postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.comments(postId) });
    },
  });

  function handleReport() {
    reportSoldout(undefined, {
      onSuccess: () => {
        localReport();
        queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
      },
    });
  }

  if (isLoading) {
    return (
      <div className="bg-white flex flex-col h-dvh">
        <BackHeader />
        <PostDetailSkeleton />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="bg-white flex flex-col h-dvh">
        <BackHeader />
        <div className="flex flex-col flex-1 items-center justify-center gap-2">
          <span className="text-body2 text-gray-500">제보를 불러올 수 없어요.</span>
        </div>
      </div>
    );
  }

  const {
    authorNickname,
    isVerified,
    createdAt,
    productName,
    price,
    originalPrice,
    discountRate,
    avgRating,
    reviewCount,
    likeCount: serverLikeCount,
    images,
    description,
    expiredAt,
    soldOutCount,
    productId,
  } = post;

  const liked = likedOverride ?? post.isLiked;
  const displayLikeCount = localLikeCount ?? serverLikeCount;
  const comments = commentsData?.items ?? [];
  const displayRating = avgRating ?? 0;
  const filledStars = Math.round(displayRating);
  const displayDiscountRate = discountRate ?? (originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0);

  return (
    <div className="bg-white flex flex-col h-dvh">
      <BackHeader />

      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Image carousel */}
        <PostImageCarousel images={images} />

        {/* 거래 만료일 배너 */}
        {expiredAt && (
          <div className="bg-amber-50 flex items-center gap-2 px-5 py-2.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-body2 text-amber-800">{formatExpiredAt(expiredAt)}까지 거래 가능</span>
          </div>
        )}

        {/* Product info */}
        <div className="flex flex-col gap-2 px-6 py-5">
          {/* Author */}
          <div className="flex gap-2.5 items-center">
            <Avatar />
            <div className="flex flex-col gap-0.5">
              <div className="flex gap-1 items-center">
                <span className="font-semibold text-subtitle text-gray-900">{authorNickname}</span>
                {/* TODO: Swagger 미존재 — 백엔드 확인 필요 */}
                {isVerified && <VerifiedBadge />}
              </div>
              <span className="text-[11.5px] text-gray-500">{formatRelativeTime(createdAt)}</span>
            </div>
          </div>

          {/* Product name & price */}
          <h1 className="font-bold text-h2 text-gray-900 leading-normal">{productName}</h1>
          <div className="flex gap-2 items-baseline whitespace-nowrap">
            <span className="font-bold text-subtitle text-secondary-500">{displayDiscountRate}%</span>
            <span className="font-bold text-h2 text-gray-900">{price.toLocaleString()}원</span>
            <span className="text-subtitle text-gray-400 line-through">{(originalPrice ?? 0).toLocaleString()}원</span>
          </div>

          {/* Description */}
          {description && (
            <p className="text-[15px] text-gray-700 leading-relaxed mt-1">{description}</p>
          )}
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between px-5 py-3 border-y border-gray-100">
          <div className="flex gap-1 items-center">
            <button
              type="button"
              onClick={() => {
                const nowLiked = !liked;
                setLikedOverride(nowLiked);
                setLocalLikeCount(nowLiked ? displayLikeCount + 1 : displayLikeCount - 1);
                toggleLike();
              }}
              className="flex gap-2 items-center p-2 rounded"
            >
              <ThumbsUpIcon filled={liked} />
              <span className={cn("text-subtitle", liked ? "text-primary-500 font-semibold" : "text-gray-500")}>{displayLikeCount}</span>
            </button>
            <button
              type="button"
              onClick={isReported ? undefined : openSoldout}
              disabled={isReported || isReportingPending}
              className={cn(
                "flex gap-1 items-center px-2 py-2 rounded",
                isReported ? "bg-gray-100 cursor-default" : "bg-secondary-50",
              )}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isReported ? "#BDBDBD" : "#E0421A"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span className={cn("font-semibold text-body2", isReported ? "text-gray-400" : "text-secondary-500")}>
                {isReported ? "제보 완료" : "품절 제보하기"}
              </span>
              {soldOutCount > 0 && !isReported && (
                <span className="text-body2 text-secondary-400">{soldOutCount}명</span>
              )}
            </button>
          </div>
          <div className="flex gap-3 items-center">
            <WishlistButton postId={post.id} initialBookmarked={post.isBookmarked} />
            <button type="button" aria-label="공유하기"><ShareIcon /></button>
          </div>
        </div>

        {/* Reviews row */}
        {productId ? (
          <Link href={ROUTES.postReviews(postId, productId)} className="flex items-center justify-between px-5 py-3">
            <div className="flex gap-1.5 items-center">
              <ReceiptIcon />
              <span className="font-bold text-body2 text-gray-900">영수증 인증 후기</span>
            </div>
            <div className="flex gap-1.5 items-center">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} size={16} filled={i < filledStars} />
                ))}
              </div>
              <span className="font-bold text-subtitle text-[#F59E0B]">{displayRating}</span>
              <span className="text-body2 text-gray-500">{reviewCount}건</span>
              <ChevronRightIcon />
            </div>
          </Link>
        ) : (
          <div className="flex items-center justify-between px-5 py-3">
            <div className="flex gap-1.5 items-center">
              <ReceiptIcon />
              <span className="font-bold text-body2 text-gray-900">영수증 인증 후기</span>
            </div>
            <div className="flex gap-1.5 items-center">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} size={16} filled={i < filledStars} />
                ))}
              </div>
              <span className="font-bold text-subtitle text-[#F59E0B]">{displayRating}</span>
              <span className="text-body2 text-gray-500">{reviewCount}건</span>
              <ChevronRightIcon />
            </div>
          </div>
        )}

        {/* Comments section */}
        <div className="flex flex-col gap-2 px-5 py-3 border-t border-gray-100">
          <span className="font-bold text-body2 text-black">댓글 {comments.length}</span>
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3 items-start">
              <div className="size-8 rounded-full bg-gray-100 shrink-0" />
              <div className="flex flex-col gap-1.5 flex-1">
                <span className="font-semibold text-[13.5px] text-gray-800">{c.authorNickname}</span>
                <span className="text-[13.5px] text-gray-700">{c.content}</span>
              </div>
              {c.isMine && <RemoveButton size="sm" aria-label="댓글 삭제" onClick={() => removeComment(c.id)} />}
            </div>
          ))}
        </div>
      </div>

      <ReportSoldoutModal open={isSoldoutOpen} onClose={closeSoldout} onReport={handleReport} />

      {/* Comment input bar */}
      <div className="flex items-center gap-3 px-5 py-3 border-t border-gray-200 shrink-0">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="댓글을 입력해주세요"
          className="flex-1 h-12 rounded-[10px] bg-gray-200 px-3 text-body2 text-gray-900 placeholder:text-gray-400 outline-none"
        />
        <button
          type="button"
          disabled={!comment.trim() || isSubmittingComment}
          onClick={() => { if (comment.trim()) submitComment(comment); }}
          className={cn(
            "size-12.5 rounded-full flex items-center justify-center shrink-0 transition-colors",
            comment.trim() ? "bg-primary-500" : "bg-gray-200",
          )}
        >
          <span className={cn("text-[15.4px]", comment.trim() ? "text-white font-semibold" : "text-gray-400")}>등록</span>
        </button>
      </div>
    </div>
  );
}
