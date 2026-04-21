"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { DealCard } from "@/entities/post";
import type { Post } from "@/entities/post";
import { Tab } from "@/shared/ui";
import { FeedEmpty } from "./FeedEmpty";
import { ROUTES } from "@/shared/config/routes";
import { WishlistButton } from "@/features/wishlist";
import { usePosts } from "../api/usePosts";

const TABS = [
  { label: "핫한 제보", value: "most_liked" },
  { label: "최신 제보", value: "latest" },
] as const;

type SortValue = typeof TABS[number]["value"];

function isValidSort(value: string | null): value is SortValue {
  return value === "most_liked" || value === "latest";
}

function FeedSkeleton() {
  return (
    <div className="flex flex-col gap-3 px-5 py-3 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-28 rounded-xl bg-gray-100" />
      ))}
    </div>
  );
}

export function HomeFeed() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawSort = searchParams?.get("sort") ?? null;
  const activeSort: SortValue = isValidSort(rawSort) ? rawSort : "most_liked";

  const { data, isLoading, isError } = usePosts(activeSort);

  function handleTabChange(value: string) {
    router.replace(`${ROUTES.home}?sort=${value}`);
  }

  const posts: Post[] = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <>
      <Tab tabs={[...TABS]} activeValue={activeSort} onChange={handleTabChange} />
      <div className="flex-1 overflow-y-auto min-h-0">
        {isLoading && <FeedSkeleton />}
        {!isLoading && (isError || posts.length === 0) && (
          <div className="flex items-center justify-center h-full">
            <FeedEmpty />
          </div>
        )}
        {!isLoading && !isError && posts.length > 0 && (
          <div className="flex flex-col">
            {posts.map((post) => (
              <DealCard
                key={post.id}
                post={post}
                href={ROUTES.postDetail(post.id)}
                wishlistButton={<WishlistButton postId={post.id} />}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
