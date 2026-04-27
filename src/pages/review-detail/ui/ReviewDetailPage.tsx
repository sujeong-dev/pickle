"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HomeHeader } from "@/widgets/home-header";
import { BottomNav } from "@/widgets/bottom-nav";
import { ReviewCard } from "@/entities/review";
import {
  getReviewDetail,
  getReviewComments,
  createReviewComment,
  deleteReviewComment,
} from "@/shared/api";
import { TrashIcon, UserAvatar } from "@/shared/ui";
import { formatRelativeTime } from "@/shared/lib/formatRelativeTime";
import type { ReviewComment } from "@/shared/api/review";

const reviewDetailKeys = {
  detail: (id: string) => ["review", "detail", id] as const,
};

const reviewCommentKeys = {
  list: (id: string) => ["review", "comments", id] as const,
};

function SendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

type CommentItemProps = {
  comment: ReviewComment;
  onDelete: (id: string) => void;
  isDeleting: boolean;
};

function CommentItem({ comment, onDelete, isDeleting }: CommentItemProps) {
  return (
    <div className="flex gap-2.5 py-3 border-b border-gray-100">
      <UserAvatar src={comment.authorProfileImage} size={32} />
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-semibold text-[13px] text-gray-900 truncate">{comment.authorNickname}</span>
            <span className="text-[11px] text-gray-400 shrink-0">{formatRelativeTime(comment.createdAt)}</span>
          </div>
          {comment.isMine && (
            <button
              type="button"
              onClick={() => onDelete(comment.id)}
              disabled={isDeleting}
              className="text-gray-400 shrink-0 disabled:opacity-40"
              aria-label="댓글 삭제"
            >
              <TrashIcon />
            </button>
          )}
        </div>
        <p className="text-[14px] text-gray-700 leading-[21px]">{comment.content}</p>
      </div>
    </div>
  );
}

type ReviewDetailPageProps = {
  reviewId: string;
};

export function ReviewDetailPage({ reviewId }: ReviewDetailPageProps) {
  const [commentInput, setCommentInput] = useState("");
  const queryClient = useQueryClient();

  const { data: review } = useQuery({
    queryKey: reviewDetailKeys.detail(reviewId),
    queryFn: () => getReviewDetail(reviewId),
  });

  const { data: commentData } = useQuery({
    queryKey: reviewCommentKeys.list(reviewId),
    queryFn: () => getReviewComments(reviewId),
    enabled: !!reviewId,
  });

  const { mutate: submitComment, isPending: isSubmitting } = useMutation({
    mutationFn: (content: string) => createReviewComment(reviewId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewCommentKeys.list(reviewId) });
      setCommentInput("");
    },
  });

  const { mutate: removeComment, isPending: isDeleting } = useMutation({
    mutationFn: (commentId: string) => deleteReviewComment(reviewId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewCommentKeys.list(reviewId) });
    },
  });

  const comments = commentData?.items ?? [];

  const handleSubmit = () => {
    const trimmed = commentInput.trim();
    if (!trimmed || isSubmitting) return;
    submitComment(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-white flex flex-col h-dvh">
      <HomeHeader />

      <main className="flex-1 overflow-y-auto min-h-0">
        {/* 피드 카드 그대로 */}
        {review && (
          <ReviewCard
            id={review.id}
            authorNickname={review.authorNickname}
            createdAt={review.createdAt}
            content={review.content}
            productName={review.productName}
            rating={review.rating}
            price={review.price}
            images={review.images}
            likeCount={review.likeCount}
            commentCount={review.commentCount}
          />
        )}

        {/* 댓글 영역 */}
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[15px] text-gray-900">댓글</span>
            <span className="text-[14px] text-gray-400">{comments.length}</span>
          </div>
        </div>

        <div className="px-5">
          {comments.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10">
              <span className="text-[14px] text-gray-400">첫 번째 댓글을 남겨보세요</span>
            </div>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onDelete={removeComment}
                isDeleting={isDeleting}
              />
            ))
          )}
        </div>
      </main>

      {/* 댓글 입력 바 */}
      <div className="shrink-0 px-4 py-2.5 border-t border-gray-100 flex gap-2 items-center bg-white">
        <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 h-10">
          <input
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="댓글을 입력하세요"
            className="flex-1 bg-transparent text-[14px] text-gray-800 outline-none placeholder:text-gray-400"
          />
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!commentInput.trim() || isSubmitting}
          className="size-10 rounded-full bg-primary-500 flex items-center justify-center text-white disabled:bg-gray-200 disabled:text-gray-400 shrink-0"
        >
          <SendIcon />
        </button>
      </div>

      <BottomNav activeTab="review" />
    </div>
  );
}
