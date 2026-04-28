"use client";

import { Tab } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import { GROUP_CATEGORY_LABEL } from "@/entities/group";
import { useGroupFilterStore, type CategoryFilter } from "../model/useGroupFilterStore";

const TABS: { label: string; value: CategoryFilter }[] = [
  { label: "전체", value: "all" },
  { label: GROUP_CATEGORY_LABEL.share, value: "share" },
  { label: GROUP_CATEGORY_LABEL.split, value: "split" },
  { label: GROUP_CATEGORY_LABEL.group_buy, value: "group_buy" },
];

export function GroupFilterTabs() {
  const category = useGroupFilterStore((s) => s.category);
  const status = useGroupFilterStore((s) => s.status);
  const setCategory = useGroupFilterStore((s) => s.setCategory);
  const setStatus = useGroupFilterStore((s) => s.setStatus);

  const openOnly = status === "open";

  return (
    <div className="bg-white shrink-0">
      <Tab
        tabs={TABS}
        activeValue={category}
        onChange={(v) => setCategory(v as CategoryFilter)}
      />
      <div className="flex items-center justify-end px-5 py-2">
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
