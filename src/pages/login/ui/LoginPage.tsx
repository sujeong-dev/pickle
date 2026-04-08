import Image from "next/image";
import { KakaoLoginButton, NaverLoginButton } from "@/features/social-login";

export function LoginPage() {
  return (
    <main className="flex flex-col min-h-svh bg-white max-w-[390px] mx-auto w-full">
      {/* Brand Area */}
      <div className="flex flex-col items-center justify-center flex-1 gap-4">
        <Image
          src="/images/pickle-ci.png"
          alt="pickle"
          width={253}
          height={115}
          priority
          className="object-contain"
        />
        <p className="text-[15px] text-gray-500 whitespace-nowrap">
          실시간 할인 제보 및 소분모임 서비스
        </p>
      </div>

      {/* Login Area */}
      <div className="flex flex-col items-center gap-3 px-5 pb-12 w-full">
        <div className="flex flex-col gap-3 w-full">
          <NaverLoginButton />
          <KakaoLoginButton />
        </div>
        <p className="text-[11px] text-gray-400 whitespace-nowrap">
          시작 시 이용약관 및 개인정보처리방침에 동의합니다.
        </p>
      </div>
    </main>
  );
}
