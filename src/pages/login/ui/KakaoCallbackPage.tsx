"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useKakaoLogin } from "@/features/social-login";
import { useTokenStore, useToastStore } from "@/shared/model";
import { getAuthErrorMessage } from "@/shared/api";
import { ROUTES } from "@/shared/config/routes";

export function KakaoCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams?.get("code") ?? "";

  const { mutate: loginWithKakao } = useKakaoLogin();
  const { setAccessToken, setRefreshToken } = useTokenStore();

  useEffect(() => {
    if (!code) {
      router.replace(ROUTES.login);
      return;
    }
    loginWithKakao(code, {
      onSuccess: (data) => {
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        router.replace(ROUTES.home);
      },
      onError: async (error) => {
        const message = await getAuthErrorMessage(error);
        useToastStore.getState().show(message);
        router.replace(ROUTES.login);
      },
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex items-center justify-center h-dvh">
      <span className="text-body2 text-gray-500">로그인 중...</span>
    </div>
  );
}
