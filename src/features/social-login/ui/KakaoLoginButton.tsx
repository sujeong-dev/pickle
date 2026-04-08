"use client";

export function KakaoLoginButton() {
  return (
    <button
      type="button"
      className="relative flex w-full items-center justify-center h-12 bg-kakao rounded-sm"
      onClick={() => {
        // TODO: Kakao OAuth 연동
      }}
    >
      <span className="absolute left-5 flex items-center">
        <img src="/images/kakao-icon.svg" alt="" className="size-5" />
      </span>
      <span className="font-semibold text-gray-800 text-[17px] leading-[22px] tracking-[-0.3px]">
        카카오로 시작하기
      </span>
    </button>
  );
}
