"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, PageHeader, StepIndicator } from "@/shared/ui";
import { ReviewStep1, useReviewStep1 } from "@/features/review-step1-receipt";
import { ReviewStep2, useReviewStep2 } from "@/features/review-step2-items";
import { ReviewStep3, useReviewStep3 } from "@/features/review-step3-write";

type Step = 1 | 2 | 3;

const STEP_LABELS = ["영수증 등록", "항목 확인", "후기 등록"];

export function ReviewWritePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [itemIdx, setItemIdx] = useState(0);

  const { receipt, setReceipt } = useReviewStep1();
  const { items } = useReviewStep2();
  const { reviews, setRating, setComment, addPhoto, removePhoto, setRepresentative } =
    useReviewStep3(items.length);

  const isLastItem = itemIdx === items.length - 1;

  const handleBack = () => {
    if (step === 1) router.back();
    else if (step === 3 && itemIdx > 0) setItemIdx((i) => i - 1);
    else setStep((s) => (s - 1) as Step);
  };

  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) {
      if (!isLastItem) setItemIdx((i) => i + 1);
      else console.log("후기 등록 완료");
    }
  };

  const canNext = step === 1 ? receipt !== null : true;

  const nextLabel =
    step === 1
      ? "다음"
      : step === 2
        ? "항목별 후기 등록"
        : isLastItem
          ? "등록 완료"
          : "다음 항목 >";

  return (
    <div className="bg-white flex flex-col h-dvh">
      <PageHeader title="영수증 후기" onBack={handleBack} />
      <div className="px-5">
        <StepIndicator steps={STEP_LABELS} currentStep={step} />
      </div>

      {step === 1 && (
        <>
          <main className="flex-1 overflow-y-auto min-h-0 px-5 py-6">
            <ReviewStep1
              receipt={receipt}
              onReceiptChange={setReceipt}
              onReceiptRemove={() => setReceipt(null)}
            />
          </main>
          <div className="shrink-0 px-6 pb-8 pt-3">
            <Button onClick={handleNext} disabled={!canNext}>{nextLabel}</Button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <ReviewStep2 items={items} />
          <div className="shrink-0 px-5 pb-8 pt-3">
            <Button onClick={handleNext}>{nextLabel}</Button>
          </div>
        </>
      )}

      {step === 3 && reviews[itemIdx] && (
        <>
          <ReviewStep3
            itemName={items[itemIdx].name}
            itemPrice={items[itemIdx].price}
            currentIdx={itemIdx}
            total={items.length}
            photos={reviews[itemIdx].photos}
            representativeIdx={reviews[itemIdx].representativeIdx}
            rating={reviews[itemIdx].rating}
            comment={reviews[itemIdx].comment}
            onAddPhoto={(file) => addPhoto(itemIdx, file)}
            onRemovePhoto={(photoIdx) => removePhoto(itemIdx, photoIdx)}
            onSetRepresentative={(photoIdx) => setRepresentative(itemIdx, photoIdx)}
            onRatingChange={(r) => setRating(itemIdx, r)}
            onCommentChange={(c) => setComment(itemIdx, c)}
          />
          <div className="shrink-0 px-5 pb-8 pt-3 flex gap-2">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 h-14 rounded-[10px] bg-gray-200 text-gray-400 text-[20px] font-medium flex items-center justify-center"
            >
              이전
            </button>
            <Button onClick={handleNext} className="flex-1">{nextLabel}</Button>
          </div>
        </>
      )}
    </div>
  );
}
