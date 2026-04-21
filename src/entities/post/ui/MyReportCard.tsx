import Image from "next/image";
import type { Post } from "../model/types";
import { ThumbsUpIcon, CommentIcon } from "@/shared/ui";

type MyReportCardProps = {
  post: Post;
};

export function MyReportCard({ post }: MyReportCardProps) {
  const { productName, discountRate, price, thumbnail, images, createdAt, likeCount, commentCount } = post;
  const thumbnailUrl = thumbnail ?? images?.[0]?.url;
  const displayDiscountRate = discountRate ?? 0;

  return (
    <article className="bg-white flex gap-[15px] items-start px-lg py-sm border-b border-gray-100">
      {/* 썸네일 */}
      <div className="shrink-0 size-20 rounded-xs bg-gray-200 overflow-hidden">
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
        {/* 상품명 */}
        <span className="text-h2 font-bold text-gray-900 truncate">
          {productName}
        </span>

        {/* 할인율 + 가격 */}
        <div className="flex items-baseline gap-2xs">
          <span className="text-body2 font-bold text-secondary-500">
            {displayDiscountRate}%
          </span>
          <span className="text-h3 font-bold text-gray-900">
            {price.toLocaleString()}원
          </span>
        </div>

        {/* 메타 정보 */}
        <div className="flex items-center gap-xs">
          <span className="text-caption text-gray-500">{createdAt}</span>
          <span className="text-caption text-gray-400">·</span>
          <div className="flex items-center gap-xs">
            <div className="flex items-center gap-2xs text-gray-500">
              <ThumbsUpIcon size={12} className="text-gray-500" />
              <span className="text-caption">{likeCount}</span>
            </div>
            <div className="flex items-center gap-2xs text-gray-500">
              <CommentIcon size={12} className="text-gray-500" />
              <span className="text-caption">{commentCount}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
