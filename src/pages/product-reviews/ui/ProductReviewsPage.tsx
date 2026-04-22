"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getPostDetail, getReviews, postKeys } from "@/shared/api";
import { ReviewCard } from "@/entities/review";
import { ROUTES } from "@/shared/config/routes";
import { StarIcon } from "@/shared/ui";
import type { PostDetail } from "@/entities/post";

type ProductReviewsPageProps = {
  postId: string;
  productId: string;
};

function ChevronLeftIcon() {
  return (
    <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ReviewsHeader() {
  const router = useRouter();
  return (
    <header className="flex items-center h-[50px] px-5 shrink-0 relative">
      <button type="button" aria-label="뒤로가기" onClick={() => router.back()}>
        <ChevronLeftIcon />
      </button>
      <span className="absolute left-1/2 -translate-x-1/2 font-bold text-h2 text-gray-900">인증 후기</span>
    </header>
  );
}

function ProductSummary({ post }: { post: PostDetail }) {
  const displayRating = post.avgRating ?? 0;
  const filledStars = Math.round(displayRating);
  const thumbnail = post.images?.[0]?.url;

  return (
    <div className="bg-[#FAFAFA] flex gap-4 items-center px-5 py-3 shrink-0">
      {thumbnail ? (
        <div className="relative size-16 rounded-[6px] overflow-hidden shrink-0">
          <Image src={thumbnail} alt={post.productName} fill className="object-cover" />
        </div>
      ) : (
        <div className="size-16 rounded-[6px] bg-gray-200 shrink-0" />
      )}
      <div className="flex flex-col gap-1.5">
        <span className="font-bold text-h2 text-gray-900">{post.productName}</span>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} size={14} filled={i < filledStars} />
            ))}
          </div>
          <span className="font-bold text-body2 text-[#F59E0B]">{displayRating.toFixed(1)}</span>
          <span className="text-body2 text-gray-400">후기 {post.reviewCount}건</span>
        </div>
      </div>
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="flex flex-col gap-3 px-5 py-3 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-32 rounded-xl bg-gray-100" />
      ))}
    </div>
  );
}

const reviewKeys = {
  byProduct: (productId: string) => ['reviews', 'product', productId] as const,
};

export function ProductReviewsPage({ postId, productId }: ProductReviewsPageProps) {
  const { data: post } = useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => getPostDetail(postId),
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: reviewKeys.byProduct(productId),
    queryFn: () => getReviews({ productId }),
    enabled: !!productId,
  });

  const reviews = data?.items ?? [];

  return (
    <div className="bg-white flex flex-col h-dvh">
      <ReviewsHeader />
      {post && <ProductSummary post={post} />}
      <div className="flex-1 overflow-y-auto min-h-0">
        {isLoading && <SkeletonList />}
        {!isLoading && isError && (
          <div className="flex flex-col flex-1 items-center justify-center gap-2 h-full">
            <span className="text-body2 text-gray-500">후기를 불러올 수 없어요.</span>
          </div>
        )}
        {!isLoading && !isError && reviews.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 h-full">
            <span className="text-body2 text-gray-500">아직 인증 후기가 없어요.</span>
          </div>
        )}
        {!isLoading && !isError && reviews.length > 0 && (
          <div className="flex flex-col">
            {reviews.map((review) => (
              <Link key={review.id} href={ROUTES.reviewDetail(review.id)}>
                <ReviewCard {...review} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
