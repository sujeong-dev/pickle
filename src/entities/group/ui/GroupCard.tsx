import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { formatMeetTime } from "@/shared/lib/formatMeetTime";
import { ROUTES } from "@/shared/config/routes";
import { StatusBadge } from "./StatusBadge";
import { GROUP_STORE_LABEL, type GroupListItem } from "../model/types";

function PinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
    </svg>
  );
}

type Props = {
  group: GroupListItem;
  className?: string;
};

export function GroupCard({ group, className }: Props) {
  const {
    id,
    productName,
    targetCount,
    currentCount,
    pricePerPerson,
    location,
    meetAt,
    status,
    store,
    branch,
    hostNickname,
    isMine,
    isParticipating,
  } = group;

  const progress = Math.min(100, Math.round((currentCount / targetCount) * 100));
  const storeLabel = [store ? GROUP_STORE_LABEL[store] : null, branch].filter(Boolean).join(" ");

  return (
    <Link
      href={ROUTES.groupDetail(id)}
      className={cn(
        "block bg-white px-5 py-4 border-b border-gray-100 active:bg-gray-50 transition-colors",
        className,
      )}
    >
      {/* 뱃지 행 */}
      <div className="flex items-center gap-1.5 mb-2">
        <StatusBadge status={status} />
        {isMine && (
          <span className="inline-flex items-center px-2 py-0.5 rounded font-semibold text-caption bg-primary-500 text-white">
            내 모집
          </span>
        )}
        {!isMine && isParticipating && (
          <span className="inline-flex items-center px-2 py-0.5 rounded font-semibold text-caption bg-primary-100 text-primary-700">
            참여중
          </span>
        )}
      </div>

      {/* 상품명 */}
      <h3 className="font-bold text-subtitle text-gray-900 leading-tight mb-2 line-clamp-2">
        {productName}
      </h3>

      {/* 매장/지점 */}
      {storeLabel && (
        <p className="text-body2 text-gray-500 mb-2">{storeLabel}</p>
      )}

      {/* 메타 정보 */}
      <div className="flex flex-col gap-1 mb-3">
        <div className="flex items-center gap-1 text-body2 text-gray-700">
          <PinIcon />
          <span className="truncate">{location}</span>
        </div>
        <div className="flex items-center gap-1 text-body2 text-gray-700">
          <ClockIcon />
          <span>{formatMeetTime(meetAt)}</span>
        </div>
      </div>

      {/* 진행도 게이지 */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              status === "done" ? "bg-gray-400" : "bg-primary-500",
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center gap-0.5 font-semibold text-caption text-gray-700">
          <PeopleIcon />
          <span>
            {currentCount}/{targetCount}
          </span>
        </div>
      </div>

      {/* 푸터: 가격 + 호스트 */}
      <div className="flex items-center justify-between">
        {pricePerPerson != null ? (
          <span className="font-bold text-subtitle text-gray-900">
            1인 {pricePerPerson.toLocaleString()}원
          </span>
        ) : (
          <span className="text-body2 text-gray-400">가격 미정</span>
        )}
        <span className="text-body2 text-gray-500">{hostNickname}</span>
      </div>
    </Link>
  );
}
