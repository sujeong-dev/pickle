"use client";

import { useState } from "react";
import { BottomSheet } from "@/shared/ui";
import { useToastStore } from "@/shared/model";
import { SetBoundaryStep, type SelectedLocation } from "@/features/set-boundary";
import { useMyProfile } from "../api/useProfile";
import { useUpdateLocation } from "../api/useUpdateLocation";

function PinIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#424242" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9E9E9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function LocationSection() {
  const { data: profile } = useMyProfile();
  const { mutate: updateLocation, isPending } = useUpdateLocation();
  const [open, setOpen] = useState(false);

  const sido = profile?.sido ?? null;
  const sigungu = profile?.sigungu ?? null;
  const isSet = Boolean(sido && sigungu);

  function handleComplete(location: SelectedLocation) {
    if (!location.sido || !location.sigungu || !location.dongName) return;
    updateLocation(
      {
        sido: location.sido,
        sigungu: location.sigungu,
        dong: location.dongName,
        longitude: location.lng,
        latitude: location.lat,
      },
      {
        onSuccess: () => {
          useToastStore.getState().show("내 동네가 변경됐어요");
          setOpen(false);
        },
      },
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-4 border-b border-gray-100 px-5 py-[13px] bg-white"
      >
        <div className="shrink-0 size-6 flex items-center justify-center">
          <PinIcon />
        </div>
        <span className="flex-1 text-[16px] text-gray-900 text-left">내 동네 설정</span>
        <span className="text-[14px] text-gray-500 shrink-0">
          {isSet ? `${sido} ${sigungu}` : "설정 안 됨"}
        </span>
        <ChevronRightIcon />
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)}>
        <div className="h-[80vh] flex flex-col">
          <SetBoundaryStep
            onPrev={() => setOpen(false)}
            onComplete={isPending ? undefined : handleComplete}
          />
        </div>
      </BottomSheet>
    </>
  );
}
