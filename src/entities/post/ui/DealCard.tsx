import Image from "next/image";
import Link from "next/link";
import type { Post } from "../model/types";
import { cn } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/config/routes";
import { StarIcon } from "@/shared/ui";

type DealCardProps = {
  post: Post;
  href?: string;
  wishlistButton?: React.ReactNode;
  className?: string;
};

function Avatar({ name }: { name: string }) {
  return (
    <div className="size-[46px] rounded-full bg-primary-50 flex items-center justify-center shrink-0">
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true" aria-label={name}>
        <path
          d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
          fill="#2D8A5A"
          fillOpacity="0.5"
        />
        <path
          d="M20 21C20 18.2386 16.4183 16 12 16C7.58172 16 4 18.2386 4 21"
          stroke="#2D8A5A"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function VerifiedBadge() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-label="인증됨">
      <circle cx="8" cy="8" r="8" fill="#2D8A5A" />
      <path
        d="M4.5 8L7 10.5L11.5 6"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function ThumbsUpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9E9E9E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9E9E9E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#9E9E9E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function ChevronRightIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 4l4 4-4 4" />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

export function DealCard({ post, href, wishlistButton, className }: DealCardProps) {
  const {
    id,
    authorNickname,
    // TODO: Swagger 미존재 — 백엔드 확인 필요
    isVerified,
    createdAt,
    description,
    productName,
    price,
    originalPrice,
    thumbnail,
    avgRating,
    groupInfo,
    discountRate,
    reviewCount,
    likeCount,
    commentCount,
  } = post;
  const thumbnailUrl = thumbnail;
  const displayDiscountRate = discountRate ?? (originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0);
  const displayRating = avgRating ?? 0;
  const relatedCount = groupInfo?.count;

  return (
    <article className={cn("bg-white flex flex-col gap-[2px] w-full relative", className)}>
      {href && (
        <Link href={href} aria-label="제보 상세보기" className="absolute inset-0 z-0" />
      )}
      {/* Author row */}
      <div className="flex gap-2.5 items-center px-5 py-3">
        <Avatar name={authorNickname} />
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <div className="flex gap-1 items-center">
            <span className="font-semibold text-subtitle text-gray-900 whitespace-nowrap">{authorNickname}</span>
            {/* TODO: Swagger 미존재 — 백엔드 확인 필요 */}
            {isVerified && <VerifiedBadge />}
          </div>
          <span className="text-[11.5px] text-gray-500">{createdAt}</span>
        </div>
      </div>

      {/* Content */}
      <div className="px-5">
        <p className="text-[15.4px] text-gray-800">{description ?? ''}</p>
      </div>

      {/* Product image */}
      {thumbnailUrl ? (
        <div className="relative w-full aspect-375/134 mt-0.5">
          <Image src={thumbnailUrl} alt={productName} fill className="object-cover" />
        </div>
      ) : (
        <div className="w-full aspect-375/134 bg-gray-200 mt-0.5" />
      )}

      {/* Product info */}
      <div className="flex gap-3 items-center px-5 py-3">
        <div className="size-[46px] rounded-[6px] bg-secondary-500 flex items-center justify-center shrink-0 px-1">
          <span className="font-bold text-subtitle text-white leading-none">{displayDiscountRate}%</span>
        </div>
        <div className="flex flex-col justify-between h-[46px] flex-1 min-w-0">
          <span className="font-bold text-subtitle text-gray-900">{productName}</span>
          <div className="flex gap-[6px] items-baseline whitespace-nowrap">
            <span className="font-bold text-h2 text-gray-900">{price.toLocaleString()}원</span>
            <span className="text-caption text-gray-400 line-through">{(originalPrice ?? 0).toLocaleString()}원</span>
          </div>
        </div>
      </div>

      {/* Review row */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#FFFBEB] rounded-[6px] mx-0">
        <ReceiptIcon />
        <span className="font-medium text-body2 text-[#92400E]">영수증 인증 후기 {reviewCount}건</span>
        <div className="flex-1" />
        <div className="flex items-center gap-[2px]">
          <StarIcon size={13} />
          <span className="font-bold text-body2 text-[#F59E0B]">{displayRating}</span>
        </div>
        <ChevronRightIcon size={16} />
      </div>

      {/* Actions row */}
      <div className="relative z-10 flex items-center justify-between px-5 py-3">
        <div className="flex gap-5 items-center">
          <div className="flex gap-[6px] items-center">
            <ThumbsUpIcon />
            <span className="text-subtitle text-gray-500">{likeCount}</span>
          </div>
          <div className="flex gap-[6px] items-center">
            <CommentIcon />
            <span className="text-subtitle text-gray-500">{commentCount}</span>
          </div>
        </div>
        {wishlistButton ?? (
          <button type="button" aria-label="찜하기">
            <HeartIcon />
          </button>
        )}
      </div>

      {/* Related reports row */}
      {relatedCount != null && relatedCount > 0 && (
        <Link href={ROUTES.relatedReports(id)} className="relative z-10 flex items-center justify-between px-5 py-3 bg-primary-50">
          <div className="flex gap-2 items-center">
            <div className="flex -space-x-[18px]">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="size-[42px] rounded-full bg-white border-[3px] border-white flex items-center justify-center"
                >
                  <div className="size-9 rounded-full bg-primary-50 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#2D8A5A" fillOpacity="0.5" />
                      <path d="M20 21C20 18.2386 16.4183 16 12 16C7.58172 16 4 18.2386 4 21" stroke="#2D8A5A" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
            <span className="font-medium text-body2 text-primary-500">같은 상품 제보 {relatedCount}건 더</span>
          </div>
          <ChevronRightIcon size={16} />
        </Link>
      )}
    </article>
  );
}
