"use client";

import { SetNicknameStep } from "@/features/set-nickname";
import { SetBoundaryStep } from "@/features/set-boundary";
import { useHomePage } from "../model/useHomePage";
import type { SelectedLocation } from "@/features/set-boundary";

export function HomePage() {
  const { step, goToBoundary, goToNickname } = useHomePage();

  function handleBoundaryComplete(location: SelectedLocation) {
    // TODO: submit nickname + location to server
    console.log("onboarding complete", location);
  }

  return (
    <>
      {step === "nickname" && <SetNicknameStep onNext={goToBoundary} />}
      {step === "boundary" && (
        <SetBoundaryStep onPrev={goToNickname} onComplete={handleBoundaryComplete} />
      )}
    </>
  );
}
