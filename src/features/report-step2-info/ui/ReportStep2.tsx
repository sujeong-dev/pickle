"use client";

import { useRef } from "react";
import Image from "next/image";
import { Input, Textarea, StarIcon } from "@/shared/ui";

function CameraIcon() {
  return (
    <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="#9e9e9e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}


function CloseIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M1 1L9 9M9 1L1 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

type ReportStep2Props = {
  photos: File[];
  representativeIdx: number;
  productCode: string;
  productName: string;
  discountPrice: string;
  originalPrice: string;
  review: string;
  onAddPhoto: (file: File) => void;
  onRemovePhoto: (idx: number) => void;
  onSetRepresentative: (idx: number) => void;
  onProductCodeChange: (v: string) => void;
  onProductNameChange: (v: string) => void;
  onDiscountPriceChange: (v: string) => void;
  onOriginalPriceChange: (v: string) => void;
  onReviewChange: (v: string) => void;
};

export function ReportStep2({
  photos,
  representativeIdx,
  productCode,
  productName,
  discountPrice,
  originalPrice,
  review,
  onAddPhoto,
  onRemovePhoto,
  onSetRepresentative,
  onProductCodeChange,
  onProductNameChange,
  onDiscountPriceChange,
  onOriginalPriceChange,
  onReviewChange,
}: ReportStep2Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onAddPhoto(file);
    e.target.value = "";
  };

  return (
    <div className='flex flex-col gap-3'>
      {/* Photo section */}
      <div className='flex flex-col gap-1'>
        <span className='text-[14px] font-semibold text-gray-900'>
          상품사진
        </span>
        <div className='grid grid-cols-3 gap-1'>
          {photos.length < 5 && (
            <button
              type='button'
              onClick={() => inputRef.current?.click()}
              className='aspect-square bg-gray-100 border border-dashed border-gray-300 rounded-[8px] flex flex-col gap-0.5 items-center justify-center'
            >
              <CameraIcon />
              <span className='text-[13px] text-gray-400'>
                {photos.length}/5
              </span>
            </button>
          )}
          {photos.map((file, idx) => (
            <div
              key={idx}
              className='aspect-square rounded-[8px] relative overflow-hidden bg-gray-200'
            >
              <Image
                src={URL.createObjectURL(file)}
                alt={`상품사진 ${idx + 1}`}
                fill
                unoptimized
                className='object-cover'
              />
              {/* Representative / set representative badge */}
              {idx === representativeIdx ? (
                <div className='absolute top-1.5 left-1.5 bg-primary-500 rounded-[2px] flex gap-0.5 items-center px-1 py-0.5'>
                  <StarIcon size={8} color="white" />
                  <span className='text-[8px] font-bold text-white'>대표</span>
                </div>
              ) : (
                <button
                  type='button'
                  onClick={() => onSetRepresentative(idx)}
                  className='absolute top-1.5 left-1.5 bg-black/40 rounded-[2px] px-1 py-0.5'
                >
                  <span className='text-[8px] text-white'>대표 설정</span>
                </button>
              )}
              {/* Remove button */}
              <button
                type='button'
                onClick={() => onRemovePhoto(idx)}
                aria-label='사진 삭제'
                className='absolute top-1.5 right-1.5 bg-black/50 rounded-full size-[23px] flex items-center justify-center'
              >
                <CloseIcon />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Form fields */}
      <div className='flex flex-col gap-3'>
        <div className='flex flex-col gap-1'>
          <label className='text-[14px] font-semibold text-gray-900'>
            상품코드
          </label>
          <Input
            value={productCode}
            onChange={(e) => onProductCodeChange(e.target.value)}
            onClear={() => onProductCodeChange('')}
            placeholder='상품코드를 입력해주세요'
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-[14px] font-semibold text-gray-900'>
            상품명
          </label>
          <Input
            value={productName}
            onChange={(e) => onProductNameChange(e.target.value)}
            onClear={() => onProductNameChange('')}
            placeholder='상품명을 입력해주세요'
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-[14px] font-semibold text-gray-900'>
            할인가
          </label>
          <Input
            value={discountPrice}
            onChange={(e) => onDiscountPriceChange(e.target.value)}
            onClear={() => onDiscountPriceChange('')}
            placeholder='할인가를 입력해주세요'
            inputMode='numeric'
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-[14px] font-semibold text-gray-900'>
            원가
          </label>
          <Input
            value={originalPrice}
            onChange={(e) => onOriginalPriceChange(e.target.value)}
            onClear={() => onOriginalPriceChange('')}
            placeholder='원가를 입력해주세요'
            inputMode='numeric'
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-[14px] font-semibold text-gray-900'>
            제보 글
          </label>
          <Textarea
            value={review}
            onChange={(e) => onReviewChange(e.target.value)}
            placeholder='어떤 할인을 발견했나요? 매장 상황, 재고, 꿀팁을 자유롭게 적어주세요'
            maxLength={300}
            rows={4}
          />
        </div>
      </div>

      <input
        ref={inputRef}
        type='file'
        accept='image/*'
        capture='environment'
        className='hidden'
        onChange={handleFileChange}
      />
    </div>
  );
}
