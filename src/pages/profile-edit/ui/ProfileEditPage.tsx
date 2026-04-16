"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input, Toast, Button, SuccessScreen } from "@/shared/ui";
import { ROUTES } from "@/shared/config/routes";

function ChevronLeftIcon() {
  return (
    <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#2D8A5A" fillOpacity="0.5" />
      <path d="M20 21C20 18.2386 16.4183 16 12 16C7.58172 16 4 18.2386 4 21" stroke="#2D8A5A" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function WarningTriangleIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#E0421A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function RadioDot({ selected }: { selected: boolean }) {
  return (
    <div
      className={`size-4 rounded-full border flex items-center justify-center shrink-0 ${
        selected ? "bg-secondary-500 border-secondary-500" : "bg-white border-gray-400"
      }`}
    >
      {selected && <div className="size-1.5 rounded-full bg-white" />}
    </div>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#2D8A5A" />
      <path d="M7 12l3.5 3.5L17 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const INITIAL_NICKNAME = "커클랜드 시그니처";

const WITHDRAW_REASONS = [
  "더 이상 사용하지 않아요",
  "원하는 정보를 찾기 어려워요",
  "개인정보가 걱정돼요",
  "다른 서비스로 이동할 예정이에요",
];

export function ProfileEditPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState(INITIAL_NICKNAME);
  const [savedNickname, setSavedNickname] = useState(INITIAL_NICKNAME);
  const [avatarChanged, setAvatarChanged] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState(WITHDRAW_REASONS[0]);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const isDirty = nickname !== savedNickname || avatarChanged;

  useEffect(() => {
    if (!toastVisible) return;
    const timer = setTimeout(() => setToastVisible(false), 2000);
    return () => clearTimeout(timer);
  }, [toastVisible]);

  function handleSave() {
    setSavedNickname(nickname);
    setAvatarChanged(false);
    setToastVisible(true);
  }

  if (deleteSuccess) {
    return (
      <SuccessScreen
        title="탈퇴가 완료되었습니다"
        description={<>그동안 피클을 이용해주셔서 감사합니다.<br />언제든 다시 돌아오세요!</>}
        buttonLabel="확인"
        onButtonClick={() => router.push(ROUTES.login)}
        iconClassName="bg-gray-200 rounded-full size-[60px] flex items-center justify-center"
        buttonVariant="black"
      />
    );
  }

  return (
    <div className="bg-gray-50 flex flex-col h-dvh">
      {/* 헤더 */}
      <header className="flex items-center justify-between h-[50px] px-5 shrink-0">
        <button type="button" aria-label="뒤로가기" onClick={() => router.back()}>
          <ChevronLeftIcon />
        </button>
        <span className="font-bold text-h2 text-gray-900">프로필 수정</span>
        <button
          type="button"
          className={`font-semibold text-body1 transition-colors ${isDirty ? "text-primary-500" : "text-gray-300 cursor-default"}`}
          onClick={handleSave}
          disabled={!isDirty}
        >
          저장
        </button>
      </header>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-3">
        {/* 아바타 섹션 */}
        <div className="bg-white flex items-center justify-center py-xl shrink-0">
          <div className="relative">
            <div className="size-[100px] rounded-full bg-primary-50 flex items-center justify-center">
              <PersonIcon />
            </div>
            <button
              type="button"
              aria-label="프로필 사진 변경"
              className="absolute bottom-0 right-0 size-8 rounded-full bg-primary-500 border-2 border-white flex items-center justify-center"
              onClick={() => setAvatarChanged(true)}
            >
              <CameraIcon />
            </button>
          </div>
        </div>

        {/* 닉네임 입력 섹션 */}
        <div className="bg-white px-5 shrink-0">
          <div className="flex flex-col gap-[6px] pt-[14px] pb-[17px] border-b border-gray-100">
            <label className="text-[13.5px] font-semibold text-gray-500">닉네임</label>
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onClear={() => setNickname("")}
              className="w-full"
            />
          </div>
        </div>

        {/* 하단 푸터 */}
        <div className="flex items-center justify-center flex-1 min-h-[128px]">
          <div className="flex items-center gap-2 text-caption text-gray-500">
            <button type="button" onClick={() => setLogoutModalOpen(true)}>
              로그아웃
            </button>
            <span>|</span>
            <button type="button" onClick={() => setWithdrawModalOpen(true)}>
              탈퇴하기
            </button>
          </div>
        </div>
      </div>

      {/* 탈퇴하기 확인 모달 */}
      {withdrawModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5"
          onClick={() => setWithdrawModalOpen(false)}
        >
          <div
            className="w-full bg-white rounded-[10px] shadow-md flex flex-col gap-3 px-5 py-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 경고 영역 */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="size-16 rounded-full bg-[#FEF2F2] flex items-center justify-center">
                <WarningTriangleIcon />
              </div>
              <p className="text-body2 text-gray-600 text-center">
                탈퇴 시 모든 정보가 삭제되며<br />복구할 수 없어요.
              </p>
            </div>

            {/* 탈퇴 사유 */}
            <div className="flex flex-col gap-2">
              <span className="text-caption font-semibold text-gray-900">탈퇴 사유</span>
              <div className="flex flex-col">
                {WITHDRAW_REASONS.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    className="flex items-center gap-2 py-2"
                    onClick={() => setWithdrawReason(reason)}
                  >
                    <RadioDot selected={withdrawReason === reason} />
                    <span className="text-caption text-gray-800">{reason}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex gap-3 pt-1">
              <Button size="md" variant="outline" onClick={() => setWithdrawModalOpen(false)}>
                취소
              </Button>
              <Button
                size="md"
                variant="danger"
                onClick={() => {
                  setWithdrawModalOpen(false);
                  setDeleteSuccess(true);
                }}
              >
                탈퇴하기
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 로그아웃 확인 모달 */}
      {logoutModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5"
          onClick={() => setLogoutModalOpen(false)}
        >
          <div
            className="w-full bg-white rounded-[10px] shadow-md flex flex-col gap-3 px-5 py-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-body1 font-bold text-gray-900">로그아웃</p>
            <p className="text-body2 text-gray-600">정말 로그아웃 하시겠어요?</p>
            <div className="flex gap-3 pt-1">
              <Button
                size="md"
                variant="outline"
                onClick={() => setLogoutModalOpen(false)}
              >
                취소
              </Button>
              <Button
                size="md"
                variant="danger"
                onClick={() => {
                  setLogoutModalOpen(false);
                  router.push(ROUTES.login);
                }}
              >
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      )}

      <Toast
        message="프로필이 저장되었어요"
        icon={<CheckCircleIcon />}
        visible={toastVisible}
        className="bg-gray-700 text-white"
      />
    </div>
  );
}
