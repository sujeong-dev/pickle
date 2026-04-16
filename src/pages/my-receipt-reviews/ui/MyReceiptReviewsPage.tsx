"use client";

import { PageHeader } from "@/shared/ui";
import { MyReceiptReviewCard } from "@/entities/post";
import type { ReceiptReview } from "@/entities/post";
import { useMyReviews } from "@/features/my-receipt-reviews";
import type { MyReview } from "@/shared/api";

function toReceiptReview(myReview: MyReview): ReceiptReview {
  return {
    id: myReview.id,
    rating: myReview.rating,
    createdAt: myReview.createdAt,
    itemCount: myReview.itemCount,
    totalAmount: myReview.totalAmount,
    items: myReview.items.map((item) => ({
      imageUrl: item.imageUrl,
      rating: item.rating,
    })),
  };
}

export function MyReceiptReviewsPage() {
  const { data, isLoading } = useMyReviews();
  const reviews = data?.data.map(toReceiptReview) ?? [];

  return (
    <div className="bg-gray-50 flex flex-col h-dvh">
      <PageHeader title="내 영수증 후기" />
      <div className="flex-1 overflow-y-auto min-h-0 bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-body1 text-gray-400">불러오는 중...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-body1 text-gray-500">
              아직 작성한 영수증 후기가 없어요
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <MyReceiptReviewCard key={review.id} review={review} />
          ))
        )}
      </div>
    </div>
  );
}
