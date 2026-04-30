"use client";

import { useState } from "react";
import { ScanIcon } from "@/shared/ui/icons";
import type { EditableItem } from "../model/useReviewStep2";

function CheckIcon({ stroke = "#2D8A5A" }: { stroke?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

type EditModalProps = {
  item: EditableItem;
  onSave: (name: string, price: number, productCode?: string) => void;
  onClose: () => void;
};

function EditModal({ item, onSave, onClose }: EditModalProps) {
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(String(item.price));
  const [productCode, setProductCode] = useState(item.productCode ?? "");

  const handleSave = () => {
    const parsedPrice = Number(price);
    if (!name.trim() || isNaN(parsedPrice) || parsedPrice <= 0) return;
    onSave(name.trim(), parsedPrice, productCode.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative w-full max-w-107.5 bg-white rounded-t-2xl px-5 pt-5 pb-8 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <span className="font-bold text-subtitle text-gray-900">항목 수정</span>
          <button type="button" onClick={onClose} className="text-gray-400 text-h2 leading-none">&times;</button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <span className="font-semibold text-body2 text-gray-700">상품명</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 px-4 rounded-[10px] border border-gray-200 text-body2 outline-none focus:border-primary-500"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-semibold text-body2 text-gray-700">가격</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="h-12 px-4 rounded-[10px] border border-gray-200 text-body2 outline-none focus:border-primary-500"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-semibold text-body2 text-gray-700">상품코드</span>
            <input
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
              placeholder="예) 630268"
              className="h-12 px-4 rounded-[10px] border border-gray-200 text-body2 outline-none focus:border-primary-500"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="h-14 rounded-[10px] bg-primary-500 text-white font-semibold text-h3"
        >
          저장
        </button>
      </div>
    </div>
  );
}

type ReviewStep2Props = {
  items: EditableItem[];
  selectedIdxs: Set<number>;
  onToggleSelect: (idx: number) => void;
  onUpdateItem: (idx: number, name: string, price: number, productCode?: string) => void;
};

export function ReviewStep2({ items, selectedIdxs, onToggleSelect, onUpdateItem }: ReviewStep2Props) {
  const [editIdx, setEditIdx] = useState<number | null>(null);

  const selectedTotal = items.reduce(
    (sum, item, idx) => (selectedIdxs.has(idx) ? sum + item.price * item.quantity : sum),
    0,
  );

  return (
    <>
      <div className="flex flex-col flex-1 min-h-0">
        <div className="bg-primary-50 flex items-center gap-2 px-5 py-2 shrink-0">
          <ScanIcon size={16} />
          <span className="text-caption font-medium text-primary-500">
            {items.length}개 항목 인식 — 후기를 등록할 상품을 선택해주세요
          </span>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 px-5 py-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-subtitle text-gray-900">인식된 항목</span>
            <span className="text-caption text-gray-500">탭하여 수정</span>
          </div>

          <div className="flex flex-col gap-1">
            {items.map((item, idx) => {
              const isSelected = selectedIdxs.has(idx);
              return (
                <div key={idx} className="flex items-center gap-2 border-b border-gray-100 py-3">
                  <button
                    type="button"
                    onClick={() => onToggleSelect(idx)}
                    aria-pressed={isSelected}
                    aria-label={isSelected ? "선택 해제" : "선택"}
                    className={
                      isSelected
                        ? "size-6 rounded-xs bg-primary-500 flex items-center justify-center shrink-0"
                        : "size-6 rounded-xs border border-gray-300 flex items-center justify-center shrink-0"
                    }
                  >
                    {isSelected && <CheckIcon stroke="white" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditIdx(idx)}
                    className="flex flex-col flex-1 min-w-0 px-1 gap-0.5 text-left"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-body2 text-gray-900 truncate">{item.name}</span>
                      <span className="font-bold text-subtitle text-gray-900 shrink-0">
                        {item.price.toLocaleString("ko-KR")}원
                      </span>
                    </div>
                    <span className="text-caption text-gray-400">{item.productCode ?? "-"}</span>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-body2 text-gray-600">선택 {selectedIdxs.size}개</span>
            <span className="font-bold text-subtitle text-gray-900">
              {selectedTotal.toLocaleString("ko-KR")}원
            </span>
          </div>
        </div>
      </div>

      {editIdx !== null && items[editIdx] && (
        <EditModal
          item={items[editIdx]}
          onSave={(name, price, productCode) => onUpdateItem(editIdx, name, price, productCode)}
          onClose={() => setEditIdx(null)}
        />
      )}
    </>
  );
}
