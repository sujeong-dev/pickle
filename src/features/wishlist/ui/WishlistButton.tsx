"use client";

import { useState, useEffect } from "react";
import { Toast } from "@/shared/ui";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={filled ? "#E0421A" : "none"}
      stroke={filled ? "#E0421A" : "#9E9E9E"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function ToastHeartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#E0421A" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

type WishlistButtonProps = {
  // TODO: use postId for API call when backend is ready
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  postId: string;
};

export function WishlistButton({ postId: _postId }: WishlistButtonProps) {
  const [isWished, setIsWished] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    if (!toastVisible) return;
    const timer = setTimeout(() => setToastVisible(false), 2000);
    return () => clearTimeout(timer);
  }, [toastVisible]);

  function handleToggle() {
    const next = !isWished;
    setIsWished(next);
    if (next) setToastVisible(true);
  }

  return (
    <>
      <button type="button" aria-label={isWished ? "찜 해제" : "찜하기"} onClick={handleToggle}>
        <HeartIcon filled={isWished} />
      </button>
      <Toast
        message="찜 목록에 저장되었어요"
        icon={<ToastHeartIcon />}
        visible={toastVisible}
        className="bg-[#FEF2F2] text-secondary-500"
      />
    </>
  );
}
