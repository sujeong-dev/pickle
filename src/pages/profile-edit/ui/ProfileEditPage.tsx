"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Input, Toast, Button, SuccessScreen, UserAvatar } from "@/shared/ui";
import { ROUTES } from "@/shared/config/routes";
import { useMyProfile, useWithdraw, useUpdateProfileImage, profileKeys } from "@/features/profile-edit";
import { useUpdateNickname, useNicknameCheck, NicknameRulesPanel } from "@/features/set-nickname";
import { logout } from "@/shared/api";
import { clearTokens, useToastStore } from "@/shared/model";
import { useDebouncedValue } from "@/shared/lib/useDebouncedValue";

function ChevronLeftIcon() {
  return (
    <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
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

const WITHDRAW_REASONS = [
  "더 이상 사용하지 않아요",
  "원하는 정보를 찾기 어려워요",
  "개인정보가 걱정돼요",
  "다른 서비스로 이동할 예정이에요",
];

export function ProfileEditPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: profile } = useMyProfile();
  const { mutate: updateNickname, isPending: isSavingNickname } = useUpdateNickname();
  const { mutate: withdraw } = useWithdraw();

  const [nickname, setNickname] = useState('');
  const [savedNickname, setSavedNickname] = useState('');
  const [profileSynced, setProfileSynced] = useState(false);

  // profile이 처음 도착할 때 render 중에 바로 초기화 (useEffect 없이)
  if (!profileSynced && profile?.nickname) {
    setProfileSynced(true);
    setNickname(profile.nickname);
    setSavedNickname(profile.nickname);
  }

  const savedNicknameFromServer = profile?.nickname ?? '';
  const isNicknameChanged = nickname.length > 0 && nickname !== savedNicknameFromServer;
  const debouncedNickname = useDebouncedValue(nickname, 200);
  const isDebouncedReady = isNicknameChanged && debouncedNickname === nickname;
  const { data: nicknameCheckData, isFetching: isCheckingNickname } = useNicknameCheck(
    isDebouncedReady ? debouncedNickname : '',
  );
  const nicknameAvailable =
    isDebouncedReady && !isCheckingNickname ? (nicknameCheckData?.available ?? null) : null;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: updateProfileImage, isPending: isUploadingAvatar } = useUpdateProfileImage();
  const showToast = useToastStore((s) => s.show);
  const [toastVisible, setToastVisible] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState(WITHDRAW_REASONS[0]);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => {
    if (!toastVisible) return;
    const timer = setTimeout(() => setToastVisible(false), 2000);
    return () => clearTimeout(timer);
  }, [toastVisible]);

  const isDirty = isNicknameChanged && nicknameAvailable === true;

  function handleSave() {
    const trimmed = nickname.trim();
    if (!trimmed || trimmed === savedNickname || nicknameAvailable !== true) return;
    updateNickname(trimmed, {
      onSuccess: () => {
        setNickname(trimmed);
        setSavedNickname(trimmed);
        queryClient.invalidateQueries({ queryKey: profileKeys.me() });
        setToastVisible(true);
      },
    });
  }

  function handleAvatarClick() {
    if (isUploadingAvatar) return;
    fileInputRef.current?.click();
  }

  function handleAvatarFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    updateProfileImage(file, {
      onSuccess: () => showToast("프로필 사진이 변경됐어요"),
      onError: () => showToast("프로필 사진 변경에 실패했어요"),
    });
  }

  function handleWithdraw() {
    withdraw(undefined, {
      onSuccess: () => {
        setWithdrawModalOpen(false);
        setDeleteSuccess(true);
      },
    });
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
          className={`font-semibold text-body1 transition-colors ${isDirty && !isSavingNickname ? "text-primary-500" : "text-gray-300 cursor-default"}`}
          onClick={handleSave}
          disabled={!isDirty || isSavingNickname}
        >
          저장
        </button>
      </header>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-3">
        {/* 아바타 섹션 */}
        <div className="bg-white flex items-center justify-center py-xl shrink-0">
          <div className="relative">
            <UserAvatar src={profile?.profileImageUrl} size={100} />
            <button
              type="button"
              aria-label="프로필 사진 변경"
              className="absolute bottom-0 right-0 size-8 rounded-full bg-primary-500 border-2 border-white flex items-center justify-center disabled:opacity-60"
              onClick={handleAvatarClick}
              disabled={isUploadingAvatar}
            >
              <CameraIcon />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarFileChange}
            />
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
              maxLength={12}
            />
            {isNicknameChanged && nicknameAvailable !== null && (
              <span className={`text-caption ${nicknameAvailable ? "text-primary-500" : "text-secondary-500"}`}>
                {nicknameAvailable ? "사용 가능한 닉네임이에요" : "이미 사용 중인 닉네임이에요"}
              </span>
            )}
            <div className="pt-2">
              <NicknameRulesPanel />
            </div>
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
                onClick={handleWithdraw}
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
                onClick={async () => {
                  setLogoutModalOpen(false);
                  try { await logout(); } catch {}
                  clearTokens();
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
