"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/shared/ui";
import { useToastStore } from "@/shared/model";
import { GroupForm } from "@/features/group-create";
import { useUpdateGroup } from "@/features/group-edit";
import { getGroupDetail, groupKeys, type CreateGroupBody } from "@/shared/api";
import { ROUTES } from "@/shared/config/routes";

type Props = { groupId: string };

export function GroupEditPage({ groupId }: Props) {
  const router = useRouter();
  const { data: group, isLoading } = useQuery({
    queryKey: groupKeys.detail(groupId),
    queryFn: () => getGroupDetail(groupId),
  });
  const { mutate, isPending } = useUpdateGroup(groupId);

  useEffect(() => {
    if (!group) return;
    if (!group.isMine) {
      useToastStore.getState().show("본인 모집글만 수정할 수 있어요.");
      router.replace(ROUTES.groupDetail(groupId));
      return;
    }
    if (group.status !== "open") {
      useToastStore.getState().show("모집 중일 때만 수정할 수 있어요.");
      router.replace(ROUTES.groupDetail(groupId));
    }
  }, [group, router, groupId]);

  function handleSubmit(body: CreateGroupBody) {
    mutate(body, {
      onSuccess: () => {
        useToastStore.getState().show("모집글이 수정됐어요.");
        router.replace(ROUTES.groupDetail(groupId));
      },
    });
  }

  return (
    <div className="bg-white flex flex-col h-dvh">
      <PageHeader title="소분 모집 수정" />
      <main className="flex-1 overflow-y-auto min-h-0">
        {isLoading || !group ? (
          <div className="px-5 py-10 text-body2 text-gray-500">불러오는 중…</div>
        ) : (
          <GroupForm
            initial={{
              category: group.category,
              productName: group.productName,
              store: group.store,
              branch: group.branch,
              targetCount: group.targetCount,
              pricePerPerson: group.pricePerPerson,
              location: group.location,
              meetAt: group.meetAt,
              description: group.description,
            }}
            submitLabel="수정하기"
            isSubmitting={isPending}
            onSubmit={handleSubmit}
          />
        )}
      </main>
    </div>
  );
}
