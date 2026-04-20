"use client";

import { useRouter } from "next/navigation";
import { ReportStep1, useReportStep1 } from "@/features/report-step1-photo";
import { ReportStep2, useReportStep2, useCreateReport } from "@/features/report-step2-info";
import { Button, PageHeader, StepIndicator, SuccessScreen } from "@/shared/ui";
import { ROUTES } from "@/shared/config/routes";
import { useState } from "react";

type Step = 1 | 2;

const STEP_LABELS = ["할인표", "상품정보"];


export function ReportPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    photo,
    setPhoto,
    r2Key,
    setR2Key,
    jobId,
    setJobId,
    ocrResult,
    setOcrResult,
    removePhoto,
  } = useReportStep1();

  const {
    photos,
    photoR2Keys,
    representativeIdx,
    productName,
    price,
    store,
    branch,
    addPhoto,
    removePhoto: removeProductPhoto,
    setRepresentativeIdx,
    setProductName,
    setPrice,
    setStore,
    setBranch,
  } = useReportStep2();

  const { mutateAsync: createReport, isPending: isSubmitting } = useCreateReport();

  const handleBack = () => {
    if (step === 1) router.back();
    else setStep(1);
  };

  const handleNext = async () => {
    if (step === 1) {
      setStep(2);
      return;
    }

    // Step 2: submit
    await createReport({
      productName,
      price: Number(price),
      store,
      branch,
      imageKeys: photoR2Keys,
    });

    setShowSuccess(true);
  };

  const canNext =
    step === 1
      ? photo !== null
      : photos.length > 0 && !!productName && !!price && !!store && !!branch;

  if (showSuccess) {
    return (
      <SuccessScreen
        title="제보가 완료되었습니다"
        description={<>할인제보가 등록되었어요.<br />다른 할인상품들도 확인해보세요!</>}
        buttonLabel="다른 제보들 보러가기"
        onButtonClick={() => router.push(ROUTES.home)}
      />
    );
  }

  return (
    <div className="bg-white flex flex-col h-dvh">
      <PageHeader title="제보하기" onBack={handleBack} />
      <div className="px-5">
        <StepIndicator steps={STEP_LABELS} currentStep={step} />
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto min-h-0 px-5 py-6">
        {step === 1 && (
          <ReportStep1
            photo={photo}
            r2Key={r2Key}
            jobId={jobId}
            ocrResult={ocrResult}
            onPhotoChange={setPhoto}
            onPhotoRemove={removePhoto}
            onR2KeyChange={setR2Key}
            onJobIdChange={setJobId}
            onOcrResultChange={setOcrResult}
          />
        )}
        {step === 2 && (
          <ReportStep2
            photos={photos}
            representativeIdx={representativeIdx}
            productName={productName}
            price={price}
            store={store}
            branch={branch}
            ocrResult={ocrResult}
            onAddPhoto={addPhoto}
            onRemovePhoto={removeProductPhoto}
            onSetRepresentative={setRepresentativeIdx}
            onProductNameChange={setProductName}
            onPriceChange={setPrice}
            onStoreChange={setStore}
            onBranchChange={setBranch}
          />
        )}
      </main>

      {/* Bottom button */}
      <div className="shrink-0 px-6 pb-8 pt-3">
        <Button onClick={handleNext} disabled={!canNext || isSubmitting}>
          {step === 1 ? "다음" : isSubmitting ? "제보 중..." : "제보하기"}
        </Button>
      </div>
    </div>
  );
}
