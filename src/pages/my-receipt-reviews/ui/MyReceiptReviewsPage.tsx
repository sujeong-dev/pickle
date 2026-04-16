import { PageHeader } from "@/shared/ui";
import { MyReceiptReviewCard } from "@/entities/post";
import type { ReceiptReview } from "@/entities/post";

const MOCK_REVIEWS: ReceiptReview[] = [
  {
    id: "1",
    rating: 4.5,
    createdAt: "2일 전",
    itemCount: 4,
    totalAmount: 87300,
    items: [
      { rating: 5.0 },
      { rating: 4.0 },
      { rating: 4.5 },
      { rating: 4.5 },
    ],
  },
  {
    id: "2",
    rating: 3.5,
    createdAt: "5일 전",
    itemCount: 2,
    totalAmount: 23800,
    items: [
      { rating: 4.0 },
      { rating: 3.0 },
    ],
  },
  {
    id: "3",
    rating: 5.0,
    createdAt: "1주 전",
    itemCount: 6,
    totalAmount: 132000,
    items: [
      { rating: 5.0 },
      { rating: 5.0 },
      { rating: 5.0 },
    ],
  },
];

export function MyReceiptReviewsPage() {
  const reviews = MOCK_REVIEWS;

  return (
    <div className="bg-gray-50 flex flex-col h-dvh">
      <PageHeader title="내 영수증 후기" />
      <div className="flex-1 overflow-y-auto min-h-0 bg-white">
        {reviews.length === 0 ? (
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
