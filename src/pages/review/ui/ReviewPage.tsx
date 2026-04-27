"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { HomeHeader } from "@/widgets/home-header";
import { BottomNav } from "@/widgets/bottom-nav";
import { ROUTES } from "@/shared/config/routes";
import { ReviewCard, ReviewEmptyState } from "@/entities/review";
import { getReviews } from "@/shared/api";

function PencilIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

const reviewKeys = {
  all: ['review'] as const,
  list: (postId: string) => [...reviewKeys.all, 'list', postId] as const,
  detail: (id: string) => [...reviewKeys.all, 'detail', id] as const,
};

export function ReviewPage() {
  const searchParams = useSearchParams();
  const postId = searchParams?.get("postId") ?? undefined;

  const { data, isLoading } = useQuery({
    queryKey: reviewKeys.list(postId ?? ""),
    queryFn: () => getReviews({ productId: postId }),
  });

  const reviews = data?.items ?? [];

  return (
    <div className="bg-gray-50 flex flex-col h-dvh">
      <HomeHeader />
      <main className="flex flex-col flex-1 overflow-y-auto min-h-0 gap-1">
        {isLoading ? null : reviews.length === 0
          ? <ReviewEmptyState />
          : reviews.map((review) => (
              <Link key={review.id} href={ROUTES.reviewDetail(review.id)}>
                <ReviewCard {...review} />
              </Link>
            ))
        }
      </main>
      <Link
        href={ROUTES.reviewWrite}
        aria-label="후기 등록"
        className="fixed bottom-[101px] right-5 size-[52px] rounded-full bg-primary-500 flex items-center justify-center shadow-[var(--shadow-fab)]"
      >
        <PencilIcon />
      </Link>
      <BottomNav activeTab="review" />
    </div>
  );
}
