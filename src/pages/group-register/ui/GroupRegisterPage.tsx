"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/shared/ui";
import { useToastStore } from "@/shared/model";
import { GroupForm, useCreateGroup } from "@/features/group-create";
import { useMyProfile } from "@/features/profile-edit";
import { ROUTES } from "@/shared/config/routes";
import type { CreateGroupBody } from "@/shared/api";

export function GroupRegisterPage() {
  const router = useRouter();
  const { mutate, isPending } = useCreateGroup();
  const { data: profile, isLoading: isProfileLoading } = useMyProfile();
  const isLocationVerified = Boolean(profile?.sido && profile?.sigungu);

  useEffect(() => {
    if (isProfileLoading) return;
    if (!isLocationVerified) {
      useToastStore.getState().show("동네 인증 후 모집을 등록할 수 있어요.");
      router.replace(ROUTES.mypageProfileEdit);
    }
  }, [isProfileLoading, isLocationVerified, router]);

  function handleSubmit(body: CreateGroupBody) {
    mutate(body, {
      onSuccess: (created) => {
        useToastStore.getState().show("소분 모집이 등록됐어요.");
        router.replace(ROUTES.groupDetail(created.id));
      },
    });
  }

  if (isProfileLoading || !isLocationVerified) {
    return (
      <div className="bg-white flex flex-col h-dvh">
        <PageHeader title="소분 모집 등록" />
        <div className="flex-1" />
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-col h-dvh">
      <PageHeader title="소분 모집 등록" />
      <main className="flex-1 overflow-y-auto min-h-0">
        <GroupForm submitLabel="등록하기" isSubmitting={isPending} onSubmit={handleSubmit} />
      </main>
    </div>
  );
}
