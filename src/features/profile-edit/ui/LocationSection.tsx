"use client";

import { useState } from "react";
import { BottomSheet } from "@/shared/ui";
import { useToastStore } from "@/shared/model";
import { SetBoundaryStep, type SelectedLocation } from "@/features/set-boundary";
import { useMyProfile } from "../api/useProfile";
import { useUpdateLocation } from "../api/useUpdateLocation";

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#BDBDBD" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 4l4 4-4 4" />
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
    if (!location.sido || !location.sigungu) return;
    updateLocation(
      { sido: location.sido, sigungu: location.sigungu },
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
      <div className="bg-white px-5 shrink-0">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full flex flex-col gap-[6px] pt-[14px] pb-[17px] border-b border-gray-100 text-left"
        >
          <span className="text-[13.5px] font-semibold text-gray-500">내 동네</span>
          <div className="flex items-center justify-between">
            <span className={isSet ? "text-body1 text-gray-900" : "text-body1 text-gray-400"}>
              {isSet ? `${sido} ${sigungu}` : "동네를 설정해주세요"}
            </span>
            <ChevronRightIcon />
          </div>
        </button>
      </div>

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
