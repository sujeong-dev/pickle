"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/shared/config/routes";
import { Button, PageHeader, StepIndicator, SuccessScreen } from "@/shared/ui";
import { ReviewStep1, useReviewStep1 } from "@/features/review-step1-receipt";
import { ReviewStep2, useReviewStep2 } from "@/features/review-step2-items";
import { ReviewStep3, useReviewStep3, useCreateReview } from "@/features/review-step3-write";
import { getPresignedUrl } from "@/shared/api/report";

type Step = 1 | 2 | 3;

const STEP_LABELS = ["영수증 등록", "항목 확인", "후기 등록"];

export function ReviewWritePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams?.get("postId") ?? "";

  const [step, setStep] = useState<Step>(1);
  const [itemIdx, setItemIdx] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const { receipt, receiptData, setReceipt, setReceiptData, removeReceipt } = useReviewStep1();
  const { items: receiptItems } = useReviewStep2(receiptData?.items);
  const { reviews, setRating, setComment, addPhoto, removePhoto, setRepresentative } =
    useReviewStep3(receiptItems.length);

  const { mutateAsync: createReview, isPending: isSubmitting } = useCreateReview();

  const isLastItem = itemIdx === receiptItems.length - 1;

  const handleBack = () => {
    if (step === 1) router.back();
    else if (step === 3 && itemIdx > 0) setItemIdx((i) => i - 1);
    else setStep((s) => (s - 1) as Step);
  };

  const handleNext = async () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      if (!isLastItem) {
        setItemIdx((i) => i + 1);
      } else {
        // Submit all reviews — one per receipt item
        try {
          for (let i = 0; i < receiptItems.length; i++) {
            const review = reviews[i];

            // Upload photos for this item and collect URLs
            let imageUrls: string[] | undefined;
            if (review.photos.length > 0) {
              const uploadedUrls: string[] = [];
              for (const photo of review.photos) {
                const { presignedUrl, fileUrl } = await getPresignedUrl({
                  filename: photo.name,
                  contentType: photo.type,
                });
                await fetch(presignedUrl, {
                  method: "PUT",
                  body: photo,
                  headers: { "Content-Type": photo.type },
                });
                uploadedUrls.push(fileUrl);
              }
              // Reorder so representative photo is first
              if (review.representativeIdx > 0 && review.representativeIdx < uploadedUrls.length) {
                const rep = uploadedUrls.splice(review.representativeIdx, 1)[0];
                uploadedUrls.unshift(rep);
              }
              imageUrls = uploadedUrls;
            }

            await createReview({
              postId,
              rating: review.rating,
              content: review.comment,
              receiptId: receiptData?.receiptId,
              imageUrls,
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

  const canNext =
    step === 1 ? receipt !== null && receiptData !== null : true;

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
              receiptData={receiptData}
              onReceiptChange={setReceipt}
              onReceiptRemove={removeReceipt}
              onReceiptDataChange={setReceiptData}
            />
          </main>
          <div className="shrink-0 px-6 pb-8 pt-3">
            <Button onClick={handleNext} disabled={!canNext}>{nextLabel}</Button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <ReviewStep2 items={receiptItems} />
          <div className="shrink-0 px-5 pb-8 pt-3">
            <Button onClick={handleNext}>{nextLabel}</Button>
          </div>
        </>
      )}

      {step === 3 && reviews[itemIdx] && (
        <>
          <ReviewStep3
            itemName={receiptItems[itemIdx].name}
            itemPrice={receiptItems[itemIdx].price}
            currentIdx={itemIdx}
            total={receiptItems.length}
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
            <Button onClick={handleNext} disabled={isSubmitting} className="flex-1">{nextLabel}</Button>
          </div>
        </>
      )}
    </div>
  );
}
