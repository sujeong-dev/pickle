"use client";

import { DealCard } from "@/entities/post";
import type { Post } from "@/entities/post";
import { FeedEmpty } from "./FeedEmpty";
import { ROUTES } from "@/shared/config/routes";
import { WishlistButton } from "@/features/wishlist";
import { usePosts } from "../api/usePosts";

function FireIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="#E0421A" aria-hidden="true">
      <path d="M12 2C12 2 8 7 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 10 15 8 15 8C15 8 14 10 13 10C13 10 14 7 12 2Z" />
      <path d="M12 22C9.23858 22 7 19.7614 7 17C7 14 9 12 12 12C15 12 17 14 17 17C17 19.7614 14.7614 22 12 22Z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function SectionHeader({
  icon,
  title,
  showMore = false,
}: {
  icon: React.ReactNode;
  title: string;
  showMore?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-5">
      <div className="flex gap-[6px] items-center">
        {icon}
        <span className="font-bold text-h2 text-gray-900">{title}</span>
      </div>
      {showMore && (
        <button type="button" className="text-body2 text-gray-500">
          더보기 ›
        </button>
      )}
    </div>
  );
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
  const { data, isLoading, isError } = usePosts();

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 min-h-0">
        <FeedSkeleton />
      </div>
    );
  }

  if (isError || !data || data.data.length === 0) {
    return (
      <div className="flex flex-col flex-1 min-h-0">
        <FeedEmpty />
      </div>
    );
  }

  const posts: Post[] = data.data;
  const hotPost = posts[0];
  const recentPosts = posts.slice(1);

  return (
    <div className="flex flex-col">
      <section>
        <SectionHeader icon={<FireIcon />} title="지금 핫한" showMore />
        <DealCard
          post={hotPost}
          href={ROUTES.postDetail(hotPost.id)}
          wishlistButton={<WishlistButton postId={hotPost.id} />}
        />
      </section>
      <section>
        <SectionHeader icon={<ClockIcon />} title="최신 제보" />
        {recentPosts.map((post) => (
          <DealCard
            key={post.id}
            post={post}
            href={ROUTES.postDetail(post.id)}
            wishlistButton={<WishlistButton postId={post.id} />}
          />
        ))}
      </section>
    </div>
  );
}
