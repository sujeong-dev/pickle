"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useNaverLogin } from "@/features/social-login";
import { useTokenStore } from "@/shared/model";
import { useSignupFlowStore } from "@/pages/sign-up/model/signupFlowStore";
import { ROUTES } from "@/shared/config/routes";

export function NaverCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams?.get("code") ?? "";
  const state = searchParams?.get("state") ?? "";

  const { mutate: loginWithNaver } = useNaverLogin();
  const { setAccessToken, setRefreshToken } = useTokenStore();
  const { setSignupToken } = useSignupFlowStore();

  useEffect(() => {
    if (!code || !state) {
      router.replace(ROUTES.login);
      return;
    }
    loginWithNaver({ code, state }, {
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
