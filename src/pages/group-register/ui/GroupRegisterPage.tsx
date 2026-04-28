"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/shared/ui";
import { useToastStore } from "@/shared/model";
import { GroupForm, useCreateGroup } from "@/features/group-create";
import { ROUTES } from "@/shared/config/routes";
import type { CreateGroupBody } from "@/shared/api";

export function GroupRegisterPage() {
  const router = useRouter();
  const { mutate, isPending } = useCreateGroup();

  function handleSubmit(body: CreateGroupBody) {
    mutate(body, {
      onSuccess: (created) => {
        useToastStore.getState().show("소분 모집이 등록됐어요.");
        router.replace(ROUTES.groupDetail(created.id));
      },
    });
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
