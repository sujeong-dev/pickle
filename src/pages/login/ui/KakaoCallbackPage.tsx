"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useKakaoLogin } from "@/features/social-login";
import { useTokenStore } from "@/shared/model";
import { useSignupFlowStore } from "@/pages/sign-up/model/signupFlowStore";
import { ROUTES } from "@/shared/config/routes";

export function KakaoCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams?.get("code") ?? "";

  const { mutate: loginWithKakao } = useKakaoLogin();
  const { setAccessToken, setRefreshToken } = useTokenStore();
  const { setSignupToken } = useSignupFlowStore();

  useEffect(() => {
    if (!code) {
      router.replace(ROUTES.login);
      return;
    }
    loginWithKakao(code, {
      onSuccess: (data) => {
        if (data.signupRequired && data.signupToken) {
          setSignupToken(data.signupToken);
          router.replace(`${ROUTES.signUp}?step=nickname`);
        } else if (data.accessToken && data.refreshToken) {
          setAccessToken(data.accessToken);
          setRefreshToken(data.refreshToken);
          router.replace(ROUTES.home);
        } else {
          router.replace(ROUTES.login);
        }
      },
      onError: () => router.replace(ROUTES.login),
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex items-center justify-center h-dvh">
      <span className="text-body2 text-gray-500">로그인 중...</span>
    </div>
  );
}
