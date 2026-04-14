"use client";

import { useRef } from "react";
import Image from "next/image";
import { Input, StarIcon } from "@/shared/ui";


function CameraIcon() {
  return (
    <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="#9E9E9E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function StarBadgeIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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

type ReviewStep3Props = {
  itemName: string;
  itemPrice: string;
  currentIdx: number;
  total: number;
  photos: File[];
  representativeIdx: number;
  rating: number;
  comment: string;
  onAddPhoto: (file: File) => void;
  onRemovePhoto: (photoIdx: number) => void;
  onSetRepresentative: (photoIdx: number) => void;
  onRatingChange: (rating: number) => void;
  onCommentChange: (comment: string) => void;
};

export function ReviewStep3({
  itemName,
  itemPrice,
  currentIdx,
  total,
  photos,
  representativeIdx,
  rating,
  comment,
  onAddPhoto,
  onRemovePhoto,
  onSetRepresentative,
  onRatingChange,
  onCommentChange,
}: ReviewStep3Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const progress = (currentIdx + 1) / total;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onAddPhoto(file);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Progress bar */}
      <div className="flex items-center gap-2 px-5 py-1 shrink-0">
        <div className="flex items-baseline gap-0.5">
          <span className="font-bold text-[17px] text-primary-500">{currentIdx + 1}</span>
          <span className="text-[17px] text-gray-400"> / {total}</span>
        </div>
        <div className="flex-1 bg-gray-300 h-[6px] rounded-full overflow-hidden">
          <div
            className="bg-primary-500 h-full rounded-full transition-all"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Scrollable card */}
      <div className="flex-1 overflow-y-auto min-h-0 px-5 py-2">
        <div className="bg-gray-50 rounded-[10px] p-5 flex flex-col gap-4">
          {/* Item info */}
          <div className="flex items-center justify-between">
            <span className="font-bold text-[18px] text-gray-900">{itemName}</span>
            <span className="font-bold text-[16px] text-primary-500">{itemPrice}</span>
          </div>

          {/* Photo grid */}
          <div className="flex flex-col gap-1">
            <span className="text-[14px] font-semibold text-gray-900">상품사진</span>
            <div className="grid grid-cols-3 gap-1">
              {photos.length < 5 && (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="aspect-square bg-gray-100 border border-dashed border-gray-300 rounded-[8px] flex flex-col gap-0.5 items-center justify-center"
                >
                  <CameraIcon />
                  <span className="text-[13px] text-gray-400">{photos.length}/5</span>
                </button>
              )}
              {photos.map((file, idx) => (
                <div key={idx} className="aspect-square rounded-[8px] relative overflow-hidden bg-gray-200">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`상품사진 ${idx + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  {idx === representativeIdx ? (
                    <div className="absolute top-1.5 left-1.5 bg-primary-500 rounded-[2px] flex gap-0.5 items-center px-1 py-0.5">
                      <StarBadgeIcon />
                      <span className="text-[8px] font-bold text-white">대표</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSetRepresentative(idx)}
                      className="absolute top-1.5 left-1.5 bg-black/40 rounded-[2px] px-1 py-0.5"
                    >
                      <span className="text-[8px] text-white">대표 설정</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onRemovePhoto(idx)}
                    aria-label="사진 삭제"
                    className="absolute top-1.5 right-1.5 bg-black/50 rounded-full size-[23px] flex items-center justify-center"
                  >
                    <CloseIcon />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Star rating */}
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-[15px] text-gray-900">이 상품 어땠나요?</p>
            <div className="flex items-center justify-center gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <button key={i} type="button" onClick={() => onRatingChange(i + 1)}>
                  <StarIcon size={38} filled={i < rating} />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <Input
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            onClear={() => onCommentChange("")}
            placeholder="한 줄 후기를 입력해주세요"
          />
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
