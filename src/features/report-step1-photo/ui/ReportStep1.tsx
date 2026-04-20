"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { RemoveButton } from "@/shared/ui";
import { ScanIcon } from "@/shared/ui/icons";
import { useUploadPresigned, useOcrProduct, useOcrStatus } from "../api/useOcr";
import type { OcrResult } from "@/shared/api/report";

function TagIcon() {
  return (
    <svg width="31" height="31" viewBox="0 0 24 24" fill="none" stroke="#2D8A5A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

type ReportStep1Props = {
  photo: File | null;
  r2Key: string | null;
  jobId: string | null;
  ocrResult: OcrResult | null;
  onPhotoChange: (file: File) => void;
  onPhotoRemove: () => void;
  onR2KeyChange: (r2Key: string) => void;
  onJobIdChange: (jobId: string) => void;
  onOcrResultChange: (result: OcrResult) => void;
};

export function ReportStep1({
  photo,
  r2Key,
  jobId,
  ocrResult,
  onPhotoChange,
  onPhotoRemove,
  onR2KeyChange,
  onJobIdChange,
  onOcrResultChange,
}: ReportStep1Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: getPresigned, isPending: isPresignedPending } = useUploadPresigned();
  const { mutateAsync: requestOcr, isPending: isOcrPending } = useOcrProduct();
  const { data: ocrStatus } = useOcrStatus(jobId);

  const isOcrLoading =
    isPresignedPending ||
    isOcrPending ||
    (!!jobId && (ocrStatus?.status === "waiting" || ocrStatus?.status === "active"));

  // When OCR status becomes completed or failed, propagate result
  useEffect(() => {
    if (ocrStatus && (ocrStatus.status === "completed" || ocrStatus.status === "failed")) {
      onOcrResultChange(ocrStatus);
    }
  }, [ocrStatus, onOcrResultChange]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onPhotoChange(file);

    try {
      // 1. Get presigned URL
      const { uploadUrl, r2Key: newR2Key } = await getPresigned({
        fileType: file.type,
        purpose: 'post',
      });

      // 2. Upload to R2
      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      onR2KeyChange(newR2Key);

      // 3. Request OCR with r2Key
      const { jobId: newJobId } = await requestOcr({ r2Key: newR2Key });
      onJobIdChange(newJobId);
    } catch {
      // Error is handled centrally by kyInstance (toast shown)
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="font-bold text-[20px] text-gray-900 leading-normal">할인표 사진을 올려주세요</h2>
        <p className="text-[14px] text-gray-600 leading-normal">가격표나 할인 안내문을 촬영해주세요</p>
      </div>

      {photo ? (
        /* ── Uploaded state ── */
        <div className="relative w-full aspect-[335/255] bg-gray-200 rounded-[10px] overflow-hidden">
          <Image
            src={URL.createObjectURL(photo)}
            alt="할인표 사진"
            fill
            className="object-cover"
            unoptimized
          />
          {/* Remove button */}
          <div className="absolute top-3 right-3">
            <RemoveButton onClick={onPhotoRemove} aria-label="사진 삭제" />
          </div>
          {/* OCR badge / loading state */}
          <div className="absolute bottom-3 left-3 bg-primary-500 rounded-[4px] flex gap-1 items-center px-2 py-1">
            <ScanIcon />
            {isOcrLoading ? (
              <span className="font-bold text-[12px] text-white">OCR 인식 중...</span>
            ) : ocrResult?.status === "completed" ? (
              <span className="font-bold text-[12px] text-white">OCR 인식 완료</span>
            ) : ocrResult?.status === "failed" ? (
              <span className="font-bold text-[12px] text-white">OCR 인식 실패</span>
            ) : (
              <span className="font-bold text-[12px] text-white">OCR 인식 대상</span>
            )}
          </div>
          {/* Loading overlay */}
          {isOcrLoading && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="text-white text-[14px] font-semibold">AI가 이미지를 분석 중이에요...</span>
            </div>
          )}
        </div>
      ) : (
        /* ── Empty state ── */
        <>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="bg-gray-100 border border-dashed border-gray-300 rounded-[10px] h-[255px] flex flex-col gap-3 items-center justify-center w-full"
          >
            <div className="bg-primary-50 rounded-full size-[60px] flex items-center justify-center">
              <TagIcon />
            </div>
            <span className="font-semibold text-[16px] text-gray-800">할인표 촬영</span>
            <span className="text-[12px] text-gray-500">가격, 상품명이 잘 보이게</span>
          </button>

          <div className="bg-gray-100 rounded-[6px] flex gap-2 items-center px-3 py-2">
            <ScanIcon size={16} />
            <p className="text-[12px] text-gray-700 leading-normal">
              이 사진에서 AI가 상품명, 가격을 자동 인식합니다.
            </p>
          </div>
        </>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />

      {/* Hidden field to track r2Key for parent usage */}
      {r2Key && <input type="hidden" value={r2Key} readOnly />}
    </div>
  );
}
