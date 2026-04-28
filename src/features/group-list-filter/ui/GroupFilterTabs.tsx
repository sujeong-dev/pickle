"use client";

import { cn } from "@/shared/lib/utils";
import { useGroupFilterStore } from "../model/useGroupFilterStore";

export function GroupFilterTabs() {
  const status = useGroupFilterStore((s) => s.status);
  const setStatus = useGroupFilterStore((s) => s.setStatus);

  const openOnly = status === "open";

  return (
    <div className="bg-white shrink-0 border-b border-gray-100">
      <div className="flex items-center justify-end px-5 py-3">
        <button
          type="button"
          onClick={() => setStatus(openOnly ? undefined : "open")}
          className={cn(
            "flex items-center gap-1.5 text-body2 transition-colors",
            openOnly ? "text-primary-600 font-semibold" : "text-gray-500",
          )}
        >
          <span
            className={cn(
              "size-4 rounded-full border-2 flex items-center justify-center transition-colors",
              openOnly ? "border-primary-500 bg-primary-500" : "border-gray-300",
            )}
          >
            {openOnly && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </span>
          모집중만 보기
        </button>
      </div>
    </div>
  );
}
