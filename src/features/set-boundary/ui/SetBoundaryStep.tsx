"use client";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { useSetBoundary } from "../model/useSetBoundary";
import { NaverMap } from "./NaverMap";
import type { SelectedLocation } from "../model/useSetBoundary";

interface SetBoundaryStepProps {
  onPrev?: () => void;
  onComplete?: (location: SelectedLocation) => void;
}

export function SetBoundaryStep({ onPrev, onComplete }: SetBoundaryStepProps) {
  const { selectedLocation, setSelectedLocation, clearLocation, isSelected } =
    useSetBoundary();
  
  console.log(isSelected, selectedLocation);

  function handleLocationChange(location: SelectedLocation) {
    setSelectedLocation(location);
  }

  function handleClearSearch() {
    clearLocation();
  }

  function handleComplete() {
    if (selectedLocation) {
      onComplete?.(selectedLocation);
    }
  }

  return (
    <main className="flex flex-col h-svh bg-white max-w-97.5 mx-auto w-full">
      {/* Header */}
      <section className="flex-none px-5 py-3 flex flex-col gap-2">
        <h1 className="text-[26px] font-bold text-gray-900 leading-tight">
          내 동네를 설정해주세요
        </h1>
        <p className="text-body2 text-gray-600">
          가까운 매장의 할인 정보를 받아볼 수 있어요
        </p>
      </section>

      {/* Search display */}
      {/* <div className="flex-none px-5 py-3">
        <div
          className={cn(
            "flex items-center gap-2 h-13.5 px-4 rounded-sm border",
            isSelected
              ? "bg-gray-50 border-primary-500"
              : "bg-gray-50 border-gray-300",
          )}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            className="shrink-0"
          >
            <circle
              cx="9"
              cy="9"
              r="6"
              stroke={isSelected ? "#2D8A5A" : "#BDBDBD"}
              strokeWidth="1.5"
            />
            <path
              d="M13.5 13.5L17 17"
              stroke={isSelected ? "#2D8A5A" : "#BDBDBD"}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>

          <span
            className={cn(
              "flex-1 text-[15px]",
              isSelected ? "text-gray-900 font-medium" : "text-gray-400",
            )}
          >
            {isSelected ? selectedLocation!.dongName : "동네 이름으로 검색"}
          </span>

          {isSelected && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="shrink-0 flex items-center justify-center size-6 rounded-full bg-gray-200"
              aria-label="검색 지우기"
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M1 1L9 9M9 1L1 9"
                  stroke="#757575"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div> */}

      {/* Map */}
      <div className="flex-1 min-h-0 px-5">
        <NaverMap
          onLocationChange={handleLocationChange}
        />
      </div>

      {/* Location status */}
      <div className="flex-none px-5 py-3">
        <div
          className={cn(
            "flex items-center gap-2 p-3 rounded-sm",
            isSelected ? "bg-primary-50" : "bg-gray-100",
          )}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            className="shrink-0"
          >
            <path
              d="M10 1C6.686 1 4 3.686 4 7c0 4.97 6 12 6 12s6-7.03 6-12c0-3.314-2.686-6-6-6Z"
              stroke={isSelected ? "#2D8A5A" : "#9E9E9E"}
              strokeWidth="1.5"
              fill="none"
            />
            <circle
              cx="10"
              cy="7"
              r="2"
              stroke={isSelected ? "#2D8A5A" : "#9E9E9E"}
              strokeWidth="1.5"
            />
          </svg>

          <span
            className={cn(
              "text-base",
              isSelected ? "font-bold text-gray-900" : "text-gray-500",
            )}
          >
            {isSelected
              ? selectedLocation!.address
              : "지도를 움직여 핀을 설정해주세요"}
          </span>
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="flex-none px-5 pb-5 flex gap-2">
        <button
          type="button"
          onClick={onPrev}
          className="flex-1 h-14 rounded-[10px] bg-gray-200 text-gray-400 text-xl font-medium"
        >
          이전
        </button>
        <Button
          variant="primary"
          size="lg"
          disabled={!isSelected}
          className="flex-1"
          onClick={handleComplete}
        >
          완료
        </Button>
      </div>
    </main>
  );
}
