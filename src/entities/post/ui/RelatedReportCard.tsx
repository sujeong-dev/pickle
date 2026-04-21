import type { Post } from "../model/types";
import { cn } from "@/shared/lib/utils";
import { formatRelativeTime } from "@/shared/lib/formatRelativeTime";

type RelatedReportCardProps = {
  post: Post;
  className?: string;
};

function Avatar({ name }: { name: string }) {
  return (
    <div className="size-11.5 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
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

export function RelatedReportCard({ post, className }: RelatedReportCardProps) {
  const {
    authorNickname,
    // TODO: Swagger 미존재 — 백엔드 확인 필요
    isVerified,
    createdAt,
    description,
    likeCount,
    commentCount,
  } = post;

  return (
    <article className={cn("bg-white flex flex-col gap-0.5 w-full", className)}>
      {/* Author row */}
      <div className="flex gap-2.5 items-center px-5 py-3">
        <Avatar name={authorNickname} />
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
        <p className="text-[15.4px] text-gray-800 leading-5.75">{description ?? ''}</p>
      </div>

      {/* Actions row */}
      <div className="flex gap-5 items-center px-5 py-3">
        <div className="flex gap-1.5 items-center">
          <ThumbsUpIcon />
          <span className="text-subtitle text-gray-500">{likeCount}</span>
        </div>
        <div className="flex gap-1.5 items-center">
          <CommentIcon />
          <span className="text-subtitle text-gray-500">{commentCount}</span>
        </div>
      </div>
    </article>
  );
}
