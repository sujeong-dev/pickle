"use client";

import Link from "next/link";
import { HomeHeader } from "@/widgets/home-header";
import { BottomNav } from "@/widgets/bottom-nav";
import { GroupFeed } from "@/widgets/group-feed";
import { GroupFilterTabs, useGroupFilterStore } from "@/features/group-list-filter";
import { useMyProfile } from "@/features/profile-edit";
import { ROUTES } from "@/shared/config/routes";
import { LocationGuardSheet } from "./LocationGuardSheet";

function PlusIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ListSkeleton() {
  return (
    <div className="flex flex-col animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="px-5 py-4 border-b border-gray-100">
          <div className="flex gap-1.5 mb-2">
            <div className="h-5 w-12 bg-gray-100 rounded" />
            <div className="h-5 w-12 bg-gray-100 rounded" />
          </div>
          <div className="h-5 w-3/4 bg-gray-100 rounded mb-2" />
          <div className="h-4 w-1/2 bg-gray-100 rounded mb-3" />
        </div>
      ))}
    </div>
  );
}

export function GroupListPage() {
  const category = useGroupFilterStore((s) => s.category);
  const status = useGroupFilterStore((s) => s.status);
  const { data: profile, isLoading: isProfileLoading } = useMyProfile();
  const isLocationVerified = Boolean(profile?.sido && profile?.sigungu);

  const filters = {
    category: category === "all" ? undefined : category,
    status,
  };

  return (
    <div className="bg-gray-50 flex flex-col h-dvh">
      <HomeHeader />
      {isProfileLoading ? (
        <main className="flex-1 overflow-y-auto min-h-0">
          <ListSkeleton />
        </main>
      ) : !isLocationVerified ? (
        <>
          <main className="flex-1" />
          <LocationGuardSheet />
        </>
      ) : (
        <>
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
        </>
      )}
      <BottomNav activeTab="split" />
    </div>
  );
}
