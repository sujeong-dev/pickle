"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/shared/config/routes";
import { Button, PageHeader, StepIndicator, SuccessScreen } from "@/shared/ui";
import { ReviewStep1, useReviewStep1 } from "@/features/review-step1-receipt";
import type { OcrReceiptData } from "@/features/review-step1-receipt";
import { ReviewStep2, useReviewStep2, useRegisterReceipt } from "@/features/review-step2-items";
import { ReviewStep3, useReviewStep3, useCreateReview } from "@/features/review-step3-write";
import { getPresignedUrl } from "@/shared/api/report";

type Step = 1 | 2 | 3;

const STEP_LABELS = ["영수증 등록", "항목 확인", "후기 등록"];

export function ReviewWritePage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [itemIdx, setItemIdx] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [receiptId, setReceiptId] = useState<string | null>(null);

  const { ocrData, setOcrData } = useReviewStep1();
  const ocrItems = useMemo(() => ocrData?.items ?? [], [ocrData]);
  const { items: editableItems, updateItem } = useReviewStep2(ocrItems);
  const { reviews, setRating, setComment, addPhoto, removePhoto, setRepresentative } =
    useReviewStep3(editableItems.length);

  const { mutateAsync: registerReceipt, isPending: isRegistering } = useRegisterReceipt();
  const { mutateAsync: createReview, isPending: isSubmitting } = useCreateReview();

  const isLastItem = itemIdx === editableItems.length - 1;

  const handleBack = () => {
    if (step === 1) router.back();
    else if (step === 3 && itemIdx > 0) setItemIdx((i) => i - 1);
    else setStep((s) => (s - 1) as Step);
  };

  const handleOcrDataChange = (data: OcrReceiptData) => {
    setOcrData(data);
    setStep(2);
  };

  const handleNext = async () => {
    if (step === 2) {
      try {
        const result = await registerReceipt({
          store: "costco",
          branch: ocrData?.branch ?? "",
          totalAmount: ocrData?.totalAmount ?? 0,
          itemCount: editableItems.length,
          purchasedAt: ocrData?.purchasedAt ?? "",
        });
        setReceiptId(result.id);
        setStep(3);
      } catch {
        // Error handled centrally by kyInstance
      }
    } else if (step === 3) {
      if (!isLastItem) {
        setItemIdx((i) => i + 1);
      } else {
        try {
          for (let i = 0; i < editableItems.length; i++) {
            const review = reviews[i];

            const r2Keys: string[] = [];
            for (const photo of review.photos) {
              const { uploadUrl, r2Key } = await getPresignedUrl({
                fileType: photo.type,
                purpose: "review",
              });
              await fetch(uploadUrl, {
                method: "PUT",
                body: photo,
                headers: { "Content-Type": photo.type },
              });
              r2Keys.push(r2Key);
            }

            if (review.representativeIdx > 0 && review.representativeIdx < r2Keys.length) {
              const rep = r2Keys.splice(review.representativeIdx, 1)[0];
              r2Keys.unshift(rep);
            }

            await createReview({
              receiptId: receiptId!,
              productName: editableItems[i].name,
              price: editableItems[i].price,
              rating: review.rating,
              content: review.comment || undefined,
              imageKeys: r2Keys.length > 0 ? r2Keys : undefined,
            });
          }
          setShowSuccess(true);
        } catch {
          // Error handled centrally by kyInstance
        }
      }
    }
  };

  if (showSuccess) {
    return (
      <SuccessScreen
        title="후기 등록이 완료되었습니다"
        description={<>영수증 후기가 등록되었어요.<br />이웃들에게 도움이 될 거예요!</>}
        buttonLabel="다른 후기들 보러가기"
        onButtonClick={() => router.push(ROUTES.review)}
      />
    );
  }

  const isStep2Pending = step === 2 && isRegistering;
  const isStep3Pending = step === 3 && isSubmitting;

  const nextLabel =
    step === 2
      ? isRegistering ? "등록 중..." : "항목별 후기 등록"
      : step === 3
        ? isLastItem
          ? isSubmitting ? "등록 중..." : "등록 완료"
          : "다음 항목 >"
        : "다음";

  return (
    <div className="bg-white flex flex-col h-dvh">
      <PageHeader title="영수증 후기" onBack={handleBack} />
      <div className="px-5">
        <StepIndicator steps={STEP_LABELS} currentStep={step} />
      </div>

      {step === 1 && (
        <main className="flex-1 overflow-y-auto min-h-0 px-5 py-6">
          <ReviewStep1 onReceiptDataChange={handleOcrDataChange} />
        </main>
      )}

      {step === 2 && (
        <>
          <ReviewStep2 items={editableItems} onUpdateItem={updateItem} />
          <div className="shrink-0 px-5 pb-8 pt-3">
            <Button onClick={handleNext} disabled={isStep2Pending || editableItems.length === 0}>
              {nextLabel}
            </Button>
          </div>
        </>
      )}

      {step === 3 && reviews[itemIdx] && (
        <>
          <ReviewStep3
            itemName={editableItems[itemIdx].name}
            itemPrice={`${editableItems[itemIdx].price.toLocaleString()}원`}
            currentIdx={itemIdx}
            total={editableItems.length}
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
              className="flex-1 h-14 rounded-[10px] bg-gray-200 text-gray-400 text-h3 font-medium flex items-center justify-center"
            >
              이전
            </button>
            <Button onClick={handleNext} disabled={isStep3Pending} className="flex-1">
              {nextLabel}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
