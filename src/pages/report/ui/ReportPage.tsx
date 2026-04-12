"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { ReportStep1, useReportStep1 } from "@/features/report-step1-photo";
import { ReportStep2 } from "@/features/report-step2-info";
import { useState } from "react";

type Step = 1 | 2;

const STEPS: { step: Step; label: string }[] = [
  { step: 1, label: "할인표" },
  { step: 2, label: "상품정보" },
];

function ChevronLeftIcon() {
  return (
    <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function StepIndicator({ currentStep }: { currentStep: Step }) {
  return (
    <div className="flex items-center justify-center gap-1 py-1">
      {STEPS.map(({ step, label }, idx) => {
        const active = step <= currentStep;
        return (
          <div key={step} className="flex items-center gap-1">
            {idx > 0 && (
              <div className="bg-gray-300 h-[2px] rounded-[1px] w-[14px]" />
            )}
            <div className="flex items-center gap-1">
              <div
                className={cn(
                  "size-[20px] rounded-full flex items-center justify-center",
                  active ? "bg-primary-500" : "bg-gray-300",
                )}
              >
                <span className={cn("text-[10px] font-bold leading-none", active ? "text-white" : "text-gray-500")}>
                  {step}
                </span>
              </div>
              <span className={cn("text-[12px] font-medium", active ? "text-primary-500" : "text-gray-400")}>
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ReportPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const { photo, setPhoto } = useReportStep1();

  const handleBack = () => {
    if (step === 1) router.back();
    else setStep(1);
  };

  const handleNext = () => {
    if (step === 1) setStep(2);
  };

  const canNext = step === 1 ? photo !== null : true;

  return (
    <div className="bg-white flex flex-col h-dvh">
      {/* Header */}
      <header className="flex items-center justify-between h-[50px] px-5 shrink-0">
        <button type="button" aria-label="뒤로가기" onClick={handleBack}>
          <ChevronLeftIcon />
        </button>
        <span className="font-bold text-[20px] text-gray-900">제보하기</span>
        <div className="w-[27px]" />
      </header>

      {/* Step indicator */}
      <div className="px-5">
        <StepIndicator currentStep={step} />
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto min-h-0 px-5 py-6">
        {step === 1 && (
          <ReportStep1 photo={photo} onPhotoChange={setPhoto} onPhotoRemove={() => setPhoto(null)} />
        )}
        {step === 2 && <ReportStep2 />}
      </main>

      {/* Bottom button */}
      <div className="shrink-0 px-6 pb-8 pt-3">
        <button
          type="button"
          onClick={handleNext}
          disabled={!canNext}
          className={cn(
            "w-full h-[56px] rounded-[10px] flex items-center justify-center font-medium text-[20px]",
            canNext
              ? "bg-primary-500 text-white"
              : "bg-gray-200 text-gray-400",
          )}
        >
          다음
        </button>
      </div>
    </div>
  );
}
