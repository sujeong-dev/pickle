"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { SetNicknameStep } from "@/features/set-nickname";
import { SetBoundaryStep } from "@/features/set-boundary";
import type { SelectedLocation } from "@/features/set-boundary";
import { signupNewUser, type SignupNewUserBody, type SignupResponse } from "@/shared/api";
import { useTokenStore } from "@/shared/model";
import { ROUTES } from "@/shared/config/routes";
import { useSignupFlowStore } from "../model/signupFlowStore";

export function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = searchParams?.get("step") ?? "nickname";

  const { signupToken, nickname: storedNickname, setNickname, reset } = useSignupFlowStore();
  const { setAccessToken, setRefreshToken } = useTokenStore();

  const { mutateAsync: doSignup } = useMutation<SignupResponse, Error, SignupNewUserBody>({
    mutationFn: signupNewUser,
  });

  function handleNicknameSubmit(nickname: string) {
    setNickname(nickname);
    router.replace(`${ROUTES.signUp}?step=boundary`);
  }

  async function handleBoundaryComplete(location: SelectedLocation) {
    if (!signupToken) {
      router.replace(ROUTES.login);
      return;
    }
    try {
      const data = await doSignup({
        signupToken,
        nickname: storedNickname,
        sido: location.sido,
        sigungu: location.sigungu,
        termsAgreed: true,
      });
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      reset();
      router.replace(ROUTES.home);
    } catch {
      router.replace(ROUTES.login);
    }
  }

  if (step === "boundary") {
    return (
      <SetBoundaryStep
        onPrev={() => router.replace(`${ROUTES.signUp}?step=nickname`)}
        onComplete={handleBoundaryComplete}
      />
    );
  }

  return (
    <SetNicknameStep onSubmit={handleNicknameSubmit} />
  );
}
