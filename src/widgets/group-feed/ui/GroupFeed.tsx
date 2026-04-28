"use client";

import { useEffect, useRef } from "react";
import { GroupCard } from "@/entities/group";
import type { GroupListItem } from "@/entities/group";
import type { GroupListParams } from "@/shared/api";
import { useGroups } from "../api/useGroups";
import { GroupFeedEmpty } from "./GroupFeedEmpty";

function FeedSkeleton() {
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
          <div className="h-1.5 bg-gray-100 rounded-full" />
        </div>
      ))}
    </div>
  );
}

type Props = {
  filters?: Omit<GroupListParams, "cursor" | "limit">;
};

export function GroupFeed({ filters }: Props) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGroups(filters);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const items: GroupListItem[] = data?.pages.flatMap((p) => p.items) ?? [];

  if (isLoading) return <FeedSkeleton />;
  if (isError) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-body2 text-gray-500">소분 목록을 불러올 수 없어요.</p>
      </div>
    );
  }
  if (items.length === 0) return <GroupFeedEmpty />;

  return (
    <div className="flex flex-col">
      {items.map((group) => (
        <GroupCard key={group.id} group={group} />
      ))}
      <div ref={sentinelRef} className="h-2" />
      {isFetchingNextPage && (
        <div className="flex items-center justify-center py-3">
          <span className="text-caption text-gray-400">불러오는 중…</span>
        </div>
      )}
    </div>
  );
}
