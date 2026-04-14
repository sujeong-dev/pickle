import type { Review } from "../model/types";
import { StarIcon } from "@/shared/ui";

function UserAvatarIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#2D8A5A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function VerifiedBadgeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#2D8A5A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="#2D8A5A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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

export function ReviewCard({ username, timeAgo, content, productName, rating, likeCount, commentCount }: Review) {
  return (
    <div className="bg-white flex flex-col gap-[2px] w-full">
      {/* 유저 정보 */}
      <div className="flex gap-[10px] items-center px-5 py-3">
        <div className="bg-primary-50 flex items-center justify-center rounded-full shrink-0 size-[46px]">
          <UserAvatarIcon />
        </div>
        <div className="flex flex-col gap-[2px] flex-1 min-w-0">
          <div className="flex gap-1 items-center">
            <span className="font-semibold text-[16px] text-gray-900 truncate">{username}</span>
            <VerifiedBadgeIcon />
          </div>
          <span className="text-gray-500 text-[11.5px] leading-[17px]">{timeAgo}</span>
        </div>
      </div>

      {/* 후기 텍스트 */}
      <div className="px-5">
        <p className="text-gray-800 text-[15.4px] leading-[23px]">{content}</p>
      </div>

      {/* 상품 이미지 */}
      <div className="flex items-center overflow-hidden px-5 py-3">
        <div className="flex flex-col gap-1 shrink-0 w-[100px]">
          <div className="bg-gray-200 relative rounded-[8px] size-[100px]">
            <div className="absolute bottom-1 flex gap-[2px] items-center justify-center left-1 bg-gray-600 px-1 py-0.5 rounded-[3px]">
              <StarIcon size={12} />
              <span className="font-bold text-[12px] text-white leading-none">{rating.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-gray-700 text-[12px] text-center leading-none truncate">{productName}</p>
        </div>
      </div>

      {/* 좋아요 / 댓글 */}
      <div className="flex items-center px-5 py-3">
        <div className="flex gap-5 items-center">
          <div className="flex gap-1.5 items-center">
            <LikeIcon />
            <span className="text-gray-500 text-[16px] leading-none">{likeCount}</span>
          </div>
          <div className="flex items-center" style={{ gap: "5.77px" }}>
            <CommentIcon />
            <span className="text-gray-500 text-[16px] leading-none">{commentCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
