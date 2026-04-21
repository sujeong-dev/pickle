"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui";
import { ROUTES } from "@/shared/config/routes";

function TagIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2D8A5A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function FeedEmpty() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center gap-6 flex-1 min-h-0 px-8">
      <div className="size-[60px] rounded-full bg-primary-50 flex items-center justify-center shrink-0">
        <TagIcon />
      </div>
      <div className="flex flex-col gap-2 items-center text-center w-full">
        <p className="font-bold text-[21.2px] leading-[31.7px] text-gray-800">아직 제보가 없어요</p>
        <p className="text-[15.4px] leading-[23px] text-gray-500">첫 번째 할인 제보를 공유해보세요!</p>
      </div>
      <Button size='md' className="px-2xl" onClick={() => router.push(ROUTES.report)}>
        제보하기
      </Button>
    </div>
  );
}
