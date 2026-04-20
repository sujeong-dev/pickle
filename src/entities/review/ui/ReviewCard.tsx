import Image from "next/image";
import type { Review } from "../model/types";
import { StarIcon } from "@/shared/ui";

function formatRelativeTime(createdAt: string): string {
  const diff = Date.now() - new Date(createdAt).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '방금';
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

function UserAvatarIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#2D8A5A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LikeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9E9E9E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
      <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
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

export function ReviewCard({ authorNickname, createdAt, content, productName, rating, likeCount, commentCount, images }: Review) {
  const thumbnailUrl = images?.[0]?.url;

  return (
    <div className="bg-white flex flex-col gap-[2px] w-full">
      {/* 유저 정보 */}
      <div className="flex gap-[10px] items-center px-5 py-3">
        <div className="bg-primary-50 flex items-center justify-center rounded-full shrink-0 size-[46px]">
          <UserAvatarIcon />
        </div>
        <div className="flex flex-col gap-[2px] flex-1 min-w-0">
          <span className="font-semibold text-[16px] text-gray-900 truncate">{authorNickname}</span>
          <span className="text-gray-500 text-[11.5px] leading-[17px]">{formatRelativeTime(createdAt)}</span>
        </div>
      </div>

      {/* 후기 텍스트 */}
      {content && (
        <div className="px-5">
          <p className="text-gray-800 text-[15.4px] leading-[23px]">{content}</p>
        </div>
      )}

      {/* 상품 이미지 */}
      <div className="flex items-center overflow-hidden px-5 py-3">
        <div className="flex flex-col gap-1 shrink-0 w-[100px]">
          <div className="bg-gray-200 relative rounded-[8px] size-[100px]">
            {thumbnailUrl && (
              <Image src={thumbnailUrl} alt={productName} fill className="object-cover rounded-[8px]" />
            )}
            <div className="absolute bottom-1 flex gap-[2px] items-center justify-center left-1 bg-gray-600 px-1 py-0.5 rounded-[3px]">
              <StarIcon size={12} />
              <span className="font-bold text-[12px] text-white leading-none">{rating.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-gray-700 text-[12px] text-center leading-none truncate">{productName}</p>
        </div>
      </div>

      {/* 좋아요 / 댓글 */}
      {/* TODO: Swagger 미존재 — 백엔드 확인 필요 */}
      <div className="flex items-center px-5 py-3">
        <div className="flex gap-5 items-center">
          <div className="flex gap-1.5 items-center">
            <LikeIcon />
            <span className="text-gray-500 text-[16px] leading-none">{likeCount ?? 0}</span>
          </div>
          <div className="flex items-center" style={{ gap: "5.77px" }}>
            <CommentIcon />
            <span className="text-gray-500 text-[16px] leading-none">{commentCount ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
