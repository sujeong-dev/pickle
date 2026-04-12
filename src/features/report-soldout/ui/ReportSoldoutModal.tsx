"use client";

import { BottomSheet, Button } from "@/shared/ui";

type ReportSoldoutModalProps = {
  open: boolean;
  onClose: () => void;
  onReport: () => void;
};

export function ReportSoldoutModal({ open, onClose, onReport }: ReportSoldoutModalProps) {
  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className='flex flex-col px-5 pt-6 pb-8'>
        {/* 아이콘 + 제목 + 설명 */}
        <div className='flex flex-col items-center gap-3 pb-8'>
          <div className='size-14 rounded-full bg-secondary-50 flex items-center justify-center'>
            <svg
              width='28'
              height='28'
              viewBox='0 0 24 24'
              fill='none'
              stroke='#E0421A'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              aria-hidden='true'
            >
              <path d='M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z' />
              <line x1='12' y1='9' x2='12' y2='13' />
              <line x1='12' y1='17' x2='12.01' y2='17' />
            </svg>
          </div>
          <h2 className='font-bold text-h2 text-gray-900'>품절 제보하기</h2>
          <p className='text-body2 text-gray-500 text-center leading-relaxed'>
            해당 상품이 품절되었나요?
            <br />
            3건 이상 제보 시 품절 의심으로 표시돼요.
          </p>
        </div>

        {/* 버튼 */}
        <div className='flex flex-col gap-3'>
          <Button variant='danger' onClick={onReport}>제보하기</Button>
          <Button variant='outline' onClick={onClose}>
            취소
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
