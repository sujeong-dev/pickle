"use client";

import Image from "next/image";
import { getKakaoAuthorizeUrl } from '@/shared/api';

async function handleKakaoLogin() {
  const { url } = await getKakaoAuthorizeUrl();
  window.location.href = url;
}

export function KakaoLoginButton() {
  return (
    <button
      type="button"
      className="relative flex w-full items-center justify-center h-12 bg-kakao rounded-sm"
      onClick={handleKakaoLogin}
    >
      <span className="absolute left-5 flex items-center">
        <Image src="/images/kakao-icon.svg" alt="" width={20} height={20} />
      </span>
      <span className="font-semibold text-gray-800 text-[17px] leading-[22px] tracking-[-0.3px]">
        카카오로 시작하기
      </span>
    </button>
  );
}
