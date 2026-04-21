import Image from "next/image";
import type { ReceiptReview } from "../model/types";
import { StarIcon } from "@/shared/ui";
import { formatRelativeTime } from "@/shared/lib/formatRelativeTime";

type MyReceiptReviewCardProps = {
  review: ReceiptReview;
};

export function MyReceiptReviewCard({ review }: MyReceiptReviewCardProps) {
  const { rating, createdAt, itemCount, totalAmount, items } = review;

  return (
    <article className="flex flex-col gap-xs px-lg py-sm border-b border-gray-200 bg-white">
      {/* Row 1: 전체 평점 + 날짜 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-xs">
          <StarIcon size={16} color="#FF9500" />
          <span className="text-h2 font-bold text-warning">{rating}</span>
        </div>
        <span className="text-caption text-gray-500">{formatRelativeTime(createdAt)}</span>
      </div>

      {/* Row 2: 항목 수 + 구분자 + 합계 금액 */}
      <div className="flex items-center gap-xs">
        <span className="text-body1 text-gray-600">{itemCount}개 항목</span>
        <span className="text-body1 text-gray-400">·</span>
        <span className="text-body1 font-bold text-gray-900">
          {totalAmount.toLocaleString()}원
        </span>
      </div>

      {/* Row 3: 상품 썸네일 */}
      <div className="flex gap-xs">
        {items.map((item, index) => (
          <div
            key={index}
            className="relative size-16 rounded-sm bg-gray-200 overflow-hidden shrink-0"
          >
            {item.imageUrl && (
              <Image src={item.imageUrl} alt="" fill className="object-cover" />
            )}
            <div className="absolute bottom-0.5 left-[4px] flex items-center gap-0.5 bg-gray-600 px-1 py-0.5 rounded-[3px]">
              <StarIcon size={8} />
              <span className="text-[8px] font-bold text-white leading-none">
                {item.rating.toFixed(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
