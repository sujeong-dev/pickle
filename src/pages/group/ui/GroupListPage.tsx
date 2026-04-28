"use client";

import Link from "next/link";
import { HomeHeader } from "@/widgets/home-header";
import { BottomNav } from "@/widgets/bottom-nav";
import { GroupFeed } from "@/widgets/group-feed";
import { GroupFilterTabs, useGroupFilterStore } from "@/features/group-list-filter";
import { ROUTES } from "@/shared/config/routes";

function PlusIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function GroupListPage() {
  const category = useGroupFilterStore((s) => s.category);
  const status = useGroupFilterStore((s) => s.status);

  const filters = {
    category: category === "all" ? undefined : category,
    status,
  };

  return (
    <div className="bg-gray-50 flex flex-col h-dvh">
      <HomeHeader />
      <GroupFilterTabs />
      <main className="flex-1 overflow-y-auto min-h-0">
        <GroupFeed filters={filters} />
      </main>

      <Link
        href={ROUTES.groupRegister}
        aria-label="소분 모집 등록"
        className="fixed bottom-[101px] right-5 size-[52px] rounded-full bg-primary-500 flex items-center justify-center shadow-[var(--shadow-fab)]"
      >
        <PlusIcon />
      </Link>
      <BottomNav activeTab="split" />
    </div>
  );
}
