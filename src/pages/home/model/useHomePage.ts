"use client";

import { useState } from "react";

export type HomeStep = "nickname" | "boundary";

export function useHomePage() {
  const [step, setStep] = useState<HomeStep>("nickname");

  function goToNickname() {
    setStep("nickname");
  }

  function goToBoundary() {
    setStep("boundary");
  }

  return { step, goToNickname, goToBoundary };
}
