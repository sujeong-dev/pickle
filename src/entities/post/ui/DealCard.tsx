import Image from "next/image";
import Link from "next/link";
import type { Post } from "../model/types";
import { cn } from "@/shared/lib/utils";
import { formatRelativeTime } from "@/shared/lib/formatRelativeTime";
import { ROUTES } from "@/shared/config/routes";
import { StarIcon, UserAvatar } from "@/shared/ui";

type DealCardProps = {
  post: Post;
  href?: string;
  likeButton?: React.ReactNode;
  wishlistButton?: React.ReactNode;
  reviewsHref?: string;
  className?: string;
};

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

function SoldOutWarningBadge() {
  return (
    <svg width="56" height="18" viewBox="0 0 56 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="품절주의" role="img">
      <rect x="0.5" y="0.5" width="55" height="17" rx="5.5" fill="#FFF7ED"/>
      <rect x="0.5" y="0.5" width="55" height="17" rx="5.5" stroke="#FED7AA"/>
      <path d="M15.865 12.0001L11.865 5.00011C11.7777 4.84621 11.6513 4.71821 11.4984 4.62915C11.3456 4.54009 11.1719 4.49316 10.995 4.49316C10.8181 4.49316 10.6443 4.54009 10.4915 4.62915C10.3387 4.71821 10.2122 4.84621 10.125 5.00011L6.12496 12.0001C6.03681 12.1528 5.99058 12.3261 5.99097 12.5024C5.99136 12.6787 6.03835 12.8517 6.12719 13.004C6.21602 13.1563 6.34354 13.2824 6.49681 13.3695C6.65009 13.4566 6.82367 13.5017 6.99996 13.5001H15C15.1754 13.4999 15.3477 13.4536 15.4996 13.3658C15.6515 13.2779 15.7776 13.1517 15.8652 12.9997C15.9529 12.8477 15.999 12.6753 15.9989 12.4999C15.9989 12.3244 15.9527 12.1521 15.865 12.0001Z" stroke="#EA580C" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11 7.5V9.5" stroke="#EA580C" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11 11.5H11.005" stroke="#EA580C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M27.6719 8.97656V9.67188H24.875V10.3516H26.8906V12.6094H21.9922V10.3516H24.0156V9.67188H21.2344V8.97656H27.6719ZM27.0781 5.84375V6.53906H26.1094V7.75H27.0391V8.45312H21.8516V7.75H22.7812V6.53906H21.8125V5.84375H27.0781ZM22.8516 11.0234V11.9062H26.0469V11.0234H22.8516ZM23.6484 7.75H25.2344V6.53906H23.6484V7.75ZM30.7188 6.67188C30.7109 7.42969 31.2891 8.21875 32.3672 8.53125L31.9609 9.21875C31.1602 8.98438 30.5938 8.48828 30.2812 7.86719C29.9609 8.55469 29.3672 9.11719 28.5469 9.375L28.1172 8.69531C29.2188 8.33594 29.8438 7.47656 29.8438 6.66406V6.64062H28.3594V5.9375H32.1797V6.64062H30.7188V6.67188ZM34.0625 5.63281V9.25H33.1953V7.82031H31.9844V7.125H33.1953V5.63281H34.0625ZM34.0625 9.54688V11.3828H30.2812V11.9375H34.2891V12.6172H29.4141V10.7344H33.1953V10.2344H29.4062V9.54688H34.0625ZM39.25 6.125C40.3672 6.11719 41.1875 6.82812 41.1953 7.82812C41.1875 8.83594 40.3672 9.53906 39.25 9.53906C38.1406 9.53906 37.3125 8.83594 37.3125 7.82812C37.3125 6.82812 38.1406 6.11719 39.25 6.125ZM39.25 6.875C38.6328 6.875 38.1719 7.24219 38.1719 7.82812C38.1719 8.42188 38.6328 8.78125 39.25 8.78125C39.875 8.78125 40.3438 8.42188 40.3438 7.82812C40.3438 7.24219 39.875 6.875 39.25 6.875ZM42.8438 5.63281V12.7031H41.9766V5.63281H42.8438ZM36.9922 10.5156C38.2656 10.5156 40.0312 10.5 41.5547 10.2812L41.625 10.9141C40.0391 11.2188 38.3438 11.2266 37.1016 11.2266L36.9922 10.5156ZM49.7578 5.64062V9.63281H48.8828V5.64062H49.7578ZM49.7578 9.98438V12.6094H45.0703V9.98438H49.7578ZM45.9297 10.6719V11.9062H48.9062V10.6719H45.9297ZM46.5078 6.59375C46.5078 7.49219 47.1094 8.33594 48.2109 8.6875L47.7891 9.35156C46.9727 9.09766 46.3867 8.57812 46.0703 7.89844C45.7461 8.62891 45.1523 9.21094 44.3047 9.49219L43.875 8.80469C45.0234 8.4375 45.6094 7.52344 45.6094 6.59375V5.90625H46.5078V6.59375Z" fill="#EA580C"/>
    </svg>
  );
}

function SoldOutBadge() {
  return (
    <svg width="38" height="16" viewBox="0 0 38 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="품절" role="img">
      <rect width="38" height="16" rx="4" fill="#424242"/>
      <path d="M10 13C12.7614 13 15 10.7614 15 8C15 5.23858 12.7614 3 10 3C7.23858 3 5 5.23858 5 8C5 10.7614 7.23858 13 10 13Z" stroke="white" strokeWidth="1.12167" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11.5 6.5L8.5 9.5" stroke="white" strokeWidth="1.12167" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8.5 6.5L11.5 9.5" stroke="white" strokeWidth="1.12167" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M26.6953 7.9375V8.72656H23.9453V9.33594H25.9219V11.6406H20.9609V9.33594H22.9531V8.72656H20.2109V7.9375H26.6953ZM26.1172 4.80469V5.60156H25.1875V6.6875H26.0703V7.48438H20.8281V6.6875H21.7031V5.60156H20.7812V4.80469H26.1172ZM21.9453 10.1094V10.8438H24.9453V10.1094H21.9453ZM22.7031 6.6875H24.1875V5.60156H22.7031V6.6875ZM31.1875 4.88281V5.67969H29.7734C29.8008 6.39062 30.3164 7.13281 31.3984 7.44531L30.9375 8.23438C30.1367 8.00391 29.5859 7.53125 29.2734 6.9375C28.9492 7.59375 28.3711 8.13281 27.5469 8.38281L27.0625 7.60938C28.1758 7.25391 28.7305 6.43359 28.7734 5.67969H27.3359V4.88281H31.1875ZM33.1172 4.60938V8.22656H32.125V6.85938H31.0078V6.07031H32.125V4.60938H33.1172ZM33.1172 8.5V10.4219H29.3906V10.875H33.3281V11.6484H28.3906V9.69531H32.125V9.28906H28.3828V8.5H33.1172Z" fill="white"/>
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

export function DealCard({ post, href, likeButton, wishlistButton, reviewsHref, className }: DealCardProps) {
  const {
    id,
    authorNickname,
    authorProfileImage,
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
    branch,
    productCode,
    soldOutStatus,
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
        <UserAvatar src={authorProfileImage} size={46} />
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <div className="flex gap-1 items-center">
            <span className="font-semibold text-subtitle text-gray-900 whitespace-nowrap">{authorNickname}</span>
            {/* TODO: Swagger 미존재 — 백엔드 확인 필요 */}
            {isVerified && <VerifiedBadge />}
          </div>
          <span className="text-[11.5px] text-gray-500">{formatRelativeTime(createdAt)}</span>
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
          {soldOutStatus === 'sold_out' && <div className="absolute top-2 left-2"><SoldOutBadge /></div>}
          {soldOutStatus === 'warning' && <div className="absolute top-2 left-2"><SoldOutWarningBadge /></div>}
        </div>
      ) : (
        <div className="relative w-full aspect-375/134 bg-gray-200 mt-0.5">
          {soldOutStatus === 'sold_out' && <div className="absolute top-2 left-2"><SoldOutBadge /></div>}
          {soldOutStatus === 'warning' && <div className="absolute top-2 left-2"><SoldOutWarningBadge /></div>}
        </div>
      )}

      {/* Product info */}
      <div className="flex gap-3 items-center px-5 py-3">
        <div className="size-[46px] rounded-[6px] bg-secondary-500 flex items-center justify-center shrink-0 px-1">
          <span className="font-bold text-subtitle text-white leading-none">{displayDiscountRate}%</span>
        </div>
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <span className="font-bold text-subtitle text-gray-900 truncate">{productName}</span>
          <div className="flex gap-[6px] items-baseline whitespace-nowrap">
            <span className="font-bold text-h2 text-gray-900">{price.toLocaleString()}원</span>
            <span className="text-caption text-gray-400 line-through">{(originalPrice ?? 0).toLocaleString()}원</span>
          </div>
        </div>
      </div>

      {/* Review row */}
      {reviewCount > 0 && (reviewsHref ? (
        <Link href={reviewsHref} className="relative z-[1] flex items-center gap-2 px-3 py-2 bg-[#FFFBEB] rounded-[6px] mx-0">
          <ReceiptIcon />
          <span className="font-medium text-body2 text-[#92400E]">영수증 인증 후기 {reviewCount}건</span>
          <div className="flex-1" />
          <div className="flex items-center gap-[2px]">
            <StarIcon size={13} />
            <span className="font-bold text-body2 text-[#F59E0B]">{displayRating}</span>
          </div>
          <ChevronRightIcon size={16} />
        </Link>
      ) : (
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
      ))}

      {/* Actions row */}
      <div className="relative flex items-center justify-between px-5 py-3">
        <div className="flex gap-5 items-center">
          {likeButton ?? (
            <div className="flex gap-[6px] items-center">
              <ThumbsUpIcon />
              <span className="text-subtitle text-gray-500">{likeCount}</span>
            </div>
          )}
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
        <Link href={ROUTES.relatedReports(id, { branch: branch ?? undefined, productCode: productCode ?? undefined })} className="relative flex items-center justify-between px-5 py-3 bg-primary-50">
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
