"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BottomSheet, Button } from "@/shared/ui";
import { useToastStore } from "@/shared/model";
import { useUpdateLocation } from "@/features/profile-edit";
import { SetBoundaryStep, type SelectedLocation } from "@/features/set-boundary";
import { ROUTES } from "@/shared/config/routes";

function PinIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2D8A5A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function LocationGuardSheet() {
  const router = useRouter();
  const [boundaryOpen, setBoundaryOpen] = useState(false);
  const { mutate: updateLocation, isPending } = useUpdateLocation();

  const goHome = () => router.replace(ROUTES.home);

  function handleComplete(location: SelectedLocation) {
    if (!location.sido || !location.sigungu) return;
    updateLocation(
      { sido: location.sido, sigungu: location.sigungu },
      {
        onSuccess: () => {
          useToastStore.getState().show("내 동네가 설정됐어요");
          setBoundaryOpen(false);
        },
      },
    );
  }

  return (
    <>
      <BottomSheet open={!boundaryOpen} onClose={goHome}>
        <div className="flex flex-col px-5 pt-6 pb-8">
          <div className="flex flex-col items-center gap-3 pb-6">
            <div className="size-14 rounded-full bg-primary-50 flex items-center justify-center">
              <PinIcon />
            </div>
            <h2 className="font-bold text-h2 text-gray-900">동네 인증이 필요해요</h2>
            <p className="text-body2 text-gray-500 text-center leading-relaxed">
              소분 모집 글은 같은 동네 이웃과만 함께해요.
              <br />
              내 동네를 먼저 설정해주세요.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button variant="primary" onClick={() => setBoundaryOpen(true)}>
              내 동네 설정하기
            </Button>
            <Button variant="outline" onClick={goHome}>
              홈으로
            </Button>
          </div>
        </div>
      </BottomSheet>

      <BottomSheet open={boundaryOpen} onClose={() => setBoundaryOpen(false)}>
        <div className="h-[80vh] flex flex-col">
          <SetBoundaryStep
            onPrev={() => setBoundaryOpen(false)}
            onComplete={isPending ? undefined : handleComplete}
          />
        </div>
      </BottomSheet>
    </>
  );
}
