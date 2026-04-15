"use client";

import { ScanIcon } from '@/shared/ui/icons';
import type { ReviewItem } from "../model/useReviewStep2";

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2D8A5A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

type ReviewStep2Props = {
  items: ReviewItem[];
};

export function ReviewStep2({ items }: ReviewStep2Props) {
  const total = items.reduce((sum, item) => {
    const num = parseInt(item.price.replace(/[^0-9]/g, ""), 10);
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* OCR notice */}
      <div className="bg-primary-50 flex items-center gap-2 px-5 py-2 shrink-0">
        <ScanIcon size={16} />
        <span className="text-[12px] font-medium text-primary-500">{items.length}개 항목을 인식했어요!</span>
      </div>

      {/* Item list */}
      <div className="flex-1 overflow-y-auto min-h-0 px-5 py-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[16px] text-gray-900">인식된 항목</span>
          <span className="text-[12px] text-gray-500">탭하여 수정</span>
        </div>

        <div className="flex flex-col gap-1">
          {items.map((item, idx) => (
            <button
              key={idx}
              type="button"
              className="flex items-center gap-1 border-b border-gray-100 py-1 w-full text-left"
            >
              <div className="bg-primary-50 rounded-[4px] size-6 flex items-center justify-center shrink-0">
                <CheckIcon />
              </div>
              <div className="flex items-center justify-between flex-1 min-w-0 px-1">
                <span className="font-medium text-[14px] text-gray-900 truncate">{item.name}</span>
                <span className="font-bold text-[16px] text-gray-900 shrink-0 ml-2">{item.price}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-[14px] text-gray-600">총 {items.length}개 항목</span>
          <span className="font-bold text-[16px] text-gray-900">
            {total.toLocaleString("ko-KR")}원
          </span>
        </div>
      </div>
    </div>
  );
}
