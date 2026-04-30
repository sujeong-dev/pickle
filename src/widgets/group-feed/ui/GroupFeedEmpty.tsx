"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui";
import { ROUTES } from "@/shared/config/routes";

export function GroupFeedEmpty() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center gap-3 px-5 py-16">
      <div className="size-16 rounded-full bg-primary-50 flex items-center justify-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2D8A5A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>
      <p className="text-subtitle text-gray-700">
        근처에 진행 중인 소분이 없어요
      </p>
      <Button size="md" width="140px" onClick={() => router.push(ROUTES.groupRegister)}>
        모집 등록하기
      </Button>
    </div>
  );
}
