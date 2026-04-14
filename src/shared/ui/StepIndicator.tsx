"use client";

import { cn } from "@/shared/lib/utils";

type StepIndicatorProps = {
  steps: string[];
  currentStep: number;
};

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-1 py-1">
      {steps.map((label, idx) => {
        const step = idx + 1;
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
