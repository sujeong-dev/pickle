"use client";

import { useState } from "react";
import { Input } from "@/shared/ui";
import { useRegisterReceipt } from "../api/useReceipt";
import type { ReceiptData } from "../model/useReviewStep1";

type ReviewStep1Props = {
  receiptData: ReceiptData | null;
  onReceiptDataChange: (data: ReceiptData) => void;
};

export function ReviewStep1({ receiptData, onReceiptDataChange }: ReviewStep1Props) {
  const [store, setStore] = useState("");
  const [branch, setBranch] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [itemCount, setItemCount] = useState("");
  const [purchasedAt, setPurchasedAt] = useState("");

  const { mutateAsync: registerReceiptMutation, isPending } = useRegisterReceipt();

  const canSubmit = !!(store && branch && totalAmount && itemCount && purchasedAt && !isPending);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    try {
      const result = await registerReceiptMutation({
        store,
        branch,
        totalAmount: Number(totalAmount),
        itemCount: Number(itemCount),
        purchasedAt,
      });
      onReceiptDataChange({
        receiptId: result.id,
        items: result.items,
        totalAmount: result.totalAmount,
      });
    } catch {
      // Error handled centrally by kyInstance (toast shown)
    }
  };

  if (receiptData) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center py-12">
        <div className="bg-primary-50 rounded-full size-16 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2D8A5A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="font-bold text-h3 text-gray-900">영수증 등록 완료</p>
        <p className="text-body2 text-gray-600">
          {receiptData.items.length}개 항목 · {receiptData.totalAmount.toLocaleString()}원
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="font-bold text-h2 text-gray-900 leading-normal">영수증 정보를 입력해주세요</h2>
        <p className="text-body2 text-gray-600 leading-normal">구매하신 영수증의 정보를 직접 입력해주세요.</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="font-semibold text-body2 text-gray-800">매장명</span>
          <Input
            value={store}
            onChange={(e) => setStore(e.target.value)}
            onClear={() => setStore("")}
            placeholder="매장명을 입력해주세요"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-semibold text-body2 text-gray-800">지점</span>
          <Input
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            onClear={() => setBranch("")}
            placeholder="지점을 입력해주세요"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-semibold text-body2 text-gray-800">총 금액</span>
          <Input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            onClear={() => setTotalAmount("")}
            placeholder="총 금액을 입력해주세요"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-semibold text-body2 text-gray-800">항목 수</span>
          <Input
            type="number"
            value={itemCount}
            onChange={(e) => setItemCount(e.target.value)}
            onClear={() => setItemCount("")}
            placeholder="상품 항목 수를 입력해주세요"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-semibold text-body2 text-gray-800">구매 일시</span>
          <Input
            type="date"
            value={purchasedAt}
            onChange={(e) => setPurchasedAt(e.target.value)}
            onClear={() => setPurchasedAt("")}
            placeholder="구매 일시를 선택해주세요"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="h-14 rounded-[10px] bg-primary-500 text-white text-h3 font-semibold disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
      >
        {isPending ? "등록 중..." : "영수증 등록"}
      </button>
    </div>
  );
}
