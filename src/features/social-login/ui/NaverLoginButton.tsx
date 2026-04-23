"use client";

import Image from "next/image";
import { getNaverAuthorizeUrl } from '@/shared/api';

async function handleNaverLogin() {
  const { url } = await getNaverAuthorizeUrl();
  window.location.href = url;
}

export function NaverLoginButton() {
  return (
    <button
      type="button"
      className="relative flex w-full items-center justify-center h-12 bg-naver rounded-sm"
      onClick={handleNaverLogin}
    >
      <span className="absolute left-5 flex items-center">
        <Image src="/images/naver-n.svg" alt="" width={20} height={20} />
      </span>
      <span className="font-semibold text-white text-[17px] leading-[22px] tracking-[-0.3px]">
        네이버로 시작하기
      </span>
    </button>
  );
}
