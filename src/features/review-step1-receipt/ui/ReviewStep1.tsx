"use client";

import { useRef } from "react";
import Image from "next/image";
import { RemoveButton } from "@/shared/ui";
import { ScanIcon } from '@/shared/ui/icons';
import { useMutation } from "@tanstack/react-query";
import { getPresignedUrl } from "@/shared/api/report";
import { useRegisterReceipt } from "../api/useReceipt";
import type { ReceiptData } from "../model/useReviewStep1";

function DocumentIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2D8A5A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

type ReviewStep1Props = {
  receipt: File | null;
  receiptData: ReceiptData | null;
  onReceiptChange: (file: File) => void;
  onReceiptRemove: () => void;
  onReceiptDataChange: (data: ReceiptData) => void;
};

export function ReviewStep1({
  receipt,
  receiptData,
  onReceiptChange,
  onReceiptRemove,
  onReceiptDataChange,
}: ReviewStep1Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: getPresigned, isPending: isPresignedPending } = useMutation({
    mutationFn: (body: { filename: string; contentType: string }) => getPresignedUrl(body),
  });
  const { mutateAsync: registerReceiptMutation, isPending: isReceiptPending } = useRegisterReceipt();

  const isLoading = isPresignedPending || isReceiptPending;

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onReceiptChange(file);

    try {
      // 1. Get presigned URL and upload image
      const { presignedUrl, fileUrl } = await getPresigned({
        filename: file.name,
        contentType: file.type,
      });

      await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      // 2. Register receipt with uploaded image URL
      const result = await registerReceiptMutation({ imageUrl: fileUrl });
      onReceiptDataChange({
        receiptId: result.id,
        imageUrl: fileUrl,
        items: result.items,
        totalAmount: result.totalAmount,
      });
    } catch {
      // Error is handled centrally by kyInstance (toast shown)
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="font-bold text-[20px] text-gray-900 leading-normal">영수증 사진을 올려주세요</h2>
        <p className="text-[14px] text-gray-600 leading-normal">처음부터 끝까지 잘 나오게 올려주세요.</p>
      </div>

      {receipt ? (
        <div className="relative w-full aspect-[335/255] bg-gray-200 rounded-[10px] overflow-hidden">
          <Image
            src={URL.createObjectURL(receipt)}
            alt="영수증 사진"
            fill
            unoptimized
            className="object-cover"
          />
          <div className="absolute top-3 right-3">
            <RemoveButton onClick={onReceiptRemove} aria-label="사진 삭제" />
          </div>
          {isLoading && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="text-white text-[14px] font-semibold">AI가 영수증을 분석 중이에요...</span>
            </div>
          )}
          {receiptData && !isLoading && (
            <div className="absolute bottom-3 left-3 bg-primary-500 rounded-[4px] flex gap-1 items-center px-2 py-1">
              <ScanIcon />
              <span className="font-bold text-[12px] text-white">분석 완료</span>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="bg-gray-100 border border-dashed border-gray-300 rounded-[10px] h-[255px] flex flex-col gap-3 items-center justify-center w-full"
        >
          <div className="bg-primary-50 rounded-full size-[60px] flex items-center justify-center">
            <DocumentIcon />
          </div>
          <span className="font-semibold text-[16px] text-gray-800">영수증 촬영</span>
          <span className="text-[12px] text-gray-500">항목이 잘 보이게 찍어주세요</span>
        </button>
      )}

      <div className="bg-gray-100 rounded-[6px] flex gap-2 items-center px-3 py-2">
        <ScanIcon size={16} />
        <p className="text-[12px] text-gray-700 leading-normal">
          이 사진에서 AI가 상품명, 가격을 자동 인식합니다.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
