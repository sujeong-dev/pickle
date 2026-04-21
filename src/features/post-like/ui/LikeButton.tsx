"use client";

import { useState } from "react";
import { useToggleLike } from "../api/useToggleLike";

function ThumbsUpIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? "#2D8A5A" : "none"}
      stroke={filled ? "#2D8A5A" : "#9E9E9E"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

type LikeButtonProps = {
  postId: string;
  initialLiked?: boolean;
  initialCount: number;
};

export function LikeButton({ postId, initialLiked = false, initialCount }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const { mutate: toggleLike } = useToggleLike(postId);

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    toggleLike(undefined, {
      onSuccess: (data) => {
        setIsLiked(data.isLiked);
        if (data.likeCount != null) setLikeCount(data.likeCount);
      },
    });
  }

  return (
    <button
      type="button"
      aria-label={isLiked ? "좋아요 취소" : "좋아요"}
      onClick={handleToggle}
      className="flex gap-[6px] items-center"
    >
      <ThumbsUpIcon filled={isLiked} />
      <span className={`text-subtitle ${isLiked ? "text-primary-500 font-semibold" : "text-gray-500"}`}>
        {likeCount}
      </span>
    </button>
  );
}
