"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { recognizeReceiptWithAnnotations } from "@/shared/lib/googleVision";
import { maskCardNumbers } from "@/shared/lib/maskCardNumbers";
import { useToastStore } from "@/shared/model";
import { getPresignedUrl, enqueueReceiptOcr, type OcrReceiptItem } from "@/shared/api";
import type { OcrReceiptData } from "../model/useReviewStep1";
import { useReceiptOcr } from "../api/useReceiptOcr";

type View = "upload" | "processing" | "confirm" | "error" | "form";

type ReviewStep1Props = {
  onReceiptDataChange: (data: OcrReceiptData) => void;
  onMaskedImageReady?: (blob: Blob) => void;
};

function CameraIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2D8A5A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function AlertCircleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function SmallCheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#2D8A5A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const TIPS = [
  "영수증 전체가 화면에 들어오게 찍어주세요",
  "밝은 곳에서 흔들림 없이 찍어주세요",
  "글씨가 선명하게 보이는지 확인해주세요",
];

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ReviewStep1({ onReceiptDataChange, onMaskedImageReady }: ReviewStep1Props) {
  const [view, setView] = useState<View>("upload");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [r2Key, setR2Key] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [pendingData, setPendingData] = useState<OcrReceiptData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [branch, setBranch] = useState("");
  const [purchasedAt, setPurchasedAt] = useState("");
  const [manualItems, setManualItems] = useState<OcrReceiptItem[]>([]);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemCode, setItemCode] = useState("");

  const ocrOutcome = useReceiptOcr(jobId);

  useEffect(() => {
    if (!jobId) return;
    if (ocrOutcome.kind === "completed" && r2Key) {
      setPendingData({ ...ocrOutcome.result, r2Key });
      setView("confirm");
      setJobId(null);
    } else if (ocrOutcome.kind === "failed") {
      useToastStore.getState().show("영수증 분석에 실패했어요. 다시 시도해주세요.");
      resetAll();
    } else if (ocrOutcome.kind === "timeout") {
      useToastStore.getState().show("영수증 분석이 오래 걸리고 있어요. 다시 시도해주세요.");
      resetAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ocrOutcome.kind, r2Key]);

  const resetAll = () => {
    setPreviewUrl(null);
    setR2Key(null);
    setJobId(null);
    setPendingData(null);
    setView("upload");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    setView("processing");

    // 1) Google Vision으로 마스킹 좌표 추출
    let wordAnnotations;
    try {
      const base64 = await fileToBase64(file);
      const result = await recognizeReceiptWithAnnotations(base64);
      wordAnnotations = result.wordAnnotations;
    } catch {
      useToastStore.getState().show("영수증 인식에 실패했어요. 다시 시도해주세요.");
      resetAll();
      return;
    }

    // 2) 회원번호 마스킹 — 실패 시 업로드 중단 (개인정보 보호)
    let maskedBlob: Blob;
    try {
      maskedBlob = await maskCardNumbers(file, wordAnnotations);
    } catch {
      useToastStore.getState().show("영수증 마스킹에 실패했어요. 다시 시도해주세요.");
      resetAll();
      return;
    }
    setPreviewUrl(URL.createObjectURL(maskedBlob));
    onMaskedImageReady?.(maskedBlob);

    // 3) presigned URL 발급 → R2 업로드
    let uploadedR2Key: string;
    try {
      const presigned = await getPresignedUrl({
        fileType: maskedBlob.type || "image/jpeg",
        purpose: "receipt",
      });
      const putRes = await fetch(presigned.uploadUrl, {
        method: "PUT",
        body: maskedBlob,
        headers: { "Content-Type": maskedBlob.type || "image/jpeg" },
      });
      if (!putRes.ok) throw new Error("upload failed");
      uploadedR2Key = presigned.r2Key;
      setR2Key(uploadedR2Key);
    } catch {
      useToastStore.getState().show("영수증 업로드에 실패했어요. 다시 시도해주세요.");
      resetAll();
      return;
    }

    // 4) OCR 큐잉 → jobId 받고 폴링 시작
    try {
      const { jobId: newJobId } = await enqueueReceiptOcr({ r2Key: uploadedR2Key });
      setJobId(newJobId);
    } catch {
      useToastStore.getState().show("영수증 분석 요청에 실패했어요.");
      resetAll();
    }
  };

  const handleRetake = () => {
    resetAll();
  };

  const handleAddItem = () => {
    const name = itemName.trim();
    const price = Number(itemPrice);
    if (!name || !price) return;
    setManualItems((prev) => [
      ...prev,
      {
        productCode: itemCode.trim(),
        productName: name,
        quantity: 1,
        unitPrice: price,
        finalPrice: price,
      },
    ]);
    setItemName("");
    setItemPrice("");
    setItemCode("");
  };

  const handleManualSubmit = () => {
    // 수기 입력은 r2Key가 없어 추후 createReceipt가 실패할 수 있음 — 별도 정책 정의 필요
    onReceiptDataChange({
      store: null,
      branch,
      totalAmount: manualItems.reduce((s, i) => s + i.finalPrice, 0),
      itemCount: manualItems.length,
      purchasedAt,
      r2Key: r2Key ?? "",
      items: manualItems,
    });
  };

  if (view === "upload") {
    return (
      <div className="flex flex-col gap-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-3 w-full h-63.75 rounded-[10px] bg-gray-100 border-2 border-dashed border-gray-300"
        >
          <div className="size-15 rounded-full bg-primary-50 flex items-center justify-center">
            <CameraIcon />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-semibold text-subtitle text-gray-800">영수증 촬영</span>
            <span className="text-caption text-gray-500">항목이 잘 보이게 찍어주세요</span>
          </div>
        </button>

        <div className="bg-gray-100 rounded-sm px-4 py-3">
          <p className="text-caption text-gray-500 text-center">
            이 사진에서 AI가 상품명, 가격을 자동 인식합니다.
          </p>
        </div>
      </div>
    );
  }

  if (view === "processing") {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center justify-center gap-4 w-full h-63.75 rounded-[10px] bg-gray-100 border-2 border-dashed border-gray-300">
          {previewUrl && (
            <Image src={previewUrl} alt="업로드된 영수증" width={120} height={128} className="object-contain rounded" />
          )}
          <div className="flex items-center gap-2">
            <svg className="animate-spin size-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="text-body2 text-gray-500">영수증 인식 중...</span>
          </div>
        </div>
      </div>
    );
  }

  if (view === "confirm") {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h2 className="font-bold text-h2 text-gray-900">영수증을 확인해주세요</h2>
          <p className="text-body2 text-gray-500">개인정보가 가려진 상태로 저장돼요.</p>
        </div>
        {previewUrl && (
          <div className="w-full rounded-[10px] overflow-hidden border border-gray-200">
            <Image
              src={previewUrl}
              alt="마스킹된 영수증"
              width={600}
              height={800}
              className="w-full h-auto object-contain"
            />
          </div>
        )}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleRetake}
            className="flex-1 h-14 rounded-[10px] bg-primary-50 text-primary-500 font-semibold text-body1"
          >
            다시 촬영
          </button>
          <button
            type="button"
            onClick={() => pendingData && onReceiptDataChange(pendingData)}
            className="flex-1 h-14 rounded-[10px] bg-primary-500 text-white font-semibold text-body1"
          >
            다음
          </button>
        </div>
      </div>
    );
  }

  if (view === "error") {
    return (
      <div className="flex flex-col items-center gap-6 py-4">
        <div className="size-15 rounded-full bg-red-50 flex items-center justify-center">
          <AlertCircleIcon />
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="font-bold text-h2 text-gray-900">영수증을 인식하지 못했어요</p>
          <p className="text-body1 text-gray-600 leading-relaxed">
            사진이 흐리거나 글씨가 잘 안 보일 수 있어요.<br />
            다시 촬영하거나 직접 입력해주세요.
          </p>
        </div>

        <div className="w-full bg-gray-100 rounded-sm px-4 py-4 flex flex-col gap-3">
          <span className="font-semibold text-body2 text-gray-700">촬영 팁</span>
          {TIPS.map((tip) => (
            <div key={tip} className="flex items-start gap-2">
              <div className="size-4.5 rounded-full bg-primary-50 flex items-center justify-center shrink-0 mt-0.5">
                <SmallCheckIcon />
              </div>
              <span className="text-caption text-gray-600">{tip}</span>
            </div>
          ))}
        </div>

        <div className="w-full flex gap-3">
          <button
            type="button"
            onClick={handleRetake}
            className="flex-1 h-14 rounded-[10px] bg-primary-50 text-primary-500 font-semibold text-body1"
          >
            다시 촬영하기
          </button>
          <button
            type="button"
            onClick={() => setView("form")}
            className="flex-1 h-14 rounded-[10px] bg-primary-500 text-white font-semibold text-body1"
          >
            직접 입력하기
          </button>
        </div>
      </div>
    );
  }

  // form (manual entry)
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="font-bold text-h2 text-gray-900">영수증 정보를 입력해주세요</h2>
        <p className="text-body2 text-gray-500">항목과 가격을 직접 입력해주세요.</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="font-semibold text-body2 text-gray-700">지점</span>
          <input
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            placeholder="예) 양재점"
            className="h-12 px-4 rounded-[10px] border border-gray-200 text-body2 outline-none focus:border-primary-500"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-semibold text-body2 text-gray-700">구매 일시</span>
          <input
            type="date"
            value={purchasedAt}
            onChange={(e) => setPurchasedAt(e.target.value)}
            className="h-12 px-4 rounded-[10px] border border-gray-200 text-body2 outline-none focus:border-primary-500"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="font-semibold text-body2 text-gray-700">항목 추가</span>
        <div className="flex gap-2">
          <input
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="상품명"
            className="flex-1 h-12 px-3 rounded-[10px] border border-gray-200 text-body2 outline-none focus:border-primary-500"
          />
          <input
            type="number"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            placeholder="가격"
            className="w-24 h-12 px-3 rounded-[10px] border border-gray-200 text-body2 outline-none focus:border-primary-500"
          />
        </div>
        <div className="flex gap-2">
          <input
            value={itemCode}
            onChange={(e) => setItemCode(e.target.value)}
            placeholder="상품코드 (선택)"
            className="flex-1 h-12 px-3 rounded-[10px] border border-gray-200 text-body2 outline-none focus:border-primary-500"
          />
          <button
            type="button"
            onClick={handleAddItem}
            className="h-12 px-4 rounded-[10px] bg-primary-500 text-white font-semibold text-body2"
          >
            추가
          </button>
        </div>

        {manualItems.length > 0 && (
          <div className="flex flex-col gap-1">
            {manualItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-gray-100 py-2">
                <div className="flex flex-col">
                  <span className="text-body2 text-gray-800">{item.productName}</span>
                  {item.productCode && (
                    <span className="text-caption text-gray-400">{item.productCode}</span>
                  )}
                </div>
                <span className="font-semibold text-body2 text-gray-900 shrink-0 ml-2">{item.unitPrice.toLocaleString()}원</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleManualSubmit}
        disabled={manualItems.length === 0}
        className="h-14 rounded-[10px] bg-primary-500 text-white text-h3 font-semibold disabled:bg-gray-200 disabled:text-gray-400"
      >
        다음
      </button>
    </div>
  );
}
