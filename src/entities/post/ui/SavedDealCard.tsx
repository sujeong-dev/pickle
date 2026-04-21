import Image from "next/image";
import type { Post } from "../model/types";

type SavedDealCardProps = {
  post: Post;
};

function FilledHeartIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="#E0421A"
      stroke="#E0421A"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export function SavedDealCard({ post }: SavedDealCardProps) {
  const {
    authorNickname,
    createdAt,
    productName,
    price,
    thumbnail,
    discountRate,
    images,
  } = post;
  const thumbnailUrl = thumbnail ?? images?.[0]?.url;
  const displayDiscountRate = discountRate ?? 0;

  return (
    <article className="flex items-start gap-[18px] px-lg py-sm bg-white border-b border-gray-200">
      {/* 썸네일 */}
      <div className="shrink-0 size-20 rounded-[6px] bg-gray-200 overflow-hidden">
        {thumbnailUrl && (
          <Image
            src={thumbnailUrl}
            alt={productName}
            width={80}
            height={80}
            className="size-full object-cover"
          />
        )}
      </div>

      {/* 정보 */}
      <div className="flex flex-col h-20 justify-between flex-1 min-w-0">
        <span className="text-h2 font-bold text-gray-900 truncate">
          {productName}
        </span>

        <div className="flex items-baseline gap-xs">
          <span className="text-body2 font-bold text-secondary-500">
            {displayDiscountRate}%
          </span>
          <span className="text-h3 font-bold text-gray-900">
            {price.toLocaleString()}원
          </span>
        </div>

        <div className="flex items-center gap-xs">
          <span className="text-caption text-gray-500">{createdAt}</span>
          <span className="text-caption text-gray-400">·</span>
          <span className="text-caption text-gray-500">{authorNickname}</span>
        </div>
      </div>

      {/* 찜 해제 버튼 */}
      <button type="button" aria-label="찜 해제" className="shrink-0 mt-0.5">
        <FilledHeartIcon />
      </button>
    </article>
  );
}
