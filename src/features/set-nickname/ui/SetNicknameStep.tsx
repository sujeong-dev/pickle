"use client";

import { useState } from "react";
import { Button, Input } from '@/shared/ui';
import { useSetNickname } from "../model/useSetNickname";
import { useCheckNickname, useSignup } from "../api/useNickname";

function NicknameRulesPanel() {
  return (
    <div className="flex flex-col gap-2 bg-badge-caution-bg rounded-[6px] p-3 w-full">
      <div className="flex items-center gap-2">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="8" cy="8" r="7.5" stroke="#F57F17" />
          <path
            d="M8 5V8.5"
            stroke="#F57F17"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="8" cy="11" r="0.75" fill="#F57F17" />
        </svg>
        <span className="text-caption font-bold text-gray-700">닉네임 규칙</span>
      </div>
      <p className="text-caption text-gray-700">
        • 한글 / 영문 / 숫자 / 밑줄로 이루어진 2~12자
      </p>
      <p className="text-caption text-gray-700">• 30일간은 변경할 수 없어요.</p>
      <p className="text-caption text-gray-700">
        • 욕설, 비속어나 부적절한 단어가 포함될 경우 닉네임 등록이 제한되거나
        등록이 되더라도 관리자에 의해 삭제될 수 있습니다.
      </p>
    </div>
  );
}

interface SetNicknameStepProps {
  onNext?: () => void;
  onSubmit?: (nickname: string) => void | Promise<void>;
}

export function SetNicknameStep({ onNext, onSubmit }: SetNicknameStepProps) {
  const { nickname, setNickname, isValid, handleClear } = useSetNickname();
  const checkMutation = useCheckNickname();
  const signup = useSignup();

  const [checkError, setCheckError] = useState(false);

  async function handleSubmit() {
    const result = await checkMutation.mutateAsync(nickname);
    if (!result.available) {
      setCheckError(true);
      return;
    }
    setCheckError(false);
    if (onSubmit) {
      await onSubmit(nickname);
    } else {
      await signup.mutateAsync(nickname);
      onNext?.();
    }
  }

  return (
    <main className="flex flex-col min-h-svh bg-white w-full">
      <section className="flex flex-col flex-1 gap-5 px-5 py-3">
        <div className="flex flex-col gap-2">
          <h1 className="text-[26px] font-bold text-gray-900 leading-tight">
            닉네임을 설정해주세요
          </h1>
          <p className="text-body2 text-gray-600">
            다른 피클러들에게 보이는 이름이에요
          </p>
        </div>

        <div className="flex flex-col gap-15">
          <div className="flex flex-col gap-1">
            <Input
              variant={checkError ? "error" : "default"}
              placeholder="사용하실 닉네임을 입력해주세요."
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                if (checkError) setCheckError(false);
              }}
              onClear={() => {
                handleClear();
                if (checkError) setCheckError(false);
              }}
              maxLength={12}
            />
            {checkError && (
              <p className="text-caption text-secondary-500">사용하실 수 없는 닉네임입니다.</p>
            )}
          </div>
          <NicknameRulesPanel />
        </div>
      </section>

      <div className="sticky bottom-0 px-5 pb-5 bg-white">
        <Button
          size="lg"
          disabled={!isValid || checkMutation.isPending || (onSubmit ? false : signup.isPending)}
          onClick={handleSubmit}
        >
          다음
        </Button>
      </div>
    </main>
  );
}
