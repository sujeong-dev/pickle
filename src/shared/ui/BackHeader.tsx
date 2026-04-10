"use client";

import { useRouter } from "next/navigation";

type BackHeaderProps = {
  onBack?: () => void;
};

function ChevronLeftIcon() {
  return (
    <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export function BackHeader({ onBack }: BackHeaderProps) {
  const router = useRouter();

  return (
    <header className="flex items-center h-[50px] px-5 shrink-0">
      <button type="button" aria-label="뒤로가기" onClick={onBack ?? (() => router.back())}>
        <ChevronLeftIcon />
      </button>
    </header>
  );
}
